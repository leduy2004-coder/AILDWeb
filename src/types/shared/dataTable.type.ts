export enum TableAction {
  detail,
  edit,
  delete,
  addward,
  listDetail,
  cancel,
  showPhoto,
  showQrCode,
  copy,
  exportStaff,
  importStaff,
}

export const enum FilterType {
  text = 'text',
  date = 'date',
  number = 'number',
  set = 'set',
  boolean = 'boolean',
}

export const enum FilterOperator {
  equals = 'equals',
  notEqual = 'notEqual',
  contains = 'contains',
  notContains = 'notContains',
  startsWith = 'startsWith',
  endsWith = 'endsWith',
  blank = 'blank',
  notBlank = 'notBlank',
  lessThan = 'lessThan',
  lessThanOrEqual = 'lessThanOrEqual',
  greaterThan = 'greaterThan',
  greaterThanOrEqual = 'greaterThanOrEqual',
  inRange = 'inRange',
  in = 'in',
}

export type FilterParams = {
  field: string;
  filter: string;
  type: FilterType;
  filterType: FilterOperator;
};

export type TablePagination = {
  pageSize: number;
  currentPage: number;
};
