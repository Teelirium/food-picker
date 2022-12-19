import { GetServerSideProps, NextPage } from "next";
import { getServerSideSession } from "utils/getServerSession";
import Head from "next/head";
import styles from "styles/worker.module.css";
import LeftSideNavibar from "components/Worker/LeftSideNavibar";
import Orders from "components/Worker/Orders";
import axios from "axios";
import { GetResponse } from "pages/api/grades/total-orders";
import { useEffect, useMemo, useState } from "react";

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


const OrdersPage: NextPage = () => {
    const [weekDay, setWeekDay] = useState(1);
    const [orders, setOrders] = useState<GetResponse[]>();

    useEffect(() => {
        axios
        .get(`/api/grades/total-orders?day=${weekDay}`)
        .then((response) => setOrders(response.data))
        .catch((err) => console.error(err.message));
    }, [weekDay]);
    

    return (
      <>
        <Head>
            <title>
                Заказы
            </title>
        </Head>
        <div className={styles.container}>
            <LeftSideNavibar activePage={2}/>
            <Orders orders={orders} weekDay={weekDay} setWeekDay={setWeekDay}/>
        </div>
    </>
    );
};

export default OrdersPage;