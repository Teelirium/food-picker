import classNames from 'classnames';
import { FormHTMLAttributes } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { get } from 'lodash';

import style from './Table.module.scss';
import TableEmpty from './TableEmpty';
import TableHead from './TableHead';
import TableRow from './TableRow';
import TableSearch from './TableSearch';
import { TColumn } from './types';

/* eslint-disable no-unused-vars */
interface TableProps<T> {
  columns: TColumn<T>[];
  data?: T[];
  keyPath?: string;
  className?: string;
  form?: {
    props?: FormHTMLAttributes<HTMLFormElement>;
    methods: UseFormReturn<any, any>;
  };
  rowProps?: {
    onClick?: (row: T) => void;
  };
}
/* eslint-enable no-unused-vars */

const Table = <T extends object>({
  columns,
  data,
  keyPath = 'id',
  className,
  form,
  rowProps,
}: TableProps<T>) => (
  <div className={classNames(style.table, className)}>
    <div className={style.stickyTop}>
      <TableHead columns={columns} />
      {form && <TableSearch columns={columns} form={form} />}
    </div>
    <div className={classNames(style.body, 'table__body')}>
      {data?.length ? (
        data?.map((row, index) => (
          <TableRow
            row={row}
            index={index}
            listLength={data.length}
            columns={columns}
            key={get(row, keyPath)}
            rowProps={rowProps}
          />
        ))
      ) : (
        <TableEmpty />
      )}
    </div>
  </div>
);

export default Table;
