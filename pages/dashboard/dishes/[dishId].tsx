import { Dish, DishType, PrismaClient } from "@prisma/client";
import { GetServerSideProps, NextPage } from "next";
import { getServerSideSession } from "utils/getServerSession";
import isParentOf from "utils/isParentOf";
import verifyRole from "utils/verifyRole";
import styles from "styles/dishInfo.module.scss";
import DashboardLayout from "components/Dashboard/Layout";
import DishCardSmall from "components/DishCardSmall";
import isValidDay from "utils/isValidDay";
import { z } from "zod";
import Link from "next/link";
import dishTypeMap from "utils/dishTypeMap";
import axios from "axios";
import { useRouter } from "next/router";

const prisma = new PrismaClient();

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const query = z.object({
    dishId: z.preprocess(
      (id) => Number(z.string().parse(id)),
      z.number().min(0)
    ),
    day: z
      .preprocess(
        (day) => Number(z.string().parse(day)),
        z.number().min(0).max(6)
      )
      .optional(),
    studentId: z
      .preprocess((id) => Number(z.string().parse(id)), z.number().min(0))
      .optional(),
  });
  const { dishId, day, studentId } = query.parse(ctx.query);
  const session = await getServerSideSession(ctx);

  if (
    !session ||
    !verifyRole(session, ["PARENT", "ADMIN"]) ||
    (studentId !== undefined &&
      !(await isParentOf(session, studentId)) &&
      session.user.role === "PARENT")
  ) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  const dish = await prisma.dish.findUniqueOrThrow({
    where: {
      id: dishId,
    },
  });

  return {
    props: {
      dish,
      dishId,
      day: day || null,
      studentId: studentId || null,
    },
  };
};

type Props = {
  dish: Dish;
  dishId: number;
  day: number | null;
  studentId: number | null;
};

const DishInfo: NextPage<Props> = ({ dish, day, studentId, dishId }) => {
  const router = useRouter();

  const handleChoose = () => {
    axios
      .post(`/api/preferences?studentId=${studentId}&day=${day}`, { dishId })
      .then(() => {
        router.replace(`/dashboard`).then(() => {
          router.push(`/dashboard/${studentId}?day=${day}`);
        });
      })
      .catch(alert);
  };

  return (
    <DashboardLayout>
      <header
        className={styles.header}
        style={{ backgroundImage: `url(${dish.imgURL})` }}
      >
        <Link
          href={
            !!studentId
              ? `/dashboard/dishes/?type=${dish.type}&studentId=${studentId}&day=${day}`
              : "javascript:history.back()"
          }
        >
          <span className={styles.backBtn}>
            <b>&lt;</b>
          </span>
        </Link>
        <span className={styles.priceTag}>{dish.price} рублей</span>
      </header>
      <main className={styles.body}>
        <h1>{dish.name}</h1>
        <div>{dishTypeMap[dish.type]}</div>
        <div>Вес: {dish.weightGrams} г.</div>
        {!!studentId && !!day ? (
          <button className={styles.chooseBtn} onClick={handleChoose}>
            Выбрать блюдо
          </button>
        ) : null}
        <div>Состав: {dish.ingredients}</div>
      </main>
    </DashboardLayout>
  );
};

export default DishInfo;
