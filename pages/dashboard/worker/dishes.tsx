import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { z } from 'zod';

import ModalWrapper from 'components/ModalWrapper';
import LeftSideNavibar from 'components/SideNavibar';
import DishAboutModal from 'components/WorkerPage/DishAboutModal';
import Dishes from 'components/WorkerPage/Dishes';
import AddDishModal from 'components/WorkerPage/Dishes/AddDishModal';
import LoadingSpinner from 'components/ui/LoadingSpinner';
import styles from 'styles/worker.module.css';
import { getServerSessionWithOpts } from 'utils/getServerSession';
import prisma from 'utils/prismaClient';
import dishTypeSchema from 'utils/schemas/dishTypeSchema';
import idSchema from 'utils/schemas/idSchema';
import mealTimeSchema from 'utils/schemas/mealTimeSchema';
import { modalMethodSchema } from 'utils/schemas/modalMethodSchema';
import { trpc } from 'utils/trpc/client';
import verifyRole from 'utils/verifyRole';

const querySchema = z.object({
  mealTime: mealTimeSchema.default('Breakfast'),
  dishType: dishTypeSchema.default('PRIMARY'),
  modalMethod: modalMethodSchema.optional(),
  dishId: idSchema.optional(),
});

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSessionWithOpts(ctx);

  if (!session || !verifyRole(session, ['WORKER', 'ADMIN'])) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const workerData = await prisma.worker.findUnique({
    where: {
      id: +session.user.id,
    },
  });
  const workerName = `${workerData?.surname} ${workerData?.name} ${workerData?.middleName}`;
  const userRole = session.user.role;

  return {
    props: {
      workerName,
      userRole,
    },
  };
};

type Props = {
  workerName: string;
  userRole: string;
};

const WorkerIndexPage: NextPage<Props> = ({ workerName, userRole }) => {
  const router = useRouter();

  const { data: dishes, ...dishQuery } = trpc.dishes.getAll.useQuery(
    { includeHidden: true },
    {
      staleTime: Infinity,
      onError(err) {
        console.error(err.message);
        toast.error('Ошибка при загрузке блюд');
      },
    },
  );

  const { mealTime, dishType, modalMethod, dishId } = querySchema.parse(router.query);

  const currentDish = useMemo(() => dishes?.find((d) => d.id === dishId), [dishes, dishId]);

  const filteredDishes = useMemo(
    () => dishes?.filter((d) => d.type === dishType),
    [dishes, dishType],
  );

  return (
    <>
      <Head>
        <title>{userRole}</title>
      </Head>
      <div className={styles.container}>
        <LeftSideNavibar activePage={userRole === 'WORKER' ? 0 : 4} workerName={workerName} />
        <Dishes dishes={filteredDishes ?? []} mealTime={mealTime} dishType={dishType} />
      </div>
      {dishQuery.isFetching && (
        <ModalWrapper provideContainer>
          <LoadingSpinner />
        </ModalWrapper>
      )}
      {(modalMethod === 'POST' || modalMethod === 'UPDATE') && (
        <AddDishModal dish={currentDish} method={modalMethod} dishType={dishType} />
      )}
      {modalMethod === 'GET' && dishId !== undefined && (
        <DishAboutModal dishId={dishId} allowEditing />
      )}
    </>
  );
};

export default WorkerIndexPage;
