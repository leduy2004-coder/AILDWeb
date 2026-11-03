export type SourceDocumentStatus = 'PENDING' | 'PROCESSING' | 'READY' | 'FAILED';
export type SourceChunkStatus = 'ACTIVE' | 'UNLABELED' | 'IGNORED';

export interface ISourceDocument {
  id: number;
  title: string;
  sourceName?: string;
  publishedYear?: number;
  fileName?: string;
  pageCount?: number;
  chunkCount?: number;
  activeChunkCount: number;
  unlabeledChunkCount: number;
  ignoredChunkCount: number;
  status: SourceDocumentStatus;
  errorMessage?: string;
  createdDate?: string;
}

export interface ISourceDocumentUploadRequest {
  file: File;
  title?: string;
  sourceName?: string;
  publishedYear?: number;
}

export interface ISourceDocumentFilter {
  status?: string | null;
  keyword?: string;
  page?: number;
  size?: number;
}

export interface ISourceChunk {
  id: number;
  documentId: number;
  chunkIndex: number;
  pageFrom?: number;
  pageTo?: number;
  content: string;
  wordCount?: number;
  suggestedDomainId?: number;
  suggestConfidence?: number;
  domainId?: number;
  labelSource?: 'AUTO' | 'MANUAL';
  status: SourceChunkStatus;
  ignoreReason?: string;
}

export interface ISourceChunkFilter {
  documentId?: number;
  status?: string | null;
  domainId?: number | null;
  lowConfidence?: boolean;
  page?: number;
  size?: number;
}

export interface ISourceChunkLabelRequest {
  chunkIds: number[];
  domainId: number;
}

export interface ISourceCoverage {
  domainId: number;
  chunkCount: number;
}

/** A source passage cited by an AI-generated question. */
export interface ISourcePassage {
  chunkId: number;
  documentId: number;
  documentTitle?: string;
  sourceName?: string;
  pageFrom?: number;
  pageTo?: number;
  content: string;
}
