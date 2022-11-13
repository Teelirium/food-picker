import { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import styles from "../styles/login.module.css";
import { signInErrors } from "../utils/nextAuthErrors";

type LoginFormData = {
  username: string;
  password: string;
  rememberMe?: boolean;
};

const Login: NextPage = () => {
  const { register, handleSubmit } = useForm<LoginFormData>();
  const router = useRouter();

  const onSubmit = handleSubmit((data: LoginFormData) => {
    signIn("credentials", { redirect: false, ...data })
    .then((resp) => {
      if (resp?.ok) {
        return router.push("/dashboard");
      }
      if (resp?.error) {
        alert(signInErrors[resp?.error]);
      }
    });
  });

  return (
    <>
      <Head>
        <title>Вход</title>
        <meta charSet='utf-8' />
      </Head>
      <div className='bg-green-200 m-0 p-6 h-screen w-screen'>
        <form className='flex flex-col gap-2 w-1/3' onSubmit={onSubmit}>
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
