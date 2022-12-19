import { GetResponse } from "pages/api/grades/total-orders";
import React, { useMemo, useState } from "react";
import styles from "./styles.module.css";

type Props = {
    order: GetResponse;
}

const OrderCard: React.FC<Props> = React.forwardRef(({ order }, ref) => {
    if (!order) return null;
    return (
        <div className={styles.orderContainer}>
            <div className={styles.orderRow}>
                {JSON.stringify(order)}
            </div>
            <div className={styles.arrow}>

            </div>
        </div>
    );
});

export default OrderCard;