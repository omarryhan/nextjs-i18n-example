import React from 'react';
import {
  NextPage,
  GetStaticPaths,
  GetStaticProps,
  GetServerSideProps,
} from 'next';
import Head from 'next/head';
import {
  getI18nStaticPaths,
  withI18n,
  getI18nProps,
  GetI18nProps,
  GetI18nQuery,
  useI18n,
} from '../../utils/i18n';
import Title from '../../components/Title';
import Header from '../../components/Header';

const Page: NextPage = () => {
  const { translations } = useI18n('/pages/[language]/ssr');
  return (
    <>
      <Head>
        <meta name="title" content={translations.title as string} />
        <title>{translations.title}</title>
      </Head>
      <Header />
      <Title title={translations.title as string} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps<GetI18nProps, GetI18nQuery> = async ({
  params,
}) => ({
  props: {
    ...await getI18nProps({
      language: params?.language as string,
      paths: [
        '/pages/[language]/ssr',
        '/components/Header',
        '/components/SwitchButton',
        '/components/SwitchLink',
        '/components/Title',
      ],
    }),
  },
});

export default withI18n(Page, '/ssr');
