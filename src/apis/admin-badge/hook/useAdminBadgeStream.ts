import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ADMIN_BADGE_QUERY_KEYS, AdminBadgeApi } from '../admin-badge.api';

/** Wait before reconnecting after the stream drops (server restart, token expiry, network) */
const RECONNECT_DELAY_MS = 5_000;
const BADGE_EVENT = 'badges';

/** True when one raw SSE event block ("event: x\ndata: y") is a badge change */
const isBadgeEvent = (block: string) =>
  block.split('\n').some((line) => line.startsWith('event:') && line.slice('event:'.length).trim() === BADGE_EVENT);

/**
 * Keeps one live connection while the admin layout is open; every badge change refetches the counts.
 * Mount once (admin layout), not per menu item.
 */
export function useAdminBadgeStream(enabled: boolean) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled) return;

    let stopped = false;
    let controller: AbortController | null = null;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    const refetchBadges = () => queryClient.invalidateQueries({ queryKey: ADMIN_BADGE_QUERY_KEYS.all });

    const connect = async () => {
      controller = new AbortController();
      try {
        const res = await AdminBadgeApi.openAdminBadgeStream(controller.signal);
        if (!res.ok || !res.body) throw new Error(`Badge stream HTTP ${res.status}`);

        // Changes may have happened while disconnected
        refetchBadges();

        const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
        let buffer = '';
        while (!stopped) {
          const { value, done } = await reader.read();
          if (done) break;
          // Events are separated by a blank line; keep the unfinished tail for the next chunk
          buffer += value.replace(/\r\n/g, '\n');
          const blocks = buffer.split('\n\n');
          buffer = blocks.pop() ?? '';
          if (blocks.some(isBadgeEvent)) refetchBadges();
        }
      } catch {
        // Dropped or refused (e.g. expired token, renewed by the next regular API call): retry below
      }
      if (!stopped) retryTimer = setTimeout(connect, RECONNECT_DELAY_MS);
    };

    connect();

    return () => {
      stopped = true;
      controller?.abort();
      clearTimeout(retryTimer);
    };
  }, [enabled, queryClient]);
}
