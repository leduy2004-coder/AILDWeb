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
}

export interface IResourceRequest {
  title: string;
  description?: string;
  url: string;
  domainId: number;
  targetLevelId: number;
}
