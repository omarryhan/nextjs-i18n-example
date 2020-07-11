import React from 'react';
import { NextPage } from 'next';
import useSWR from 'swr';
import config from '../i18n.config';

const { allLanguages, defaultLanguage } = config;

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

/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */
export const withI18n = (Page: NextPage): NextPage<GetI18nStaticProps> => {
  const WithI18nProvider: NextPage<GetI18nStaticProps> = (props) => (
    <I18nContext.Provider value={{
      language: props.language,
      config: allLanguages[props.language],
    }}
    >
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
