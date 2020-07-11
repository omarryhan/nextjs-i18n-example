import React from 'react';
import Document, {
  DocumentInitialProps, DocumentProps, Html, Head, Main, NextScript,
} from 'next/document';
import i18nConfig, { Language } from '../i18n.config';

const { allLanguages, defaultLanguage } = i18nConfig;

const getCurrentLanguage = ({ __NEXT_DATA__ }: DocumentProps): Language => {
  const { page } = __NEXT_DATA__;
  const [, langQuery] = page.split('/');
  const lang = Object.keys(allLanguages).find(
    (language) => allLanguages[language].prefix === langQuery,
  );

  return allLanguages[lang || defaultLanguage.prefix] || defaultLanguage;
};

export default class MyDocument extends Document<DocumentInitialProps> {
  render(): JSX.Element {
    const { prefix } = getCurrentLanguage(this.props);
    return (
      <Html lang={prefix}>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
