import { ISourcePassage } from './source-document.type';

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
  type: 'MULTIPLE_CHOICE';
  content: string;
  status: 'DRAFT' | 'PUBLISHED' | 'REJECTED';
  options?: IQuestionOption[];
  difficultyIndex?: number;
  updatedAt?: string;
  sourceChunks?: ISourcePassage[];
}

export interface IQuestionRequest {
  domainId: number;
  levelId: number;
  type: string;
  content: string;
  status: string;
  options?: IQuestionOption[];
  sourceChunkIds?: number[];
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
  applicationArea?: string;
  notes?: string;
}
