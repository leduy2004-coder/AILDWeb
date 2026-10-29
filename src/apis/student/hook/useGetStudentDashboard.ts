import { useQuery } from '@tanstack/react-query';
import { StudentApi } from '../student.api';
import { getLocalStorageItem } from '@/modules/shared/utils';
import { AuthActionTypes } from '@/types/shared';

export function useGetStudentDashboard() {
  return useQuery({
    queryKey: ['student_dashboard'],
    queryFn: () => StudentApi.getStudentDashboard(),
    // Guests can view /home: without a token the call 401s and http.ts redirects to login
    enabled: !!getLocalStorageItem<string>(AuthActionTypes.ACCESS_TOKEN),
  });
}
