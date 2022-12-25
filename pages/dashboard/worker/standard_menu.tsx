import { GetServerSideProps, NextPage } from "next";
import { getServerSideSession } from "utils/getServerSession";
import Head from "next/head";
import styles from "styles/worker.module.css";
import LeftSideNavibar from "components/WorkerPage/LeftSideNavibar";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const session = await getServerSideSession(ctx);
  
    if (!(session?.user.role === "WORKER")) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }
  
    return {
      props: {
        session
      }
    };
  }

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