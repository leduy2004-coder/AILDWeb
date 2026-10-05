export interface IDomain {
  id: number;
  code: string;
  name: string;
  description: string | null;
  displayOrder: number;
}

export interface IDomainRequest {
  code: string;
  name: string;
  description?: string | null;
  displayOrder: number;
}

export interface ILevel {
  id: number;
  code: string;
  name: string;
  displayOrder: number;
}

export interface ILevelRequest {
  code: string;
  name: string;
  displayOrder: number;
}
