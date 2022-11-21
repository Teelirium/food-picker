import parentStore from "stores/parentStore";
import styles from "../../../styles/parent.module.css";
import getFullName from "utils/getFullName";

const Modal = (props) => {
  const childs = parentStore.parent.children.map((child, index) => (
    <div
      key={child}
      onClick={() => {
        parentStore.selectChild(index);
      }}
      className={
        parentStore.selectedChildIndex == index
          ? styles.modal_activeChildname
          : styles.modal_childname
      }
    >
      <span>{child}</span>
    </div>
  ));

  return (
    <div
      className={props.isModalOpen ? styles.activeModal : styles.inactiveModal}
    >
      <div className={styles.modal_window}>
        <div className={styles.modal_header}>
          <span>{getFullName(parentStore.parent)}</span>
        </div>
        <div className={styles.modal_body}>
          <span className={styles.modal_chooseFoodSpan}>Выбор еды для :</span>
          {childs}
          <button className={styles.modal_logOutBtn}>Выйти из аккаунта</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
