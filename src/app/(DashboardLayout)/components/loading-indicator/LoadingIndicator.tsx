import { Loading } from '@/modules/shared/components';

import { useSelector } from '@/store/hooks';
import { AppState } from '@/store/store';

const LoadingIndicator = () => {
  const { isLoading } = useSelector(
    (state: AppState) => state.loadingIndicator,
  );

  return <>{isLoading && <Loading />}</>;
};

export default LoadingIndicator;
