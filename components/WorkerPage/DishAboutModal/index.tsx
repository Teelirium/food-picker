import dishStore from "stores/DishStore";
import styles from "./styles.module.css";
import { useRouter } from "next/router";

const Modal = ({ isOpen }: { isOpen: boolean | undefined }) => {
  const router = useRouter();

  if (!dishStore.dish) {
    return null;
  }

  return (
    <div className={isOpen ? styles.active : styles.inactive}>
      {JSON.stringify(dishStore.dish)}
      <div
        className={styles.close}
        onClick={() =>
          router.replace(
            { pathname: "", query: { ...router.query, isOpen: undefined } },
            undefined,
            {
              shallow: true,
            }
          )
        }
      >
        close
      </div>
    </div>
  );
};

export default Modal;
