import dishStore from "stores/DishStore";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import deleteEmptyParams from "utils/deleteEmptyParams";

const Modal = ({ isOpen }: { isOpen: boolean }) => {
  const router = useRouter();
  
  if (!dishStore.dish) {
    return null;
  }

  return (
    <div className={isOpen ? styles.active : styles.inactive}>
      {JSON.stringify(dishStore.dish)}
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
    </div>
  );
};

export default Modal;
