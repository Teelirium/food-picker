import axios from "axios";
import LeftSideNavibar from "components/WorkerPage/LeftSideNavibar";
import Orders from "components/WorkerPage/Orders";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { GetResponse } from "pages/api/grades/total-orders";
import { useEffect, useMemo, useState } from "react";
import styles from "styles/worker.module.css";
import { getServerSideSession } from "utils/getServerSession";
import dayOfWeekSchema from "utils/schemas/dayOfWeekSchema";
import verifyRole from "utils/verifyRole";
import { z } from "zod";

const querySchema = z.object({
  day: dayOfWeekSchema.default(0),
  breakIndex: z.coerce.number().min(0).max(7).default(0),
});

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

const OrdersPage: NextPage = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<GetResponse[]>();
  const { day, breakIndex } = useMemo(() => {
    return querySchema.parse(router.query);
  }, [router.query]);

  useEffect(() => {
    axios
      .get(`/api/grades/total-orders?day=${day}`)
      .then((response) => setOrders(response.data))
      .catch((err) => console.error(err.message));
  }, [day]);

  return (
    <>
      <Head>
        <title>Заказы</title>
      </Head>
      <div className={styles.container}>
        <LeftSideNavibar activePage={2} />
        <Orders
          orders={orders}
          weekDay={day}
          setWeekDay={(day: number) => {
            router.replace({ pathname: "", query: { day, breakIndex } }, undefined, {
              shallow: true,
            });
          }}
        />
      </div>
    </>
  );
};

export default OrdersPage;
