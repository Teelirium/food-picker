import { Dish, DishType, PrismaClient } from "@prisma/client";
import { GetServerSideProps, NextPage } from "next";
import { getServerSideSession } from "utils/getServerSession";
import isParentOf from "utils/isParentOf";
import verifyRole from "utils/verifyRole";

const prisma = new PrismaClient();

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const type = ctx.query.type;
  const studentId = ctx.query.studentId ? +ctx.query.studentId : undefined;
  const day = ctx.query.day ? +ctx.query.day : undefined;
  const session = await getServerSideSession(ctx);

  if (
    !type ||
    studentId === undefined ||
    day === undefined ||
    !session ||
    !verifyRole(session, ["PARENT", "ADMIN"]) ||
    (!(await isParentOf(session, +studentId)) && session.user.role === "PARENT")
  ) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  const dishes = await prisma.dish.findMany({
    where: {
      type: type as DishType,
    },
  });
  return {
    props: {
      dishes,
    },
  };
};

type Props = {
  dishes: Dish[];
};

const Dishes: NextPage<Props> = ({ dishes }) => {
  return (
    <div>
      {dishes.map((d) => (
        <span key={d.id}>{d.name}</span>
      ))}
    </div>
  );
};

export default Dishes;
