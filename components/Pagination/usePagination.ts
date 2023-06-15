import { useCallback, useState } from 'react';

import { TPagination, TPaginationProps } from './paginationType';

const defaultParams = {
  current: 1,
  total: 1,
  currentOffset: 2,
};

const usePagination = (initialParams: TPaginationProps): TPagination => {
  const [pageSize, setPageSize] = useState(initialParams.pageSize || 10);
  const [current, setCurrent] = useState(initialParams.current || defaultParams.current);
  const [total, setTotal] = useState(initialParams.total || defaultParams.total);
  const [currentOffset, setCurrentOffset] = useState(
    initialParams.currentOffset || defaultParams.currentOffset,
  );

  const totalPage = Math.ceil(Math.max(total, 1) / pageSize);

  const set = useCallback(
    ({ pageSize, current, total, currentOffset }: Partial<TPaginationProps>) => {
      if (pageSize) {
        setPageSize(pageSize);
      }
      if (current) {
        setCurrent(current);
      }
      if (total) {
        setTotal(total);
      }
      if (currentOffset) {
        setCurrentOffset(currentOffset);
      }
    },
    [],
  );

  const goTo = useCallback(
    (page: number) => setCurrent(Math.min(Math.max(page, 1), totalPage)),
    [totalPage],
  );

  const next = useCallback(
    () => setCurrent((prevState) => Math.min(prevState + 1, totalPage)),
    [totalPage],
  );

  const back = useCallback(() => setCurrent((prevState) => Math.max(prevState - 1, 1)), []);

  const first = useCallback(() => setCurrent(1), []);

  const last = useCallback(() => setCurrent(totalPage), [totalPage]);

  return {
    pageSize,
    current,
    total,
    currentOffset,
    totalPage,
    set,
    next,
    back,
    goTo,
    first,
    last,
  };
};

export default usePagination;
