import { GetServerSideProps, NextPage } from "next";
import { Session, unstable_getServerSession } from "next-auth";
import Parent from "components/ParentPage";
import { getServerSideSession } from "utils/getServerSession";
import verifyRole from "utils/verifyRole";

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
      session,
    },
  };
};

const Index: NextPage<{ session: Session }> = ({ session }) => {
  return <>{session.user.role === "PARENT" ? <Parent /> : null}</>;
};

export default Index;
