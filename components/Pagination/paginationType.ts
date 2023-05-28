/* eslint-disable no-unused-vars */
export type TPaginationProps = {
  pageSize: number;
  current?: number;
  total?: number;
  currentOffset?: number;
};

export type TPagination = Required<TPaginationProps> & {
  totalPage: number;
  set: React.Dispatch<Partial<TPaginationProps>>;
  next: () => void;
  back: () => void;
  goTo: (page: number) => void;
  first: () => void;
  last: () => void;
};
