import { NextPage } from "next";
import Head from "next/head";
import styles from "pages-content/worker/styles/dishes.module.css";
import LeftSideNavibar from "pages-content/worker/components/leftSideNavibar";

const StandardMenu: NextPage = () => {
    return (
        <>
        <Head>
            <title>
                Стандартное питание
            </title>
        </Head>
        <div className={styles.container}>
            <LeftSideNavibar activePage={3}/>
        </div>

        
    </>
    );
};

export default StandardMenu;