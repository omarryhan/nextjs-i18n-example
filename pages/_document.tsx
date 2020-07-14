import React from 'react';
import Document, {
  DocumentInitialProps, Html, Head, Main, NextScript,
} from 'next/document';
import { getLanguageFromURL } from '../utils/i18n';

export default class MyDocument extends Document<DocumentInitialProps> {
  render(): JSX.Element {
    // eslint-disable-next-line no-underscore-dangle
    const { page } = this.props.__NEXT_DATA__;
    const prefix = getLanguageFromURL(page);
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
