import http from '@/lib/http';
import { IApiResponse, IPageResponse } from '@/types/shared/api.type';
import {
  ISourceChunk,
  ISourceChunkFilter,
  ISourceChunkLabelRequest,
  ISourceCoverage,
  ISourceDocument,
  ISourceDocumentFilter,
  ISourceDocumentUploadRequest,
} from '@/types/admin/source-document.type';
import { API_PREFIX } from '@/apis/constants/api.constant';

export const SOURCE_DOCUMENT_QUERY_KEYS = {
  all: ['source-documents'] as const,
  list: (filter: ISourceDocumentFilter) => ['source-documents', 'list', filter] as const,
  detail: (id: number) => ['source-documents', 'detail', id] as const,
  coverage: ['source-documents', 'coverage'] as const,
  chunks: (filter: ISourceChunkFilter) => ['source-documents', 'chunks', filter] as const,
};

const toQueryString = (filter: object) => {
  const queryParams = new URLSearchParams();
  Object.entries(filter).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      queryParams.append(key, value.toString());
    }
  });
  return queryParams.toString();
};

export async function getSourceDocuments(filter: ISourceDocumentFilter): Promise<IApiResponse<IPageResponse<ISourceDocument>>> {
  const { payload } = await http.get<IApiResponse<IPageResponse<ISourceDocument>>>(
    `${API_PREFIX.AILD_ADMIN}/source-documents?${toQueryString(filter)}`
  );
  return payload;
}

export async function getSourceDocumentById(id: number): Promise<IApiResponse<ISourceDocument>> {
  const { payload } = await http.get<IApiResponse<ISourceDocument>>(`${API_PREFIX.AILD_ADMIN}/source-documents/${id}`);
  return payload;
}

export async function uploadSourceDocument(data: ISourceDocumentUploadRequest): Promise<IApiResponse<ISourceDocument>> {
  const formData = new FormData();
  formData.append('file', data.file);
  if (data.title) formData.append('title', data.title);
  if (data.sourceName) formData.append('sourceName', data.sourceName);
  if (data.publishedYear) formData.append('publishedYear', data.publishedYear.toString());
  const { payload } = await http.post<IApiResponse<ISourceDocument>>(`${API_PREFIX.AILD_ADMIN}/source-documents`, formData);
  return payload;
}

export async function reprocessSourceDocument(id: number): Promise<IApiResponse<ISourceDocument>> {
  const { payload } = await http.post<IApiResponse<ISourceDocument>>(`${API_PREFIX.AILD_ADMIN}/source-documents/${id}/reprocess`, {});
  return payload;
}

export async function deleteSourceDocument(id: number): Promise<IApiResponse<string>> {
  const { payload } = await http.delete<IApiResponse<string>>(`${API_PREFIX.AILD_ADMIN}/source-documents/${id}`);
  return payload;
}

export async function getSourceCoverage(): Promise<IApiResponse<ISourceCoverage[]>> {
  const { payload } = await http.get<IApiResponse<ISourceCoverage[]>>(`${API_PREFIX.AILD_ADMIN}/source-documents/coverage`);
  return payload;
}

export async function getSourceChunks(filter: ISourceChunkFilter): Promise<IApiResponse<IPageResponse<ISourceChunk>>> {
  const { payload } = await http.get<IApiResponse<IPageResponse<ISourceChunk>>>(
    `${API_PREFIX.AILD_ADMIN}/source-chunks?${toQueryString(filter)}`
  );
  return payload;
}

export async function labelSourceChunks(data: ISourceChunkLabelRequest): Promise<IApiResponse<string>> {
  const { payload } = await http.put<IApiResponse<string>>(`${API_PREFIX.AILD_ADMIN}/source-chunks/bulk-label`, data);
  return payload;
}

export async function ignoreSourceChunks(chunkIds: number[]): Promise<IApiResponse<string>> {
  const { payload } = await http.put<IApiResponse<string>>(`${API_PREFIX.AILD_ADMIN}/source-chunks/bulk-ignore`, { chunkIds });
  return payload;
}

export async function restoreSourceChunks(chunkIds: number[]): Promise<IApiResponse<string>> {
  const { payload } = await http.put<IApiResponse<string>>(`${API_PREFIX.AILD_ADMIN}/source-chunks/bulk-restore`, { chunkIds });
  return payload;
}

export const sourceDocumentApi = {
  getSourceDocuments,
  getSourceDocumentById,
  uploadSourceDocument,
  reprocessSourceDocument,
  deleteSourceDocument,
  getSourceCoverage,
  getSourceChunks,
  labelSourceChunks,
  ignoreSourceChunks,
  restoreSourceChunks,
};
