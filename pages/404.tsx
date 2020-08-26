import React from 'react';
import Head from 'next/head';

import { GetStaticProps } from 'next';
import i18nConfig from '../i18n.config';
import { GetI18nProps, getI18nProps } from '../utils/i18n';

const Component: React.FC<GetI18nProps> = () => (
  <>
    <Head>
      <meta name="robots" content="noindex, nofollow" />
    </Head>
    <p style={{ margin: '20px 20px' }}>
      404: Page not found
    </p>
  </>
);

export const getStaticProps: GetStaticProps<GetI18nProps> = async () => ({
  props: {
    ...await getI18nProps({
      language: i18nConfig.defaultLanguage.prefix,
      paths: [],
    }),
  },
});

export default Component;
