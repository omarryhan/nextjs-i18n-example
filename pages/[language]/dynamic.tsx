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
import DynamicTranslations, { AllTranslationsNeeded as DynamicTranslationsAllTranslationsNeeded } from '../../components/DynamicTranslations';
import Header, { AllTranslationsNeeded as HeaderAllTranslationsNeeded } from '../../components/Header';
import Title, { AllTranslationsNeeded as TitleAllTranslationsNeeded } from '../../components/Title';

const TranslationsNeeded = '/pages/[language]/dynamic';

const Page: NextPage = () => {
  const { translations } = useI18n(TranslationsNeeded);
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
      paths: [
        TranslationsNeeded,
        ...DynamicTranslationsAllTranslationsNeeded,
        ...HeaderAllTranslationsNeeded,
        ...TitleAllTranslationsNeeded,
      ],
    }),
  },
});

export default withI18n(Page, '/dynamic');
