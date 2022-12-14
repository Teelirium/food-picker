import { GetServerSideProps, NextPage } from "next";
import { getServerSideSession } from "utils/getServerSession";
import Head from "next/head";
import styles from "styles/worker.module.css";
import LeftSideNavibar from "components/worker/leftSideNavibar";

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