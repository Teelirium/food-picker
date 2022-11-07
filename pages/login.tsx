import { NextPage } from "next";
import styles from '../styles/login.module.css';
import Head from "next/head";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

type LoginFormData = {
    username: string;
    password: string;
    rememberMe?: boolean;
}

const Login: NextPage = () => {
  const { register, handleSubmit } = useForm<LoginFormData>();
  const router = useRouter();

  function onSubmit(data: LoginFormData) {
    fetch('/api/login', {method: 'POST', body: JSON.stringify(data)})
    .then(() => router.push('/dashboard'))
    .catch(() => alert('Неверный логин или пароль'))
  }

  return (
    <>
      <Head>
        <title>Log In</title>
        <meta charSet='utf-8' />
      </Head>
      <div className='bg-green-200 m-0 p-6 h-screen w-screen'>
        <form className='flex flex-col gap-2 w-1/3' onSubmit={handleSubmit(onSubmit)}>
          <label>
            Логин
            <input type={"text"} {...register("username")} required />
          </label>
          <label>
            Пароль
            <input type={"password"} {...register("password")} required />
          </label>
          <label>
            <input type={"checkbox"} {...register("rememberMe")} />
            Запомнить меня
          </label>
          <button className='bg-gray-100'>Войти</button>
        </form>
      </div>
    </>
  );
};

export default Login;
