import React, { useEffect, useState } from 'react';
import { useSession } from "next-auth/react"
import { inject, observer } from "mobx-react";
import ParentStore from "../../../stores/ParentStore";
import styles from "../../../styles/parent.module.css"
import Modal from "./modal"
import { runInThisContext } from 'vm';

const Parent = () => {
//     useEffect(() => {
//         ParentStore.setParent("Anastasia");
//     }, [])

    const session = useSession();
    const parentName = "Редискова Светлана Сергеевна";
    const childs = [
        "Редисков Андрей Сергеевич",
        "Редисков Иван Андреевич"
    ];

    const [isModalOpen, closeOpenModal] = useState(false);
    const [selectedChild, selectChild] = useState("Редисков Андрей Сергеевич")

    return (
        <>
            <div className={styles.daySelect_container}>
                <div className={styles.daySelect_header}>
                    <div className={styles.daySelect_menuButton}
                    onClick={() => closeOpenModal(!(isModalOpen))}>
                    </div>
                    <div className={styles.daySelect_childName}>
                        {selectedChild}
                    </div>
                </div>
                <div className={styles.daySelect_daysContainer}>
                    <div className={styles.daySelect_dayOfTheWeek}>
                        <span>ПОНЕДЕЛЬНИК</span>
                    </div>
                    <div className={styles.daySelect_dayOfTheWeek}>
                        <span>ВТОРНИК</span>
                    </div>
                    <div className={styles.daySelect_dayOfTheWeek}>
                        <span>СРЕДА</span>
                    </div>
                    <div className={styles.daySelect_dayOfTheWeek}>
                        <span>ЧЕТВЕРГ</span>
                    </div>
                    <div className={styles.daySelect_dayOfTheWeek}>
                        <span>ПЯТНИЦА</span>
                    </div>
                    <div className={styles.daySelect_dayOfTheWeek}>
                        <span>СУББОТА</span>
                    </div>
                </div>
            </div> 

                <Modal selectedChild={selectedChild} 
                selectChild={selectChild}
                childs={childs}
                parentName={parentName}
                isModalOpen={isModalOpen}/>
        </>
    );  
};

export default observer(Parent);