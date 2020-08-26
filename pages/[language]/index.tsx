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
import Header from '../../components/Header';
import Title from '../../components/Title';
import RosettaImage from '../../components/RosettaImage';
import i18nConfig from '../../i18n.config';

const { domains } = i18nConfig;

const Page: NextPage = () => {
  const { translations } = useI18n('/pages/[language]/index');
  return (
    <>
      <Head>
        <meta name="title" content={translations.title as string} />
        <title>{translations.title}</title>
        <link rel="alternate" href={process.env.NODE_ENV === 'production' ? domains.production : domains.development} hrefLang="x-default" />
      </Head>
      <Header />
      <Title title={translations.title as string} />
      <RosettaImage />
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [
    ...getI18nStaticPaths(),
  ],
  fallback: false,
});

export const getStaticProps: GetStaticProps<GetI18nProps, GetI18nQuery> = async ({
  params,
}) => ({
  props: {
    ...await getI18nProps({
      language: params?.language as string,
      // The reason we're importing here, is because we can only
      // import node modules here and not in any other file.
      // More specifically, not outside of getStaticProps and getServerSideProps
      fs: (await import('fs')).promises, // pass it to import all the translations
    }),
  },
});

export default withI18n(Page, '');
