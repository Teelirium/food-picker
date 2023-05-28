import classNames from 'classnames';
import { FC } from 'react';

import Icon from '../Icon';

import NavButton from './PageNavButton';
import style from './Pagination.module.scss';
import NumButton from './PaginationNumButton';
import { TPagination } from './paginationType';

interface PaginationProps {
  pagination: TPagination;
  className?: string;
}

const Pagination: FC<PaginationProps> = ({ pagination, className }) => {
  const { current, totalPage, currentOffset, goTo, first, back, next, last } = pagination;

  if (totalPage === 1) return null;

  const pages = [...Array(currentOffset * 2 + 1)]
    .map((_, i) => current - currentOffset + i)
    .filter((page) => page > 0 && page < totalPage + 1);

  return (
    <div className={classNames(style.list, className)}>
      <div className={style.navButtonList}>
        <NavButton onClick={first} disabled={current === 1}>
          <Icon.DoubleChevronLeft />
        </NavButton>
        <NavButton onClick={back} disabled={current === 1}>
          <Icon.ChevronLeft />
        </NavButton>
      </div>

      <div className={style.numList}>
        {pages.map((page) => (
          <NumButton page={page} current={current} goTo={goTo} key={page} />
        ))}
      </div>

      <div className={style.navButtonList}>
        <NavButton onClick={next} disabled={current === totalPage}>
          <Icon.ChevronRight />
        </NavButton>
        <NavButton onClick={last} disabled={current === totalPage}>
          <Icon.DoubleChevronRight />
        </NavButton>
      </div>
    </div>
  );
};

export default Pagination;
