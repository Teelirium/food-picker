import axios from "axios";
import { Dish, DishType, PrismaClient } from "@prisma/client";
import { GetServerSideProps, NextPage } from "next";
import { getServerSideSession } from "utils/getServerSession";
import Head from "next/head";
import styles from "pages-content/worker/styles/dishes.module.css";
import LeftSideNavibar from "pages-content/worker/components/leftSideNavibar";
import Dishes from "pages-content/worker/components/dishes";
import { PropTypes } from "mobx-react";

const prisma = new PrismaClient();

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSideSession(ctx);
  const type = ctx.query.type;

  if (!(session?.user.role === "WORKER")) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const dishes = await prisma.dish.findMany();

  return {
    props: {
      dishes
    }
  };
}

type Props = {
  dishes: Dish[];
};

const WorkerIndexPage: NextPage<Props> = ({dishes}) => {

  return (
    <>
        <Head>
          <title>
              Блюда
          </title>
        </Head>
        <div className={styles.container}>
            <LeftSideNavibar activePage={1}/>
            <Dishes dishes={dishes}/>
        </div> 
    </>
  );
};

export default WorkerIndexPage;