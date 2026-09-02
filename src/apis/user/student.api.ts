import http from '@/lib/http';
import { IApiResponse, IPageResponse } from '@/types/shared';

// Ideally we'd have a specific type, but for now we can use a generic ProfileResponse type or any
// Let's map it to an interface
export interface IStudentProfile {
  id: number;
  code?: string;
  userId: number;
  name: string;
  email: string;
  phone: string;
  subjectId: number[];
  educationId: number;
  learningGoal?: string;
}

export const StudentApi = {
  getStudents: async (page = 0, size = 10, search?: string): Promise<IApiResponse<IPageResponse<IStudentProfile>>> => {
    let url = `/api/v1/tutor/students?page=${page}&size=${size}`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    const { payload } = await http.get<IApiResponse<IPageResponse<IStudentProfile>>>(url);
    return payload;
  }
};
