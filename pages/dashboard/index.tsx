import { GetServerSideProps, NextPage } from "next";
import ParentPage from "components/ParentPage";
import { getServerSideSession } from "utils/getServerSession";
import verifyRole from "utils/verifyRole";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSideSession(ctx);
  if (!session || !verifyRole(session, ["PARENT"])) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  if (session.user.role === "WORKER") {
    return {
      redirect: {
        destination: "/dashboard/worker/dishes",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

const Index: NextPage = () => {
  return <ParentPage />;
};

export default Index;
