import z from 'zod';
import { EmptyObject } from './common.type';
import { FilterOperator, FilterType } from './dataTable.type';
import { GridSortDirection } from '@mui/x-data-grid';

export interface IApiResponse<T> {
  code: number;
  message?: string;
  result: T;
}

export type FilterModel<T> = {
  field: keyof T;
  filterType: FilterType;
  type: FilterOperator;
  filter?: string | number;
  filterTo?: string | number;
  values?: string[] | number[];
  dateFrom?: string;
  dateTo?: string;
};

export interface IListRequest<T> {
  startRow: string;
  endRow: string;
  filterModel:
    | Partial<Record<keyof T, Omit<FilterModel<T>, 'field'>>>
    | EmptyObject;
  sortModel: SortModel[];
}

export interface IListResponse<T> {
  data: T[];
  lastRow: number;
  secondaryColumnFields: number | null;
  message: {
    code: 'OK' | 'EXCEPTION' | 'ERROR';
    description: string;
  };
  exception?: string;
}

export interface IDetailResponse<T> {
  message: {
    code: 'OK' | 'EXCEPTION' | 'ERROR';
    description: string;
  };
  exception?: string;
  data: T;
}

export interface IResponse<T> {
  message: {
    code: 'OK' | 'EXCEPTION';
    description: string;
  };
  exception?: string;
  data?: T[];
}

export type SortModel = {
  colId: string;
  sort: GridSortDirection;
};

export interface ApiError {
  response?: {
    data?: {
      exception?: string;
      message?: {
        exception?: string;
      };
    };
  };
}

export interface IPageResponse<T> {
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  data: T[];
  content?: T[];
}

export const PageResponse = <T extends z.ZodTypeAny>(schema: T) =>
  z.object({
    currentPage: z.number(),
    pageSize: z.number(),
    totalElements: z.number(),
    totalPages: z.number(),
    data: z.array(schema),
  });
