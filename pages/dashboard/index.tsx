import { GetServerSideProps, NextPage } from "next";
import { Session, unstable_getServerSession } from "next-auth";
import Parent from "components/ParentPage";
import { getServerSideSession } from "utils/getServerSession";
import verifyRole from "utils/verifyRole";
import { useSession } from "next-auth/react";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSideSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  if (verifyRole(session, ["WORKER"])) {
    return {
      redirect: {
        destination: "/addDish",
        permanent: false,
      },
    };
  }

  return {
    props: {
    },
  };
};

const Index: NextPage = () => {
  const {data} = useSession();
  return <>{!!data && data.user.role === "PARENT" ? <Parent /> : null}</>;
};

export default Index;
