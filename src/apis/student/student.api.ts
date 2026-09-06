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

export const StudentApi = {
  getStudentDashboard,
};
