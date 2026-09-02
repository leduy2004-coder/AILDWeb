import http from '@/lib/http';
import { isClient } from '@/lib/http';
import { IApiResponse } from '@/types/shared';
import envConfig from '@/lib/config';

import { MediaFileDto } from '@/types/file/file.type';

export async function uploadFile(file: File): Promise<IApiResponse<MediaFileDto>> {
  const formData = new FormData();
  formData.append('file', file);
  
  const { payload } = await http.post<IApiResponse<MediaFileDto>>('/api/v1/file/files/upload', formData);
  return payload;
}

export async function getFileByUuid(uuid: string): Promise<IApiResponse<MediaFileDto>> {
  const { payload } = await http.get<IApiResponse<MediaFileDto>>(`/api/v1/file/files/${uuid}`);
  return payload;
}

export async function deleteFileByUuid(uuid: string): Promise<IApiResponse<boolean>> {
  const { payload } = await http.delete<IApiResponse<boolean>>(`/api/v1/file/files/${uuid}`);
  return payload;
}

/**
 * Legacy fetch logic for downloading raw binary streams
 */
export async function fetchFile(fileId: number | number) {
  const baseUrl = envConfig.NEXT_PUBLIC_API_ENDPOINT;
  const url = `${baseUrl}/api/v1/files/${fileId}`;
  
  const headers: HeadersInit = {};
  if (isClient()) {
    const sessionToken = localStorage.getItem("sessionToken");
    if (sessionToken) {
      headers.Authorization = `Bearer ${sessionToken}`;
    }
  }

  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error('Failed to fetch file');
  }

  const blob = await res.blob();
  
  return {
    data: blob,
    headers: {
      'content-type': res.headers.get('content-type'),
      'content-disposition': res.headers.get('content-disposition'),
    }
  };
}