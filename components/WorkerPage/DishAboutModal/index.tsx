import axios from 'axios';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

import ModalWrapper from 'components/ModalWrapper';
import deleteEmptyParams from 'utils/deleteEmptyParams';

import styles from './styles.module.scss';

const Modal = ({ dishId }: { dishId: number }) => {
  const router = useRouter();
  const [dish, setDish] = useState(null);

  const toggle = useCallback(() => {
    router.replace(
      {
        pathname: '',
        query: deleteEmptyParams({ ...router.query, dish: undefined }),
      },
      undefined,
      {
        shallow: true,
      },
    );
  }, [router]);

  useEffect(() => {
    axios
      .get(`/api/dishes/${dishId}`)
      .then((resp) => setDish(resp.data))
      .catch(console.log);
  }, [dishId]);

  return (
    <ModalWrapper toggle={toggle}>
      <div className={styles.container}>
        {dish ? (
          <div className={styles.close} onClick={toggle}>
            close
          </div>
        ) : (
          'Loading'
        )}
      </div>
    </ModalWrapper>
  );
};

export default Modal;
