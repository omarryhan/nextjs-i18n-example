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
  GetI18nQuery,
  Link,
} from '../../utils/i18n';
import DynamicTranslations from '../../components/DynamicTranslations';
import SwtitchLink from '../../components/SwitchLink';
import SwtichButton from '../../components/SwitchButton';

const Page: NextPage = () => (
  <>
    <Head>
      <meta name="title" content="Dynamic" />
      <title>Dynamic</title>
    </Head>
    <SwtitchLink />
    <SwtichButton />
    <DynamicTranslations />
    <Link href="">
      <a style={{ display: 'block' }}>
        Home (too lazy to translate this text)
      </a>
    </Link>
  </>
);

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
      'NestedTranslation/NestedDir',
      'Page2Link',
      'SwitchButton',
      'SwitchLink',
      'Title',
    ],
  ),
});

export default withI18n(Page, '/dynamic');
