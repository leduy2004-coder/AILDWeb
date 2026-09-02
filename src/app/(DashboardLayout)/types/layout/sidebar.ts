import { AnyType } from '@/types/shared';

export interface navItemProps {
  item: {
    icon: string;
    href?: string;
    disabled?: boolean;
    title?: string;
    subtitle?: string;
    chip?: string;
    chipColor?: string;
    variant?: string;
    external?: boolean;
    id: number;
  };
}

export interface listItemType {
  component: AnyType;
  href?: string;
  target?: AnyType;
  to?: AnyType;
}
