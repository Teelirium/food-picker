import { Preference } from "types/Preference";
import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import { useEffect, useMemo, useState } from "react";
import isValidDay from "utils/isValidDay";
import dayMap from "utils/dayMap";
import { getServerSideSession } from "utils/getServerSession";
import verifyRole from "utils/verifyRole";
import styles from "styles/studentChoice.module.scss";
import dishTypeMap from "utils/dishTypeMap";
import Link from "next/link";
import { Dish, DishType } from "@prisma/client";
import DishCardSmall from "components/DishCardSmall";
import editIcon from "public/svg/edit.svg";
import deleteIcon from "public/svg/delete.svg";
import Image from "next/image";
import classNames from "classnames";
import DashboardLayout from "components/Dashboard/Layout";
import DashboardHeader from "components/Dashboard/Header";

type Props = {
  studentId: number;
  day: number;
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const studentId = ctx.query.studentId ? +ctx.query.studentId : undefined;
  const day = ctx.query.day ? +ctx.query.day : undefined;
  const session = await getServerSideSession(ctx);

  if (
    studentId === undefined ||
    day === undefined ||
    !isValidDay(day) ||
    !session ||
    !verifyRole(session, ["PARENT", "ADMIN"])
  ) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return {
    props: {
      studentId,
      day,
    },
  };
};

const StudentChoice: NextPage<Props> = (props) => {
  const { studentId, day } = props;

  const [preferences, setPreferences] = useState<Preference[] | null>(null);

  useEffect(() => {
    axios
      .get(`/api/preferences?studentId=${studentId}&day=${day}`)
      .then((p) => p.data)
      .then((data) => setPreferences(data))
      .catch(alert);
  }, [studentId, day]);

  const dishes = useMemo(() => {
    const result = new Map<DishType, { dish: Dish; prefId: number }>();
    if (!preferences) {
      return result;
    }

    for (let pref of preferences) {
      result.set(pref.Dish.type, { dish: pref.Dish, prefId: pref.id });
    }
    return result;
  }, [preferences]);

  const handleDelete = (preferenceId: number) => {
    axios
      .delete(`/api/preferences/${preferenceId}`)
      .then(() => {
        if (!!preferences) {
          setPreferences(preferences.filter((p) => p.id !== preferenceId));
        }
      })
      .catch(alert);
  };

  return (
    <DashboardLayout>
      <DashboardHeader>
        <h1>{dayMap[day].toUpperCase()}</h1>
        <button className={styles.saveBtn}>Сохранить</button>
      </DashboardHeader>
      {!!preferences ? (
        <main className={styles.body}>
          {Object.entries(dishTypeMap).map(([k, v]) => (
            <div key={k} className={styles.dishSection}>
              <span>{v}</span>
              <div className={styles.dishContainer}>
                {dishes.has(k as DishType) ? (
                  <>
                    <DishCardSmall dish={dishes.get(k as DishType)?.dish} />
                    <div className={styles.btnGroup}>
                      <button
                        className={classNames(
                          styles.deleteBtn,
                          styles.actionBtn
                        )}
                        onClick={() => {
                          const dish = dishes.get(k as DishType);
                          if (!!dish) {
                            handleDelete(dish.prefId);
                          }
                        }}
                      >
                        <Image src={deleteIcon} alt='delete' />
                        Удалить
                      </button>
                      <Link
                        href={`/dashboard/dishes?type=${k}&studentId=${studentId}&day=${day}`}
                      >
                        <button
                          className={classNames(
                            styles.editBtn,
                            styles.actionBtn
                          )}
                        >
                          <Image src={editIcon} alt='edit' />
                          Изменить
                        </button>
                      </Link>
                    </div>
                  </>
                ) : (
                  <Link
                    href={`/dashboard/dishes?type=${k}&studentId=${studentId}&day=${day}`}
                  >
                    + Добавить Блюдо
                  </Link>
                )}
              </div>
            </div>
          ))}
        </main>
      ) : (
        "Loading..."
      )}
    </DashboardLayout>
  );
};

export default StudentChoice;
