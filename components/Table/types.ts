/* eslint-disable no-unused-vars */
import { HTMLAttributes, ReactNode } from 'react';

export type TColumnRender<T> = {
  record: T;
  index: number;
  reverseIndex: number;
};

export type TColumn<T> = {
  title?: ReactNode;
  key: string;
  render?: (data: TColumnRender<T>) => ReactNode;
  isActions?: boolean;
  filter?: ReactNode;
  cellProps?: (data: TColumnRender<T>) => HTMLAttributes<HTMLDivElement>;
};
