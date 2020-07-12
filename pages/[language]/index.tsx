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
  getI18nProps,
  GetI18nProps,
} from '../../utils/i18n';
import Title from '../../components/Title';
import SwtitchLink from '../../components/SwitchLink';
import SwtichButton from '../../components/SwitchButton';
import Page2Link from '../../components/Page2Link';

const Page: NextPage = () => (
  <>
    <Head>
      <meta name="title" content="Next Translate Demo | Home" />
      <title>Next Translate Demo | Home</title>
    </Head>
    <Title />
    <SwtitchLink />
    <SwtichButton />
    <Page2Link />
  </>
);

export const getStaticPaths: GetStaticPaths<GetI18nProps> = async () => ({
  paths: getI18nStaticPaths(),
  fallback: false,
});

export const getStaticProps: GetStaticProps<GetI18nProps, GetI18nProps> = async ({
  params,
}) => ({
  props: getI18nProps(params?.language),
});

// export const getServerSideProps: GetServerSideProps<
// GetI18nProps, GetI18nProps
// > = async ({ params }) => ({
//   props: getI18nProps(params?.language),
// });

export default withI18n(Page, '');
