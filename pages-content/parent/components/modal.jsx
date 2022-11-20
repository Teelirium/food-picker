import React from 'react';
import styles from "../../../styles/parent.module.css"

const Modal = (props) => {

    let childs = props.childs.map((child) => 
    <div key={child}
    onClick={() => props.selectChild(child)}
    className={props.selectedChild == child ? styles.modal_activeChildname : styles.modal_childname}>
        <span>{child}</span>
    </div>);

    return (
        <div className={props.isModalOpen ? styles.activeModal : styles.inactiveModal}>
            <div className={styles.modal_window}>
                <div className={styles.modal_header}>
                    <span>{props.parentName}</span>
                </div>
                <div className={styles.modal_body}>
                    <span className={styles.modal_chooseFoodSpan}>Выбор еды для :</span>
                    {childs}
                    <button className={styles.modal_logOutBtn}>Выйти из аккаунта</button>
                </div>
            </div>
        </div>
    );
}

export default Modal;