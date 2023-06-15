import classNames from 'classnames';

import style from './Table.module.scss';
import { TColumn } from './types';

interface TableHeadProps<T> {
  columns: TColumn<T>[];
}

const TableHead = <T extends Record<string, any>>({ columns }: TableHeadProps<T>) => (
  <div className={classNames(style.head, 'table__head')}>
    {columns.map((column) => (
      <div className="table__head-cell" key={column.key}>
        {column.title}
      </div>
    ))}
  </div>
);

export default TableHead;
