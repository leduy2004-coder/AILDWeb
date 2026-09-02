import { useQuery } from '@tanstack/react-query';
import { StudentApi } from '../student.api';

export const GET_STUDENTS_QUERY_KEY = 'GET_STUDENTS_QUERY_KEY';

export function useGetStudents(page = 0, size = 10, search = '') {
  return useQuery({
    queryKey: [GET_STUDENTS_QUERY_KEY, page, size, search],
    queryFn: () => StudentApi.getStudents(page, size, search),
  });
}
