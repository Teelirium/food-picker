import { DishType } from '@prisma/client';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';
import DashboardHeader from 'components/Dashboard/Header';
import DashboardLayout from 'components/Dashboard/Layout';
import ModalWrapper from 'components/ModalWrapper';
import PreferenceSection from 'components/PreferenceSection';
import styles from 'styles/studentChoice.module.scss';
import { PreferenceWithDish } from 'types/Preference';
import { stripTimeFromDate } from 'utils/dateHelpers';
import dayMap from 'utils/dayMap';
import dishTypeMap from 'utils/dishTypeMap';
import { getServerSideSession } from 'utils/getServerSession';
import dayOfWeekSchema from 'utils/schemas/dayOfWeekSchema';
import idSchema from 'utils/schemas/idSchema';
import { trpc } from 'utils/trpc/client';
import verifyRole from 'utils/verifyRole';
import { z } from 'zod';

const paramSchema = z.object({
  studentId: idSchema,
  day: dayOfWeekSchema,
});

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSideSession(ctx);

  if (!session || !verifyRole(session, ['PARENT', 'ADMIN'])) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default function StudentChoice() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { studentId, day } = paramSchema.parse(router.query);

  const { data: preferences, ...preferencesQuery } = useQuery({
    queryKey: ['preferences', { studentId, day }],
    staleTime: 10 * 60 * 1000,
    async queryFn() {
      const preferenceList = await axios
        .get(`/api/preferences?studentId=${studentId}&day=${day}`)
        .then((p) => p.data as PreferenceWithDish[]);
      const preferenceMap = new Map(preferenceList.map((p) => [p.Dish.type, p]));
      return preferenceMap;
    },
  });

  const { data: orders, ...ordersQuery } = trpc.orders.getThisWeeksOrders.useQuery(
    {
      studentId,
      day,
      date: stripTimeFromDate(new Date()),
    },
    { staleTime: 10 * 60 * 1000 },
  );

  const totalCost: number = useMemo(() => {
    if (!preferences) {
      return 0;
    }
    return Array.from(preferences.values()).reduce((prev, curr) => prev + curr.Dish.price, 0);
  }, [preferences]);

  const deleteMutation = useMutation({
    async mutationFn(prefId: number) {
      return axios.delete(`/api/preferences/${prefId}`);
    },
    async onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['preferences', { studentId, day }] });
    },
  });

  const showSpinner =
    preferencesQuery.isFetching || deleteMutation.isLoading || ordersQuery.isLoading;

  return (
    <DashboardLayout>
      <Head>
        <title>Выбор блюд на день</title>
      </Head>
      <DashboardHeader backUrl="/dashboard">
        <h1>{dayMap[day].toUpperCase()}</h1>
        <button
          className={styles.saveBtn}
          type="button"
          onClick={
            () => {}
            // queryClient.invalidateQueries(
            //   getQueryKey(trpc.orders.getThisWeeksOrders, {
            //     studentId,
            //     day,
            //     date: stripTimeFromDate(new Date()),
            //   }),
            // )
          }
        >
          {totalCost} руб.
        </button>
      </DashboardHeader>
      <main className={styles.body}>
        {showSpinner && <ModalWrapper>Загрузка...</ModalWrapper>}
        {preferencesQuery.isError && 'Что-то пошло не так'}
        {!preferencesQuery.isError &&
          Object.entries(dishTypeMap).map(([type, title]) => {
            const pref = preferences?.get(type as DishType);
            return (
              <PreferenceSection
                key={type}
                title={title}
                dish={pref?.Dish}
                handleView={pref && (() => router.push(`/dashboard/dishes/${pref.Dish.id}`))}
                handleDelete={
                  type === DishType.EXTRA
                    ? pref && (() => deleteMutation.mutate(pref.id))
                    : undefined
                }
                handleEdit={() =>
                  router.push(`/dashboard/dishes?type=${type}&studentId=${studentId}&day=${day}`)
                }
                handleAdd={() =>
                  router.push(`/dashboard/dishes?type=${type}&studentId=${studentId}&day=${day}`)
                }
              />
            );
          })}
      </main>
    </DashboardLayout>
  );
}
