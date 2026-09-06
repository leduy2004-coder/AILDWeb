import http from '@/lib/http';
import { IApiResponse, IPageResponse } from '@/types/shared';
import { API_PREFIX } from '@/apis/constants/api.constant';
import { IQuestion, IQuestionFilter, IQuestionRequest, IAIGenerateQuestionRequest } from '@/types/admin/question.type';

export const QUESTION_QUERY_KEYS = {
  all: ['questions'] as const,
  list: (filter: IQuestionFilter) => ['questions', filter] as const,
  detail: (id: number) => ['questions', id] as const,
};

export async function getQuestions(filter: IQuestionFilter): Promise<IApiResponse<IPageResponse<IQuestion>>> {
  const queryParams = new URLSearchParams();
  Object.entries(filter).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      queryParams.append(key, value.toString());
    }
  });

  const { payload } = await http.get<IApiResponse<IPageResponse<IQuestion>>>(
    `${API_PREFIX.AILD_ADMIN}/questions?${queryParams.toString()}`
  );
  return payload;
}

export async function getQuestion(id: number): Promise<IApiResponse<IQuestion>> {
  const { payload } = await http.get<IApiResponse<IQuestion>>(`${API_PREFIX.AILD_ADMIN}/questions/${id}`);
  return payload;
}

export async function createQuestion(data: IQuestionRequest): Promise<IApiResponse<IQuestion>> {
  const { payload } = await http.post<IApiResponse<IQuestion>>(`${API_PREFIX.AILD_ADMIN}/questions`, data);
  return payload;
}

export async function updateQuestion(id: number, data: IQuestionRequest): Promise<IApiResponse<IQuestion>> {
  const { payload } = await http.put<IApiResponse<IQuestion>>(`${API_PREFIX.AILD_ADMIN}/questions/${id}`, data);
  return payload;
}

export async function deleteQuestion(id: number): Promise<IApiResponse<void>> {
  const { payload } = await http.delete<IApiResponse<void>>(`${API_PREFIX.AILD_ADMIN}/questions/${id}`);
  return payload;
}

export async function generateQuestionAI(data: IAIGenerateQuestionRequest): Promise<IApiResponse<any>> {
  const { payload } = await http.post<IApiResponse<any>>(`${API_PREFIX.AILD_ADMIN}/questions/generate-ai`, data);
  return payload;
}

export const QuestionApi = {
  getQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  generateQuestionAI,
};

