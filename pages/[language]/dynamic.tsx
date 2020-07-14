import React from 'react';
import {
  NextPage,
  GetStaticPaths,
  GetStaticProps,
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
import DynamicTranslations from '../../components/DynamicTranslations';
import Header from '../../components/Header';
import Title from '../../components/Title';

const Page: NextPage = () => {
  const { translations } = useI18n('/pages/[language]/dynamic');
  return (
    <>
      <Head>
        <meta name="title" content={translations.title as string} />
        <title>{translations.title}</title>
      </Head>
      <Header />
      <Title title={translations.title as string} />
      <DynamicTranslations />
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: getI18nStaticPaths(),
  fallback: false,
});

export const getStaticProps: GetStaticProps<GetI18nProps, GetI18nQuery> = async ({
  params,
}) => ({
  props: {
    ...await getI18nProps({
      language: params?.language as string,
      paths: [
        '/pages/[language]/dynamic',
        '/components/Header',
        '/components/SwitchButton',
        '/components/SwitchLink',
        '/components/Title',
        '/components/DynamicTranslations',
      ],
    }),
  },
});

export default withI18n(Page, '/dynamic');
