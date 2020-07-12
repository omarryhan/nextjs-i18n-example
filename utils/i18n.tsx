import React from 'react';
import { NextPage } from 'next';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import useSWR from 'swr';
import Head from 'next/head';
import config from '../i18n.config';

const { allLanguages, defaultLanguage, domains } = config;

// type AvailableLanguages = Array<keyof typeof allLanguages>;
type AvailableLanguages = string[];
type AvailableLanguage = string;

export interface GetI18nStaticProps {
  // language: AvailableLanguage;
  [key: string]: string;
}

interface GetI18nStaticPaths {
  params: GetI18nStaticProps;
}

const I18nContext = React.createContext({
  language: defaultLanguage.prefix,
  config: defaultLanguage,
});

const getLanguageFromURL = (): AvailableLanguage | undefined => {
  if (typeof window !== 'undefined') {
    const language = window.location.pathname.split('/')[1];
    const isValidLanguage = (Object.keys(allLanguages) as AvailableLanguages).some(
      (validLanugage) => validLanugage === language,
    );
    if (isValidLanguage) {
      return language as AvailableLanguage;
    }
  }
  return undefined;
};

export const useI18n = (path: string): {
  language: AvailableLanguage,
  config: typeof defaultLanguage,
  translations: { [key: string]: any },
  isLoading: boolean,
  error: any,
} => {
  const { language } = React.useContext(I18nContext);

  const { data, error } = useSWR(
    `/translations/${path}/${language}.json`,
    async (translationsPath) => (await fetch(translationsPath)).json(),
  );

  return {
    language,
    config: allLanguages[language],
    isLoading: typeof data === 'undefined',
    translations: data || {},
    error,
  };
};

/* eslint-disable react/jsx-props-no-spreading */
export const withPrefetchTranslations = <Props, >(
  Component: React.FC<Props>, path: string,
): React.FC<Props> => {
  const WithPrefetchTranslations: React.FC<Props> = (props) => {
    const { language } = React.useContext(I18nContext);
    return (
      <>
        <Head>
          <link rel="prefetch" href={`/translations/${path}/${language}.json`} as="fetch" crossOrigin="anonymous" />
        </Head>
        <Component {...props} />
      </>
    );
  };

  return WithPrefetchTranslations;
};

const HrefAlternateHeadTags: React.FC<{pathname: string}> = ({ pathname }) => {
  const currentDomain = process.env.NODE_ENV === 'production' ? domains.production : domains.development;

  return (
    <Head>
      {
        Object.keys(allLanguages).map(
          (language) => (
            <link
              key={allLanguages[language].prefix}
              rel="alternate"
              href={`${currentDomain}/${allLanguages[language].prefix}${pathname}`}
              hrefLang={allLanguages[language].prefix}
            />
          ),
        )
      }
    </Head>
  );
};

/* eslint-disable react/jsx-props-no-spreading */
export const withI18n = (Page: NextPage, pathname?: string): NextPage<GetI18nStaticProps> => {
  const WithI18nProvider: NextPage<GetI18nStaticProps> = ({ language, ...props }) => (
    <I18nContext.Provider value={{
      language,
      config: allLanguages[language],
    }}
    >
      {
        typeof pathname !== 'undefined' && (
          <HrefAlternateHeadTags pathname={pathname} />
        )
      }
      <Page {...props} />
    </I18nContext.Provider>
  );

  return WithI18nProvider;
};

export function getI18nStaticPaths(): GetI18nStaticPaths[] {
  return Object.keys(allLanguages).map(
    (language) => ({ params: { language: allLanguages[language].prefix } }),
  );
}

export const getI18nStaticProps = (
  staticPathLanguage: AvailableLanguage | undefined,
): GetI18nStaticProps => ({
  language: staticPathLanguage || getLanguageFromURL() || defaultLanguage.prefix,
});

// Partial to make href and as optional
// in case you just want to switch the language
interface LinkProps extends Partial<NextLinkProps> {
  language?: string;
  noLanguage?: boolean;
  href?: string;
  as?: string;
}

/*
only works in the browser, where `window` is defined
*/
export const getI18nAgnosticPathname = (): string => {
  if (typeof window !== 'undefined') {
    const { pathname } = window.location;
    const paths = pathname.split('/');
    const mightBePrefix = paths[1];

    const allPrefixes = Object.values(allLanguages).map((lang) => lang.prefix);

    const isPrefix = allPrefixes.some((prefix) => prefix === mightBePrefix);

    if (isPrefix) {
      paths.splice(1, 1);
    }

    return paths.join('/');
  }

  return '';
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const Link: React.FC<LinkProps> = ({
  children, href = '', as = '', language, noLanguage = false, ...props
}) => {
  const { language: contextLanguage } = React.useContext(I18nContext);
  const finalLanguage = language || contextLanguage;
  const child = React.Children.only<any>(
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    typeof children === 'string' ? <a>{children}</a> : children,
  );

  function onClick(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = document.querySelector('html');
    if (el) el.lang = finalLanguage;
    if (child) {
      if (typeof child.props.onClick === 'function') {
        child.props.onClick(e);
      }
    }
  }

  // NOTE: Only prepending lang misses some edge cases.
  // TODO: Fix it. Check: https://github.com/vinissimus/next-translate/blob/master/src/fixAs.js
  return (
    <NextLink
      href={noLanguage ? href : `/${finalLanguage}${href || getI18nAgnosticPathname()}`}
      as={noLanguage ? as || href : `/${finalLanguage}${as || href || getI18nAgnosticPathname()}`}
      {...props}
    >
      {React.cloneElement(child, { onClick })}
    </NextLink>
  );
};
