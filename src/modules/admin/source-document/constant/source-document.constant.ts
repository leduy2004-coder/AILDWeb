import { ChipProps } from '@mui/material';

export const DOCUMENT_STATUS_COLOR: Record<string, ChipProps['color']> = {
  PENDING: 'default',
  PROCESSING: 'info',
  READY: 'success',
  FAILED: 'error',
};

export const CHUNK_STATUS_COLOR: Record<string, ChipProps['color']> = {
  ACTIVE: 'success',
  UNLABELED: 'warning',
  IGNORED: 'default',
};

export const DOCUMENT_STATUSES = ['PENDING', 'PROCESSING', 'READY', 'FAILED'] as const;
export const CHUNK_STATUSES = ['ACTIVE', 'UNLABELED', 'IGNORED'] as const;

export const DOMAIN_IDS = [1, 2, 3, 4];

/** Must match DomainLabeler.LOW_CONFIDENCE in aild-service. */
export const LOW_CONFIDENCE = 0.4;
/** A domain with fewer active passages than this is highlighted as thin coverage. */
export const COVERAGE_WARNING_THRESHOLD = 15;
/** ErrorCode.DUPLICATE_SOURCE_DOCUMENT in aild-service: the same PDF is already uploaded. */
export const DUPLICATE_DOCUMENT_ERROR_CODE = 1894;
/** Must match spring.servlet.multipart.max-file-size. */
export const MAX_UPLOAD_MB = 20;
