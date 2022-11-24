import { GetServerSideProps, NextPage } from "next";
import { Session } from "next-auth";
import Parent from "pages-content/parent/components";
import { getSession, useSession } from "next-auth/react";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession({ ctx });
  if (!session) {
    return {
      redirect: {
        destination: "/login",
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
  return (
    <>
      {
        session.user.role === "PARENT" ?
        <Parent/> : null
      }
    </>
  );
};

export default Index;
