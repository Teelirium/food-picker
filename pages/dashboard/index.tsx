import { GetServerSideProps, NextPage } from "next";
import { Session, unstable_getServerSession } from "next-auth";
import Parent from "pages-content/parent/components";
import { options } from "pages/api/auth/[...nextauth]";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await unstable_getServerSession(ctx.req, ctx.res, options);

  if (!session) {
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
        destination: "/worker/dishes",
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
