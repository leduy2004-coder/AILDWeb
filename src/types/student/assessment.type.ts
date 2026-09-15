export interface IAssessmentStartResponse {
  assessmentId: number;
  totalQuestions: number;
  durationMinutes: number;
  startedAt: string;
}

export interface IOptionDto {
  id: number;
  content: string;
  displayOrder: number;
}

export interface INextQuestionResponse {
  isFinished?: boolean;
  finished?: boolean;
  currentIndex?: number;
  totalQuestions?: number;
  questionId?: number;
  content?: string;
  type?: string;
  domainName?: string;
  levelName?: string;
  options?: IOptionDto[];
}

export interface ISubmitAnswerRequest {
  questionId: number;
  selectedOptionId?: number;
  answerText?: string;
}

export interface IDomainScoreDto {
  domainCode: string;
  domainName: string;
  score: number;
  achievedLevelCode?: string;
}

export interface IAssessmentSummaryResponse {
  assessmentId: number;
  status: string;
  finalScore?: number;
  domainScores: IDomainScoreDto[];
}
