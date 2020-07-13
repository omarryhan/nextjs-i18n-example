/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import Head from 'next/head';
import App, { AppInitialProps } from 'next/app';
import '../components/global-styles.css';
import i18nConfig from '../i18n.config';
import { changeDocumentLanguage } from '../utils/i18n';

const { allLanguages, defaultLanguage } = i18nConfig;

class MyApp extends App<AppInitialProps> {
  // change the language again in case it was a client-
  // side transition (_document.tsx only runs on the server)
  componentDidMount(): void {
    const {
      pageProps,
    } = this.props;

    const { language } = pageProps;
    const languageObject = allLanguages[language as string];
    if (languageObject) {
      changeDocumentLanguage(languageObject.prefix);
    }
  }

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
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        </Head>
        <div dir={direction} style={{ maxWidth: '1000px', margin: '0 auto', backgroundColor: '#ddd' }}>
          <Component
            {...pageProps}
          />
        </div>
      </>
    );
  }
}

export default MyApp;
