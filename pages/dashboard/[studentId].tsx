import { Preference } from "types/Preference";
import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";
import isValidDay from "utils/isValidDay";
import dayMap from "utils/dayMap";

type Props = {
  studentId: number;
  day: number;
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const studentId = ctx.query.studentId ? +ctx.query.studentId : undefined;
  const day = ctx.query.day ? +ctx.query.day : undefined;

  if (studentId === undefined || day === undefined || !isValidDay(day)) {
    return {
      redirect: {
        destination: "/dashboard",
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

const StudentChoice: NextPage<Props> = (props) => {
  const { studentId, day } = props;
  const [prefs, setPrefs] = useState<Preference[] | null>(null);
  useEffect(() => {
    axios
      .get(`/api/preferences?studentId=${studentId}&day=${day}`)
      .then((p) => p.data)
      .then((data) => setPrefs(data))
      .catch(alert);
  }, [studentId, day]);

  return (
    <div className='bg-black w-screen h-screen text-white'>
      <h1>{dayMap[day]}</h1>
      <div className='p-3 border-white border'>
        {prefs?.map((p) => (
          <span key={p.id}>
            {p.Dish.type}
            <div>{p.Dish.name}</div>
          </span>
        ))}
      </div>
    </div>
  );
};

export default StudentChoice;
