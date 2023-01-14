import { GetServerSideProps, NextPage } from "next";
import { getServerSideSession } from "utils/getServerSession";
import Head from "next/head";
import styles from "styles/worker.module.css";
import LeftSideNavibar from "components/WorkerPage/LeftSideNavibar";
import verifyRole from "utils/verifyRole";
import StandardMenu from "components/WorkerPage/StandardMenu";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSideSession(ctx);

  if (!session || !verifyRole(session, ["WORKER", "ADMIN"])) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

const StandardMenuPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Стандартное питание</title>
      </Head>
      <div className={styles.container}>
        <LeftSideNavibar activePage={3} />
        <StandardMenu />
      </div>
    </>
  );
};

export default StandardMenuPage;
