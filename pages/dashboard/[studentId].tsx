import { Dish, DishType, Preference } from "@prisma/client";
import axios from "axios";
import classNames from "classnames";
import DashboardHeader from "components/Dashboard/Header";
import DashboardLayout from "components/Dashboard/Layout";
import DishCardSmall from "components/DishCardSmall";
import PreferenceSection from "components/PreferenceSection";
import { GetServerSideProps, NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import deleteIcon from "public/svg/delete.svg";
import editIcon from "public/svg/edit.svg";
import { useEffect, useMemo, useState } from "react";
import styles from "styles/studentChoice.module.scss";
import { PreferenceWithDish } from "types/Preference";
import dayMap from "utils/dayMap";
import dishTypeMap from "utils/dishTypeMap";
import { getServerSideSession } from "utils/getServerSession";
import isValidDay from "utils/isValidDay";
import verifyRole from "utils/verifyRole";

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

  const [preferences, setPreferences] = useState<PreferenceWithDish[] | null>(
    null
  );

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

  const totalCost: number = useMemo(() => {
    if (!preferences || preferences.length === 0) {
      return 0;
    }
    return preferences
      .map((pref) => pref.Dish.price)
      .reduce((total, cur) => total + cur, 0);
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
      <DashboardHeader backUrl='/dashboard'>
        <h1>{dayMap[day].toUpperCase()}</h1>
        <button className={styles.saveBtn}>{totalCost} ??????.</button>
      </DashboardHeader>
      {!!preferences ? (
        <main className={styles.body}>
          {Object.entries(dishTypeMap).map(([k, v]) => {
            const dish = dishes.get(k as DishType)?.dish;
            if (dish !== undefined)
              return (
                <PreferenceSection title={v} key={k}>
                  <Link href={`/dashboard/dishes/${dish.id}`} legacyBehavior>
                    <a style={{ width: "100%" }}>
                      <DishCardSmall dish={dish} />
                    </a>
                  </Link>
                  <div className={styles.btnGroup}>
                    <button
                      className={classNames(styles.deleteBtn, styles.actionBtn)}
                      onClick={() => {
                        const dish = dishes.get(k as DishType);
                        if (!!dish) {
                          handleDelete(dish.prefId);
                        }
                      }}
                    >
                      <Image src={deleteIcon} alt='delete' />
                      ??????????????
                    </button>
                    <Link
                      href={`/dashboard/dishes?type=${k}&studentId=${studentId}&day=${day}`}
                    >
                      <button
                        className={classNames(styles.editBtn, styles.actionBtn)}
                      >
                        <Image src={editIcon} alt='edit' />
                        ????????????????
                      </button>
                    </Link>
                  </div>
                </PreferenceSection>
              );
            return (
              <Link
                key={k}
                href={`/dashboard/dishes?type=${k}&studentId=${studentId}&day=${day}`}
                legacyBehavior
              >
                <a>
                  <PreferenceSection title={v}>
                    + ???????????????? ??????????
                  </PreferenceSection>
                </a>
              </Link>
            );
          })}
        </main>
      ) : (
        "????????????????..."
      )}
    </DashboardLayout>
  );
};

export default StudentChoice;
