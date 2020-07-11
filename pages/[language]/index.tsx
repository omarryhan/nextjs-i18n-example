import React from 'react';
import {
  NextPage,
  GetStaticPaths,
  GetStaticProps,
  // GetServerSideProps,
} from 'next';
import Head from 'next/head';
import {
  getI18nStaticPaths,
  withI18n,
  getI18nStaticProps,
  GetI18nStaticProps,
} from '../../utils/i18n';
import Title from '../../components/Title';
import SwtitchLink from '../../components/SwitchLink';
import SwtichButton from '../../components/SwitchButton';

const Page: NextPage = () => (
  <>
    <Head>
      <meta name="title" content="Next Translate Demo | Home" />
      <title>Next Translate Demo | Home</title>
    </Head>
    <Title />
    <SwtitchLink />
    <SwtichButton />
  </>
);

export const getStaticPaths: GetStaticPaths<GetI18nStaticProps> = async () => ({
  paths: getI18nStaticPaths(),
  fallback: false,
});

export const getStaticProps: GetStaticProps<GetI18nStaticProps, GetI18nStaticProps> = async ({
  params,
}) => ({
  props: getI18nStaticProps(params?.language),
});

// export const getServerSideProps: GetServerSideProps<
// GetI18nStaticProps, GetI18nStaticProps
// > = async ({ params }) => ({
//   props: getI18nStaticProps(params?.language),
// });

export default withI18n(Page);
