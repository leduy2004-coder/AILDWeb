import http from '@/lib/http';
import { IApiResponse } from '@/types/shared';
import { API_PREFIX } from '@/apis/constants/api.constant';
import {
  IAssessmentStartResponse,
  INextQuestionResponse,
  ISubmitAnswerRequest,
  IAssessmentSummaryResponse,
} from '@/types/student/assessment.type';

export * from '@/types/student/assessment.type';

export const ASSESSMENT_QUERY_KEYS = {
  all: ['assessment'] as const,
  nextQuestion: (assessmentId: number) => ['assessment', 'nextQuestion', assessmentId] as const,
  summary: (assessmentId: number) => ['assessment', 'summary', assessmentId] as const,
};

const BASE_URL = `${API_PREFIX.AILD}/student/assessment`;

export async function startAssessment(): Promise<IApiResponse<IAssessmentStartResponse>> {
  const { payload } = await http.post<IApiResponse<IAssessmentStartResponse>>(`${BASE_URL}/start`, {});
  return payload;
}

export async function getNextQuestion(assessmentId: number): Promise<IApiResponse<INextQuestionResponse>> {
  const { payload } = await http.get<IApiResponse<INextQuestionResponse>>(`${BASE_URL}/${assessmentId}/next-question`);
  return payload;
}

export async function submitAnswer(
  assessmentId: number,
  data: ISubmitAnswerRequest
): Promise<IApiResponse<void>> {
  const { payload } = await http.post<IApiResponse<void>>(`${BASE_URL}/${assessmentId}/submit-answer`, data);
  return payload;
}

export async function finishAssessment(
  assessmentId: number
): Promise<IApiResponse<IAssessmentSummaryResponse>> {
  const { payload } = await http.post<IApiResponse<IAssessmentSummaryResponse>>(`${BASE_URL}/${assessmentId}/finish`, {});
  return payload;
}

export const AssessmentApi = {
  startAssessment,
  getNextQuestion,
  submitAnswer,
  finishAssessment,
};
