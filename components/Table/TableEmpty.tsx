import { FC } from 'react';

import Icon from '../Icon';

import style from './TableEmpty.module.scss';

const TableEmpty: FC = () => (
  <div className={style.wrapper}>
    <Icon.MagnifyingGlass className={style.icon} />
    <div className={style.text}>Результатов не найдено</div>
  </div>
);

export default TableEmpty;
