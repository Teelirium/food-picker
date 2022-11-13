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
      <div className={styles.container}>
      <div className={styles.schoolName}>
        <h1 className={styles.schoolTitle}>ШКОЛА № 123</h1>
      </div>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>

          <label className={styles.label}>
            <p>Логин</p>
            <div className={styles.inputBorder}>
              <input type={"text"} {...register("username")} placeholder="Логин" required />
            </div>
          </label>

          <label className={styles.label}>
          <p>Пароль</p>
          <div className={styles.inputBorder}>
            <input type={"password"} {...register("password")} placeholder="Пароль" required />
          </div>
          </label>

          <label className={styles.labelRememberMe}>
            <label className={styles.checkboxLabel}>
              <input className={styles.checkbox} type={"checkbox"} {...register("rememberMe")} />
              <span className={styles.customCheckbox}></span>
            </label>
            <p>Запомнить меня</p>
          </label>

          <button className={styles.logInButton}>Войти</button>
        </form>
      </div>
    </>
  );
};

export default Login;
