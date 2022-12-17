import {
  GetServerSideProps,
  GetStaticProps,
  InferGetStaticPropsType
} from "next";
//@ts-ignore
import { createSwaggerSpec } from "next-swagger-doc";
import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";
import { getServerSideSession } from "utils/getServerSession";
import verifyRole from "utils/verifyRole";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSideSession(ctx);
  if (!session || !verifyRole(session, ["ADMIN"])) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

const SwaggerUI = dynamic<{
  spec: any;
  //@ts-ignore
}>(import("swagger-ui-react"), { ssr: false });

export const getStaticProps: GetStaticProps = async () => {
  const spec: Record<string, any> = createSwaggerSpec({
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Next Swagger API Example",
        version: "1.0",
      },
    },
  });

  return {
    props: {
      spec,
    },
  };
};

function ApiDoc({ spec }: InferGetStaticPropsType<typeof getStaticProps>) {
  return <SwaggerUI spec={spec} />;
}

export default ApiDoc;
