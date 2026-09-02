import { ActiveStatus } from '@/modules/shared/constants';

export interface INavigation {
  id?: number;
  code: string;
  title: string;
  subtitle?: string;
  name: string;
  execType: string;
  parentCode?: string;
  navigationTypeCode?: string;
  navigationIconCode?: string;
  link: string;
  externalLink?: string;
  target?: string;
  note?: string;
  actived: ActiveStatus;
  navigationIconId?: number;
  navigationTypeId?: number;
  parentId?: number;
}
