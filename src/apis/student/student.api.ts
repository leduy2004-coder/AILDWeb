import http from '@/lib/http';
import { IApiResponse } from '@/types/shared';
import { API_PREFIX } from '@/apis/constants/api.constant';
import { IStudentDashboardResponse } from '@/types/student/student-dashboard.type';

export async function getStudentDashboard(): Promise<IApiResponse<IStudentDashboardResponse>> {
  const { payload } = await http.get<IApiResponse<IStudentDashboardResponse>>(
    `${API_PREFIX.AILD}/student/dashboard`
  );
  return payload;
}

export async function getStudentCertificateBlob(): Promise<Blob> {
  const response = await http.get(`${API_PREFIX.AILD}/student/dashboard/certificate`, {
    responseType: 'blob', // Important for downloading files
  });
  // Next.js fetch interceptor returns the raw Response for blobs if configured, or axios returns data.
  // Assuming 'http.get' resolves with the Blob or { payload: Blob }.
  return response.payload ? (response.payload as Blob) : (response as any as Blob);
}

export const StudentApi = {
  getStudentDashboard,
  getStudentCertificateBlob,
};
