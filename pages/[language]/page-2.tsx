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
import Title from '../../components/Title';
import Header from '../../components/Header';

const Page: NextPage = () => {
  const { translations } = useI18n('pages/[language]/page-2');
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

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: getI18nStaticPaths(),
  fallback: false,
});

export const getStaticProps: GetStaticProps<GetI18nProps, GetI18nQuery> = async ({
  params,
}) => ({
  props: await getI18nProps(
    params?.language,
    [
      'pages/[language]/page-2',
      'components/Header',
      'components/SwitchButton',
      'components/SwitchLink',
      'components/Title',
    ],
  ),
});

export default withI18n(Page, '/page-2');
