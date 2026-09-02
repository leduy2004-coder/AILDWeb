import { useSelector } from 'react-redux';

import { useDispatch } from '@/store/hooks';
import { AppState } from '@/store/store';
import { hideLoading, showLoading } from '@/store/loading-indicator';

export function useLoadingIndicator() {
  const dispatch = useDispatch();
  const { isLoading } = useSelector(
    (state: AppState) => state.loadingIndicator,
  );

  return {
    isLoading,
    showLoading: () => dispatch(showLoading()),
    hideLoading: () => dispatch(hideLoading()),
  };
}
