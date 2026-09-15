export interface IAdminAssessmentListDto {
  id: number;
  studentId: number;
  studentName: string;
  studentEmail: string;
  startedAt: string;
  submittedAt: string | null;
  status: string;
  finalScore: number | null;
}

export interface IQuestionOptionDto {
  id: number;
  content: string;
  isCorrect: boolean;
}

export interface IAdminAssessmentAnswerDto {
  id: number;
  questionId: number;
  questionContent: string;
  questionType: string;
  rubric: string | null;
  answerText: string | null;
  selectedOptionId: number | null;
  isCorrect: boolean;
  finalScore: number;
  aiScore: number | null;
  aiJustification: string | null;
  answeredAt: string;
  options: IQuestionOptionDto[];
}

export interface IResourceResponseDto {
  id: number;
  title: string;
  description: string;
  url: string;
  domainId: number;
  targetLevelId: number;
  createdBy: string;
  createdDate: string;
  modifiedDate: string;
}

export interface IAdminAssessmentDetailDto {
  info: IAdminAssessmentListDto;
  aiFeedback: string | null;
  recommendedResources: IResourceResponseDto[];
  answers: IAdminAssessmentAnswerDto[];
}
