import { AnyType } from '@/types/shared';

export type Profile = {
  id?: string | number;
  avatar?: string;
  name?: string;
  time?: string;
};

export interface BlogType {
  id?: string;
  profile?: Profile;
  time?: Date;
  comment?: string;
  replies?: AnyType[];
}

export interface BlogPostType {
  id?: number;
  title?: AnyType;
  content?: string;
  coverImg?: string;
  createdAt?: Date;
  view?: number;
  share?: number;
  category?: string;
  featured?: boolean;
  author?: Profile;
  comments?: AnyType[];
}
