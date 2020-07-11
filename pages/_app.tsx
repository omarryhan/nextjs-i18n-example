/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import Head from 'next/head';
import App, { AppInitialProps } from 'next/app';
import '../components/global-styles.css';
import i18nConfig from '../i18n.config';

const { allLanguages, defaultLanguage } = i18nConfig;

class MyApp extends App<AppInitialProps> {
  public render(): React.ReactElement {
    const {
      Component, pageProps,
    } = this.props;

    const { language } = pageProps;
    const languageObject = allLanguages[language as string] || defaultLanguage;
    const direction = languageObject.direction || 'ltr';

    return (
      <>
        <Head>
          <meta name="title" content="Next i18n example" />
          <meta name="description" content="Next i18n example" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        </Head>
        <div dir={direction}>
          <Component
            {...pageProps}
          />
        </div>
      </>
    );
  }
}

export default MyApp;
