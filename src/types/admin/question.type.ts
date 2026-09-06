export interface IQuestionOption {
  id?: number;
  content: string;
  isCorrect: boolean;
  displayOrder: number;
}

export interface IQuestion {
  id: number;
  domainId: number;
  levelId: number;
  type: 'MULTIPLE_CHOICE' | 'PRACTICAL';
  content: string;
  rubric?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'REJECTED';
  options?: IQuestionOption[];
  difficultyIndex?: number;
  updatedAt?: string;
}

export interface IQuestionRequest {
  domainId: number;
  levelId: number;
  type: string;
  content: string;
  rubric?: string;
  status: string;
  options?: IQuestionOption[];
}

export interface IQuestionFilter {
  domainId?: number | null;
  levelId?: number | null;
  status?: string | null;
  keyword?: string | null;
  page?: number;
  size?: number;
}

export interface IAIGenerateQuestionRequest {
  domainId: number;
  levelId: number;
  type: string;
  applicationArea?: string;
  notes?: string;
}
