import { GetServerSideProps, NextPage } from "next";
import { useEffect } from "react";

type Props = {

}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { studentId, day } = ctx.query;
  console.log(studentId, day)
  return {
    props: {}
  };
};

const StudentChoice: NextPage = () => {
  useEffect(() => {console.log('useEffect')}, [])
  return null;
};

export default StudentChoice;
