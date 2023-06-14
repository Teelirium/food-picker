import axios from 'axios';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useForm } from 'react-hook-form';

import { getServerSessionWithOpts } from 'utils/getServerSession';
import verifyRole from 'utils/verifyRole';

import { UserFormData, UserRole } from '../types/UserData';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSessionWithOpts(ctx);

  if (!session || !verifyRole(session, ['ADMIN'])) {
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

const Register: NextPage = () => {
  const roles: UserRole[] = ['PARENT', 'TEACHER', 'WORKER', 'ADMIN'];
  const { register, handleSubmit } = useForm<UserFormData>();

  const onSubmit = handleSubmit((data) => {
    axios
      .post('/api/auth/register', { user: data })
      .then(() => console.log('Пользователь зарегистрирован'))
      .catch(console.log);
  });

  return (
    <div className="bg-slate-300 h-screen w-screen">
      <Head>
        <title>Регистрация пользователя</title>
      </Head>
      <form className="flex flex-col" onSubmit={onSubmit}>
        <label>
          Фамилия
          <input type="text" {...register('surname')} required />
        </label>
        <label>
          Имя
          <input type="text" {...register('name')} required />
        </label>
        <label>
          Отчество
          <input type="text" {...register('middleName')} />
        </label>
        <label>
          Логин
          <input type="text" {...register('username')} required />
        </label>
        <label>
          Пароль
          <input type="text" {...register('password')} required />
        </label>
        <label>
          Роль
          <select {...register('role')}>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </label>
        <button className="bg-orange-300" type="submit">
          Зарегистрировать
        </button>
      </form>
    </div>
  );
};

export default Register;
