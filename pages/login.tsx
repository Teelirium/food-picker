import classNames from 'classnames';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';

import Button from 'components/Button';
import Checkbox from 'components/Checkbox';
import { getServerSideSession } from 'utils/getServerSession';
import verifyRole from 'utils/verifyRole';

import dishImage from '../public/img/authDish.png';
import dishCircleImage from '../public/img/authDishCircle.png';
import styles from '../styles/login.module.scss';
import { trpc } from 'utils/trpc/client';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSideSession(ctx);
  if (!session) {
    return {
      props: {},
    };
  }

  if (verifyRole(session, ['PARENT'])) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  }

  if (verifyRole(session, ['WORKER', 'ADMIN'])) {
    return {
      redirect: {
        destination: '/dashboard/worker/dishes',
        permanent: false,
      },
    };
  }

  if (verifyRole(session, ['TEACHER'])) {
    return {
      redirect: {
        destination: '/dashboard/teacher',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

type LoginFormData = {
  username: string;
  password: string;
  rememberMe?: boolean;
};

const Login: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const router = useRouter();
  const { error } = router.query as { error?: string };

  const onSubmit = handleSubmit((data: LoginFormData) => signIn('credentials', data));

  return (
    <>
      <Head>
        <title>Вход</title>
        <meta charSet="utf-8" />
      </Head>
      <div className={styles.container}>
        <div className={styles.sideImageDish}>
          <Image src={dishImage} alt="Центральное блюдо" />
        </div>

        <div className={styles.gradientBg}>
          <div className={styles.dashedBorder}>
            <div className={styles.sideImageDishesCircle}>
              <Image src={dishCircleImage} alt="Круг из блюд" />
            </div>
          </div>
        </div>

        <div className={styles.cardWrapper}>
          <div className={styles.card}>
            <div className={styles.schoolName}>
              <h1 className={styles.schoolTitle}>ШКОЛА № 123</h1>
            </div>
            <form className={styles.form} onSubmit={onSubmit}>
              {error ? (
                <div className={styles.error}>Неверное имя пользователя или пароль</div>
              ) : null}
              <label className={styles.label}>
                <p>Логин</p>
                <div
                  className={classNames(
                    styles.inputBorder,
                    errors.username && styles.inputBorderWithError,
                  )}
                >
                  <input
                    type="text"
                    {...register('username', { required: true })}
                    placeholder="Логин"
                  />
                </div>
              </label>

              <label className={styles.label}>
                <p>Пароль</p>
                <div
                  className={classNames(
                    styles.inputBorder,
                    errors.password && styles.inputBorderWithError,
                  )}
                >
                  <input
                    type="password"
                    {...register('password', { required: true })}
                    placeholder="Пароль"
                  />
                </div>
              </label>

              <Checkbox className={styles.rememberMeCheckbox} {...register('rememberMe')}>
                Запомнить меня
              </Checkbox>

              <Button type="submit" className={styles.logInButton}>
                Войти
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
