export interface IAssessmentConfigResponse {
  totalQuestions: number;
  durationMinutes: number;
  chatMaxTurns: number;
  maxViolations: number;
  requireFullscreen: boolean;
  // The student has an unfinished assessment: the rules screen offers to continue it
  hasActiveAssessment: boolean;
}

export interface IAssessmentStartResponse {
  assessmentId: number;
  totalQuestions: number;
  durationMinutes: number;
  chatMaxTurns: number;
  startedAt: string;
  status: 'IN_PROGRESS' | 'INTERVIEWING' | 'COMPLETED';
  remainingSeconds: number;
  violationCount: number;
  maxViolations: number;
  // Admin setting: gate the test behind fullscreen and count leaving it as a violation
  requireFullscreen: boolean;
  // Present when status is INTERVIEWING or COMPLETED (resumed assessment)
  summary?: IAssessmentSummaryResponse | null;
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
  mcqScore?: number;
  interviewScore?: number;
  domainScores: IDomainScoreDto[];
}

export interface IChatRequest {
  message: string;
}

export interface IChatResponse {
  reply: string;
  isFinished: boolean;
  finalScore?: number;
  interviewScore?: number;
}

export interface IViolationResponse {
  violationCount: number;
  maxViolations: number;
  status: string;
  // Present when the assessment is COMPLETED (limit reached or time already over)
  summary?: IAssessmentSummaryResponse | null;
}

export interface IChatMessageDto {
  id: number;
  role: 'USER' | 'AI';
  content: string;
}
