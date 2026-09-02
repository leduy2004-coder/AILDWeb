import { AnyType } from '@/types/shared';

export interface NotesType {
  id: number;
  color?: string;
  title?: string;
  datef?: AnyType | string;
  deleted: boolean;
}
