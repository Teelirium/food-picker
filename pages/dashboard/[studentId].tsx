import { Preference } from "types/Preference";
import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";
import isValidDay from "utils/isValidDay";
import dayMap from "utils/dayMap";
import { getServerSideSession } from "utils/getServerSession";
import verifyRole from "utils/verifyRole";
import styles from "styles/studentChoice.module.scss";
import dishTypeMap from "utils/dishTypeMap";
import Link from "next/link";

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
  const [prefs, setPrefs] = useState<Preference[] | null>(null);
  useEffect(() => {
    axios
      .get(`/api/preferences?studentId=${studentId}&day=${day}`)
      .then((p) => p.data)
      .then((data) => setPrefs(data))
      .catch(alert);
  }, [studentId, day]);

  return (
    <div className={styles.bg}>
      <div className={styles.container}>
        <header className={styles.header}>
          <Link href='javascript:history.back()'>
            <span>&lt;</span>
          </Link>
          <h1>{dayMap[day].toUpperCase()}</h1>
          <button className={styles.saveBtn}>Сохранить</button>
        </header>
        {!!prefs ? (
          <main className={styles.body}>
            {Object.entries(dishTypeMap).map(([k, v]) => (
              <div key={k} className={styles.dishSection}>
                <span>{v}</span>
                <div className={styles.dishContainer}>
                  {prefs.find((p) => p.Dish.type === k)?.Dish.name ||
                    "+ Добавить Блюдо"}
                </div>
              </div>
            ))}
          </main>
        ) : (
          "Loading..."
        )}
      </div>
    </div>
  );
};

export default StudentChoice;
