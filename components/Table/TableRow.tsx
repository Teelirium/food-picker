import classNames from 'classnames';

import style from './Table.module.scss';
import TableCell from './TableCell';
import { TColumn } from './types';

/* eslint-disable no-unused-vars */
interface TableRowProps<T> {
  row: T;
  rowProps?: {
    onClick?: (row: T) => void;
  };
  index: number;
  listLength: number;
  columns: TColumn<T>[];
}
/* eslint-enable no-unused-vars */

// eslint-disable-next-line comma-spacing
const TableRow = <T extends object>({
  row,
  index,
  listLength,
  columns,
  rowProps,
}: TableRowProps<T>) => {
  const rowData = {
    record: row,
    index,
    reverseIndex: listLength - index - 1,
  };

  return (
    <div className={classNames(style.row, 'table__row')} onClick={() => rowProps?.onClick?.(row)}>
      {columns.map((column) => (
        <TableCell column={column} rowData={rowData} key={column.key} />
      ))}
    </div>
  );
};

export default TableRow;
