export interface Option {
  value?: string | number;
  name?: string;
  label: string;
}

export enum SortDirection {
  ASCENDING = "asc",
  DESCENDING = "desc",
}
