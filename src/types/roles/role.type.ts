import { ActiveStatus } from '@/modules/shared/constants';

export interface IRole {
  id?: number;
  code: string;
  name: string;
  createdUser?: string;
  createdDate?: string;
  modifiedUser?: string;
  modifiedDate?: string;
  note?: string;
  actived: ActiveStatus;
}
