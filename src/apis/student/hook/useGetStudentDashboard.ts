import { useQuery } from '@tanstack/react-query';
import { StudentApi } from '../student.api';

export function useGetStudentDashboard() {
  return useQuery({
    queryKey: ['student_dashboard'],
    queryFn: () => StudentApi.getStudentDashboard(),
  });
}
