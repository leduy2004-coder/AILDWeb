import { ActiveStatus } from '@/modules/shared/constants';

export interface IPermission {
  id: number;
  navigationCode?: string;
  privilegeCode?: string;
  roleCode?: string;
  createdUser?: string;
  createdDate?: string;
  modifiedUser?: string;
  modifiedDate?: string;
  note?: string;
  actived: ActiveStatus;
  navigationId: 200;
  privilegeId: 1;
  roleId: 1005;
}

export interface IPermissionParam {
  navigationId: number;
  navigationCode: string;
  privilegeId: number;
  privilegeCode: string;
}

export interface IPermissionBody {
  roleId: number;
  roleCode: string;
  permissions: IPermissionParam[];
}

export enum Permission {
  CAN_ACCESS = 'priAccess',
  CAN_READ = 'priRead',
  CAN_INSERT = 'priInsert',
  CAN_UPDATE = 'priUpdate',
  CAN_APPROVE = 'priApprove',
  CAN_ADMIN_APPROVE = 'priAdminApprove',
  CAN_DELETE = 'priDelete',
  CAN_IMPORT = 'priImport',
  CAN_EXPORT = 'priExport',
}

export interface RolePermission {
  subject: string;
  actions: Permission[];
}
