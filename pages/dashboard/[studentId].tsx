import { Dish, DishType } from '@prisma/client';
import axios from 'axios';
import DashboardHeader from 'components/Dashboard/Header';
import DashboardLayout from 'components/Dashboard/Layout';
import PreferenceSection from 'components/PreferenceSection';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import styles from 'styles/studentChoice.module.scss';
import { PreferenceWithDish } from 'types/Preference';
import dayMap from 'utils/dayMap';
import dishTypeMap from 'utils/dishTypeMap';
import { getServerSideSession } from 'utils/getServerSession';
import isValidDay from 'utils/isValidDay';
import verifyRole from 'utils/verifyRole';

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
    !verifyRole(session, ['PARENT', 'ADMIN'])
  ) {
    return {
      redirect: {
        destination: '/dashboard',
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

const StudentChoice: NextPage<Props> = ({ studentId, day }) => {
  const router = useRouter();
  const [preferences, setPreferences] = useState<PreferenceWithDish[] | null>(null);

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
    return preferences.map((pref) => pref.Dish.price).reduce((total, cur) => total + cur, 0);
  }, [preferences]);

  function handleDelete(key: DishType) {
    const dish = dishes.get(key);
    if (!!dish) {
      axios
        .delete(`/api/preferences/${dish.prefId}`)
        .then(() => {
          if (!!preferences) {
            setPreferences(preferences.filter((p) => p.id !== dish.prefId));
          }
        })
        .catch(alert);
    }
  }

  return (
    <DashboardLayout>
      <DashboardHeader backUrl='/dashboard'>
        <h1>{dayMap[day].toUpperCase()}</h1>
        <button className={styles.saveBtn}>{totalCost} руб.</button>
      </DashboardHeader>
      {!!preferences ? (
        <main className={styles.body}>
          {Object.entries(dishTypeMap).map(([k, v]) => {
            const dish = dishes.get(k as DishType)?.dish;
            if (!!dish) {
              return (
                <PreferenceSection
                  key={k}
                  title={v}
                  dish={dish}
                  handleView={() => router.push(`/dashboard/dishes/${dish.id}`)}
                  handleDelete={() => handleDelete(k as DishType)}
                  handleEdit={() =>
                    router.push(`/dashboard/dishes?type=${k}&studentId=${studentId}&day=${day}`)
                  }
                />
              );
            }
            return (
              <Link
                key={k}
                href={`/dashboard/dishes?type=${k}&studentId=${studentId}&day=${day}`}
                legacyBehavior
              >
                <a>
                  <PreferenceSection title={v}></PreferenceSection>
                </a>
              </Link>
            );
          })}
        </main>
      ) : (
        'Загрузка...'
      )}
    </DashboardLayout>
  );
};

export default StudentChoice;
