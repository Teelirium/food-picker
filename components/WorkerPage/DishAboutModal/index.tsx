import styles from "./styles.module.scss";
import { useRouter } from "next/router";
import deleteEmptyParams from "utils/deleteEmptyParams";
import { useEffect, useState } from "react";
import axios from "axios";

const Modal = ({ dishId }: { dishId: number }) => {
  const router = useRouter();
  const [dish, setDish] = useState(null);

  useEffect(() => {
    axios
        .get(`/api/dishes/${dishId}`)
        .then((resp) => setDish(resp.data))
        .catch(console.log);
  }, [dishId]);

  return (
    <div className={styles.active}>
      <div className={styles.modalContainer}>
        {dish ? 
        <div
          className={styles.close}
          onClick={() => {
            router.replace(
              {
                pathname: "",
                query: deleteEmptyParams({ ...router.query, dish: undefined }),
              },
              undefined,
              {
                shallow: true,
              }
            );
          }}
        >
          close
        </div>
        : "Loading"}
      </div>
    </div>
  );
};

export default Modal;
