import { NextPage } from "next";
import Head from "next/head";
import { useForm } from "react-hook-form";
import { UserFormData, UserRole } from "../types/userData";

const Register: NextPage = () => {
  const roles: UserRole[] = ['PARENT', 'TEACHER', 'WORKER', 'ADMIN'];
  const { register, handleSubmit } = useForm<UserFormData>();

  const onSubmit = handleSubmit(data => {
    alert(JSON.stringify(data))
  })

  return (
    <div className='bg-slate-300 h-screen w-screen'>
      <Head>
        <title>Регистрация пользователя</title>
      </Head>
      <form className="flex flex-col" onSubmit={onSubmit}>
        <label>
          Имя
          <input type={"text"} {...register("name")} required />
        </label>
        <label>
          Фамилия
          <input type={"text"} {...register("surname")} required />
        </label>
        <label>
          Отчество
          <input type={"text"} {...register("middleName")} />
        </label>
        <label>
          Логин
          <input type={"text"} {...register("middleName")} required />
        </label>
        <label>
          Пароль
          <input type={"text"} {...register("middleName")} required />
        </label>
        <label>
          Роль
          <select {...register('role')}>
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </label>
        <button className='bg-orange-300'>Зарегистрировать</button>
      </form>
    </div>
  );
};

export default Register;
