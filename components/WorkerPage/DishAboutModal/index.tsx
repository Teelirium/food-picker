import dishStore from "stores/DishStore";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Modal = ({ isOpen }: { isOpen: boolean | undefined }) => {
    const router = useRouter();

    const dish = dishStore.dish;
  
    if (!dish) {
        return null;
    }

    return (
        <div className={isOpen ? styles.active : styles.inactive}>
            {JSON.stringify(dish)}
            <div className={styles.close}
                onClick={() => router.replace({ pathname: "", query: { undefined } }, undefined, {
                    shallow: true,
                })}>
                close
            </div>
        </div>
    )
}

export default Modal;