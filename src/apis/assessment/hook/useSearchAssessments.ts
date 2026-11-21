import { useQuery } from '@tanstack/react-query';
import {
  AdminAssessmentApi,
  ADMIN_ASSESSMENT_QUERY_KEYS,
} from '../admin-assessment.api';

/** @param sort score_desc | score_asc; omitted = newest first */
export function useSearchAssessments(page: number, limit: number, search?: string, status?: string, sort?: string) {
  return useQuery({
    queryKey: ADMIN_ASSESSMENT_QUERY_KEYS.list(page, limit, search, status, sort),
    queryFn: () => AdminAssessmentApi.getAssessments(page, limit, search, status, sort),
  });
}
