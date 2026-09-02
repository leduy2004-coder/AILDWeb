import { AnyType } from '../shared';

export interface IMenuPermission {
  id: number;
  code: string;
  icon: string | null;
  link: string | null;
  name: string | null;
  type: 'group' | 'basic';
  title: string | null;
  target: string | null;
  subtitle: string | null;
  execType: 'TC' | 'TT';
  parentId: number;
  externalLink: string | null;
  navigationIconId: number;
  navigationTypeId: number;
  path: string;
  lvl: number;
  priAccess: string[];
  priRead: string[];
  priInsert: string[];
  priUpdate: string[];
  priApprove?: string[];
  priAdminApprove?: string[];
  priDelete: string[];
  priImport: string[];
  priExport: string[];
  children: IMenuPermission[];
}

export interface IMenu {
  data: IMenuPermission;
  parentId: number;
  children: IMenu[];
}

export interface IMenuSidebar {
  [x: string]: AnyType;
  id?: number;
  code?: string;
  navlabel?: boolean;
  subheader?: string;
  title?: string;
  icon?: AnyType;
  href?: string;
  children?: IMenuSidebar[];
  bgcolor?: AnyType;
  chip?: string;
  isHidden?: boolean;
  chipColor?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'error'
    | 'info'
    | 'success'
    | 'warning';
  variant?: 'filled' | 'outlined';
  external?: boolean;
}
