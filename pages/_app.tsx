/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import Head from 'next/head';
import App, { AppInitialProps } from 'next/app';
import '../components/global-styles.css';
import i18nConfig from '../i18n.config';
import {
  changeDocumentLanguage, setI18nCookie, changeDocumentDirection,
} from '../utils/i18n';
import { JsonMap } from '../types/json';

const { allLanguages, defaultLanguage } = i18nConfig;

interface I18nProps {
  translations: JsonMap
}

const TranslationsNeeded = '/pages/_app';

class MyApp extends App<AppInitialProps & I18nProps> {
  componentDidMount(): void {
    const {
      pageProps,
    } = this.props;

    const { language } = pageProps;
    const languageObject = allLanguages[language as string];
    if (languageObject) {
      // 1. Change the language again in case it was a client-side
      // transition (_document.tsx only runs on the server)
      changeDocumentLanguage(languageObject.prefix);

      // 2. Update the "preferred-language" cookie
      setI18nCookie(languageObject.prefix);

      // 3. Change html's dir
      changeDocumentDirection(languageObject.direction || 'ltr');
    }
  }

  public render(): React.ReactElement {
    const {
      Component, pageProps,
    } = this.props;

    const { language } = pageProps;
    const translations = pageProps.translations[TranslationsNeeded];
    const languageObject = allLanguages[language as string] || defaultLanguage;
    const direction = languageObject.direction || 'ltr';

    // 3. Set the dir div
    return (
      <>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
          <meta name="title" content={translations.title as string} />
          {/*
            Here you can add a custom manifest for your language e.g.
            <link rel="manifest" href={`/${translations.manifest}.json`} />
            `translations.manfifest` being the path to the particular manifest. e.g. manifest_ar

            You can also add custom keyword tags, description, etc.
          */}
        </Head>
        <div
          dir={direction}
          style={{
            maxWidth: '1000px',
            margin: '0 auto',
            backgroundColor: '#ddd',
          }}
        >
          <Component
            {...pageProps}
          />
        </div>
      </>
    );
  }
}

export default MyApp;
