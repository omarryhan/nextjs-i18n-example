import React from 'react';
import {
  NextPage,
  GetServerSideProps,
} from 'next';
import Head from 'next/head';
import {
  withI18n,
  getI18nProps,
  GetI18nProps,
  GetI18nQuery,
  useI18n,
} from '../../utils/i18n';
import Title, { AllTranslationsNeeded as TitleAllTranslationsNeeded } from '../../components/Title';
import Header, { AllTranslationsNeeded as HeaderAllTranslationsNeeded } from '../../components/Header';

const TranslationsNeeded = '/pages/[language]/ssr';

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
        TranslationsNeeded,
        ...TitleAllTranslationsNeeded,
        ...HeaderAllTranslationsNeeded,
      ],
    }),
  },
});

export default withI18n(Page, '/ssr');
