import { useQuery } from '@tanstack/react-query';
import {
  AdminAssessmentApi,
  ADMIN_ASSESSMENT_QUERY_KEYS,
} from '../admin-assessment.api';

export function useSearchAssessments(page: number, limit: number, search?: string, status?: string) {
  return useQuery({
    queryKey: ADMIN_ASSESSMENT_QUERY_KEYS.list(page, limit, search, status),
    queryFn: () => AdminAssessmentApi.getAssessments(page, limit, search, status),
  });
}
