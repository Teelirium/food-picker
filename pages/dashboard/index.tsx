import { GetServerSideProps, NextPage } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import Parent from "../../pages-content/parent/components";
import parentStore from "../../stores/ParentStore";

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
        session.user.role === "PARENT" &&
        <Parent/>
      }

      {/* <div>Logged in as {JSON.stringify(session?.user)}</div> */}
    </>
  );
};

export default Index;
