import classNames from 'classnames';

import style from './Table.module.scss';
import { TColumn } from './types';

interface TableCellProps<T> {
  column: TColumn<T>;
  rowData: {
    record: T;
    index: number;
    reverseIndex: number;
  };
}

const TableCell = <T extends object>({ column, rowData }: TableCellProps<T>) => {
  const renderTableCell = (column: TColumn<T>) => {
    if (column.render) return column.render?.(rowData);
    return rowData.record[column.key as keyof T] as any;
  };

  const { className, ...props } = column.cellProps?.(rowData) || {};

  return (
    <div
      className={classNames(
        column.isActions ? style.cellActions : style.cell,
        column.isActions ? 'table__cellActions' : 'table__cell',
        className,
      )}
      {...props}
    >
      {renderTableCell(column)}
    </div>
  );
};

export default TableCell;
