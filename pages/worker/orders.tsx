import { NextPage } from "next";
import Head from "next/head";
import styles from "pages-content/worker/styles/dishes.module.css";
import LeftSideNavibar from "pages-content/worker/components/leftSideNavibar";

const Orders: NextPage = () => {
    return (
        <>
        <Head>
            <title>
                Заказы
            </title>
        </Head>
        <div className={styles.container}>
            <LeftSideNavibar activePage={2}/>
        </div>

        
    </>
    );
};

export default Orders;