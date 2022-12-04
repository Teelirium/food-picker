import axios from "axios";
import { NextPage } from "next";
import Head from "next/head";
import styles from "pages-content/worker/styles/dishes.module.css";
import LeftSideNavibar from "pages-content/worker/components/leftSideNavibar";
import Dishes from "pages-content/worker/components/dishes";


const WorkerIndexPage: NextPage = () => {

  return (
    <>
        <Head>
            <title>
                Блюда
            </title>
        </Head>
        <div className={styles.container}>
            <LeftSideNavibar activePage={1}/>
            <Dishes />
        </div> 
    </>
  );
};

export default WorkerIndexPage;