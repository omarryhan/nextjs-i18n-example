import React from 'react';
import Head from 'next/head';
import Router from 'next/router';

import { GetServerSideProps } from 'next';
import i18nConfig from '../i18n.config';
import { GetI18nProps } from '../utils/i18n';

const { defaultLanguage } = i18nConfig;

const Component: React.FC<GetI18nProps> = ({ language }) => {
  React.useEffect(() => {
    Router.replace(`/${language}`);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Head>
      <meta name="robots" content="noindex, nofollow" />
    </Head>
  );
};

// https://stackoverflow.com/questions/5639346/what-is-the-shortest-function-for-reading-a-cookie-by-name-in-javascript
// https://stackoverflow.com/questions/3393854/get-and-set-a-single-cookie-with-node-js-http-server
// https://stackoverflow.com/questions/51812422/node-js-how-can-i-get-cookie-value-by-cookie-name-from-request
function parseCookies(rc: string): {[key: string]: string} {
  const list: {[key: string]: string} = {};

  rc && rc.split(';').forEach((cookie) => {
    const parts = cookie.split('=');
    if (parts.length) {
      list[(parts.shift() as string).trim()] = decodeURI(parts.join('='));
    }
  });

  return list;
}

// function parseCookies(cookieString: string): {[key: string]: string} {
//   const rx = /([^;=\s]*)=([^;]*)/g;
//   const obj: {[key: string]: string} = { };
//   for (let m; m = rx.exec(cookieString);) { obj[m[1]] = decodeURIComponent(m[2]); }
//   return obj;
// }

// https://github.com/vercel/next.js/discussions/14547#discussion-7687
// https://github.com/vercel/next.js/discussions/14890
// https://github.com/vercel/next.js/discussions/11281
export const getServerSideProps: GetServerSideProps<GetI18nProps> = async ({ req, res }) => {
  let finalLanguage = '';

  const cookies = parseCookies(req.headers.cookie || '');

  const AcceptLanguage = req.headers['accept-language'] as string | undefined;
  let userLang = AcceptLanguage ? AcceptLanguage.substring(0, 2) : undefined;

  userLang = userLang === 'en' ? userLang : 'ar';

  finalLanguage = cookies['preferred-language'] || userLang || defaultLanguage.prefix;

  if (typeof window === 'undefined') {
    res.statusCode = 302;
    res.setHeader('Location', `/${finalLanguage}`);
  }

  return {
    props: {
      language: finalLanguage,
      translations: {},
    },
  };
};

export default Component;
