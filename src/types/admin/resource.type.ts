export interface IResource {
  id: number;
  title: string;
  description?: string;
  url: string;
  domainId: number;
  targetLevelId: number;
  createdBy?: number | string;
  createdAt?: string;
  updatedAt?: string;
  createdDate?: string;
  modifiedDate?: string;
  likeCount?: number;
  reportCount?: number;
}

export interface IResourceLike {
  userId: number;
  name: string;
  email: string;
  likedAt: string;
}

export interface IResourceRequest {
  title: string;
  description?: string;
  url: string;
  domainId: number;
  targetLevelId: number;
}

export interface IResourceReport {
  id: number;
  userId: number;
  name: string;
  email: string;
  reason: string;
  reportedAt: string;
}
