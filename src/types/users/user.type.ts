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
  email?: string;
  status?: boolean;
  password?: string;
  role?: IRoleRequest;
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
  role: { id?: number; code: string; name?: string } | RoleType;
  name: string;
  email: string;
  status?: boolean;
  createdDate?: string;
  modifiedDate?: string;
  updatedAt?: string;
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