import parentStore from "stores/ParentStore";
import styles from "../../../styles/parent.module.css";
import getFullName from "utils/getFullName";
import { signOut } from "next-auth/react";

const Modal = ({ isModalOpen }: { isModalOpen: boolean }) => {
  if (!parentStore.parent) {
    return null;
  }

  const childs = parentStore.parent.children.map((child, index) => (
    <div
      key={child.id}
      onClick={() => {
        parentStore.setChild(index);
      }}
      className={
        parentStore.childIndex == index
          ? styles.modal_activeChildname
          : styles.modal_childname
      }
    >
      <span>{getFullName(child)}</span>
    </div>
  ));

  return (
    <div className={isModalOpen ? styles.activeModal : styles.inactiveModal}>
      <div className={styles.modal_window}>
        <div className={styles.modal_header}>
          <span>{getFullName(parentStore.parent)}</span>
        </div>
        <div className={styles.modal_body}>
          <span className={styles.modal_chooseFoodSpan}>Выбор еды для :</span>
          {childs}
          <button className={styles.modal_logOutBtn} onClick={() => signOut()}>
            Выйти из аккаунта
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
