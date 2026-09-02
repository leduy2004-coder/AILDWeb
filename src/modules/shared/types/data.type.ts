import { FilterOperator, FilterType } from '@/types/shared';

export type ItemOption = {
  value: string;
  label?: string;
};

type FilterField = 'filter' | 'values' | 'dateFrom' | 'dateTo' | 'inRange';

export type SelectFilterItemType = { value: string };
export type SelectFilterType = {
  item: SelectFilterItemType;
  applyValue: ({ value }: SelectFilterItemType) => void;
};
export type CustomMapper<T> = Partial<
  Record<
    keyof T,
    {
      type: FilterOperator;
      filterType: FilterType;
      filterField?: FilterField;
    }
  >
>;
