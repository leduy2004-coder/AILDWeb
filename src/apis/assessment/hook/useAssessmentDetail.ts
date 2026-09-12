import { useQuery } from '@tanstack/react-query';
import {
  AdminAssessmentApi,
  ADMIN_ASSESSMENT_QUERY_KEYS,
} from '../admin-assessment.api';

export function useAssessmentDetail(id: number) {
  return useQuery({
    queryKey: ADMIN_ASSESSMENT_QUERY_KEYS.detail(id),
    queryFn: () => AdminAssessmentApi.getAssessmentDetail(id),
    enabled: !!id,
  });
}
