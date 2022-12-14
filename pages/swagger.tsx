import {
  GetServerSideProps,
  GetStaticProps,
  InferGetStaticPropsType,
} from "next";
//@ts-ignore
import { createSwaggerSpec } from "next-swagger-doc";
import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";

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
