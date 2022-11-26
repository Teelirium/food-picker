import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import { options } from "pages/api/auth/[...nextauth]";
import { useEffect } from "react";
import isValidDay from "utils/isValidDay";

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
  useEffect(() => {
    axios
      .get(`/api/preferences?studentId=${studentId}&day=${day}`)
      .then(console.log);
  }, [studentId, day]);
  return <div></div>;
};

export default StudentChoice;
