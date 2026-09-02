import { RoleType } from "@/modules/shared/constants";

export interface IRoleRequest {
  code?: string;
  name?: string;
}

export interface IUserRequest {
  id?: number;
  password?: string;
  status?: boolean;
  name?: string;
  email?: string;
  address?: string;
  role?: IRoleRequest;
  code?: string;
  phone?: string;
  description?: string;
  subjectId?: number[];
  numberExperiences?: number;
  degreeImgIds?: string[];
  educationIds?: number[];
  educationId?: number;
  learningGoal?: string;
}

export interface IUserUpdateRequest {
  id?: number;
  name?: string;
  status?: boolean;
  password?: string;
  phone?: string;
  description?: string;
  subjectId?: number[];
  numberExperiences?: number;
  degreeImgIds?: string[];
  educationIds?: number[];
  educationId?: number;
  learningGoal?: string;
}

export interface IUser {
  id: number;
  code?: string;
  role: RoleType;
  name: string;
  email: string;
  status?: boolean;
  phone?: string;
  description?: string;
  subjectId?: number[];
  numberExperiences?: number;
  degreeImgIds?: string[];
  educationIds?: number[];
  educationId?: number;
  learningGoal?: string;
}

export interface IUserStats {
  totalUsers: number;
  totalUsersIncrease: number;
  activeTutors: number;
  activeTutorsIncrease: number;
  activeStudents: number;
  activeStudentsIncrease: number;
  lockedAccounts: number;
  lockedAccountsIncrease: number;
}