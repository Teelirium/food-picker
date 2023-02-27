import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    redirect: {
      destination: "/dashboard/worker/dishes",
      permanent: true,
    },
  };
};

export default function Worker() {
  return null;
}
