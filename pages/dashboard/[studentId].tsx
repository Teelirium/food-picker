import { Dish, DishType } from '@prisma/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { z } from 'zod';

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

function markDishesAsNewOrOld(
  preferenceDish?: Dish,
  orderDish?: Dish,
): { newDish?: Dish; oldDish?: Dish } {
  if (!preferenceDish || !orderDish) {
    if (!preferenceDish && orderDish) {
      if (orderDish.type === 'EXTRA') return { oldDish: orderDish };
      return { newDish: orderDish };
    }
    if (!orderDish && preferenceDish) {
      return { newDish: preferenceDish };
    }
    return {};
  }

  if (preferenceDish.id === orderDish.id) {
    return { newDish: preferenceDish, oldDish: undefined };
  }

  return { newDish: preferenceDish, oldDish: orderDish };
}

export default function StudentChoice() {
  const router = useRouter();
  const { studentId, day } = paramSchema.parse(router.query);

  const queryClient = useQueryClient();

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

  const deletePreferenceMutation = useMutation({
    async mutationFn(prefId: number) {
      return axios.delete(`/api/preferences/${prefId}`);
    },
    async onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['preferences', { studentId, day }] });
    },
  });

  const setPreferenceMutation = trpc.preferences.setPreference.useMutation({
    async onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['preferences', { studentId, day }] });
    },
  });

  const showSpinner =
    preferencesQuery.isFetching ||
    ordersQuery.isFetching ||
    deletePreferenceMutation.isLoading ||
    setPreferenceMutation.isLoading;
  const showError = preferencesQuery.isError || ordersQuery.isError;

  return (
    <DashboardLayout>
      <Head>
        <title>Выбор блюд на день</title>
      </Head>
      <DashboardHeader backUrl="/dashboard">
        <h1>{dayMap[day].toUpperCase()}</h1>
        <div className={styles.saveBtn}>{totalCost} руб.</div>
      </DashboardHeader>
      <main className={styles.body}>
        {showSpinner && <ModalWrapper>Загрузка...</ModalWrapper>}
        {showError && 'Что-то пошло не так'}
        {!showError &&
          Object.entries(dishTypeMap).map(([type, title]) => {
            const preference = preferences?.get(type as DishType);
            const order = orders?.get(type as DishType);

            const { newDish, oldDish } = markDishesAsNewOrOld(preference?.Dish, order);

            return (
              <PreferenceSection
                key={type}
                title={title}
                dish={newDish}
                oldDish={oldDish}
                handleView={(id: number) => {
                  console.log(`Viewing dish #${id}`);
                  router.push(`/dashboard/dishes/${id}`);
                }}
                handleDelete={
                  type === DishType.EXTRA
                    ? preference && (() => deletePreferenceMutation.mutate(preference.id))
                    : undefined
                }
                handleEdit={() =>
                  router.push(`/dashboard/dishes?type=${type}&studentId=${studentId}&day=${day}`)
                }
                handleAdd={() =>
                  router.push(`/dashboard/dishes?type=${type}&studentId=${studentId}&day=${day}`)
                }
                handleCancel={() => {
                  if (!oldDish || !preference) return;

                  if (oldDish.type === 'EXTRA') {
                    return deletePreferenceMutation.mutate(preference.id);
                  }

                  setPreferenceMutation.mutate({
                    dishId: oldDish.id,
                    day,
                    studentId,
                  });
                }}
              />
            );
          })}
      </main>
    </DashboardLayout>
  );
}
