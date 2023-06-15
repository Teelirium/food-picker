import classNames from 'classnames';
import { FormHTMLAttributes } from 'react';
import { FormProvider, UseFormReturn } from 'react-hook-form';

import style from './Table.module.scss';
import { TColumn } from './types';

interface TableSearchProps<T> {
  columns: TColumn<T>[];
  form: {
    props?: FormHTMLAttributes<HTMLFormElement>;
    methods: UseFormReturn<any, any>;
  };
}

const TableSearch = <T extends Record<string, any>>({ columns, form }: TableSearchProps<T>) => (
  <FormProvider {...form.methods}>
    <form {...form.props}>
      <div className={classNames(style.search, 'table__search')}>
        {columns.map((column) => (
          <div className="table__search-cell" key={column.key}>
            {column.filter}
          </div>
        ))}
      </div>
      <button type="submit" className={style.searchHiddenSubmitButton}>
        Submit
      </button>
    </form>
  </FormProvider>
);

export default TableSearch;
