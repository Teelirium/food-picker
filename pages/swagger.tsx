import { GetStaticProps, InferGetStaticPropsType } from 'next';
import dynamic from 'next/dynamic';
import { createSwaggerSpec } from 'next-swagger-doc';
import 'swagger-ui-react/swagger-ui.css';

// @ts-ignore
const SwaggerUI = dynamic<{ spec: any }>(import('swagger-ui-react'), { ssr: false });

export const getStaticProps: GetStaticProps = async () => {
  const spec: Record<string, any> = createSwaggerSpec({
    definition: {
      openapi: '3.0.0',
      info: {
        title: "Food Picker's very epic API",
        version: '1.0',
      },
    },
  });

  return {
    props: {
      spec,
    },
  };
};

const ApiDoc = ({ spec }: InferGetStaticPropsType<typeof getStaticProps>) => (
  <SwaggerUI spec={spec} />
);

export default ApiDoc;
