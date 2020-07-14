import React from 'react';
import { NextPage } from 'next';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import useSWR from 'swr';
import Head from 'next/head';
import { JsonMap } from '../types/json';
import config from '../i18n.config';

const { allLanguages, defaultLanguage, domains } = config;

// type AvailableLanguages = Array<keyof typeof allLanguages>;
type AvailableLanguages = string[];
type AvailableLanguage = string;

export interface Translations {
  [key:string]: JsonMap;
}

export interface GetI18nProps {
  language: AvailableLanguage;
  translations: Translations;
}

export interface GetI18nQuery {
  [key: string]: string;
}

interface GetI18nStaticPaths {
  params: GetI18nQuery;
}

// Partial to make href and as optional
// in case you just want to switch the language
interface LinkProps extends Partial<NextLinkProps> {
  language?: string;
  href?: string;
  as?: string;
}

const I18nContext = React.createContext({
  language: defaultLanguage.prefix,
  translations: {} as Translations,
  config: defaultLanguage,
});

export const useDynamicI18n = (path: string): {
  language: AvailableLanguage,
  config: typeof defaultLanguage,
  translations: Translations,
  isLoading: boolean,
  error: typeof Error,
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

export const useI18n = (path: string): {
  language: AvailableLanguage,
  translations: JsonMap,
  config: typeof defaultLanguage,
} => {
  const { language, translations } = React.useContext(I18nContext);

  return {
    language,
    translations: translations[path],
    config: allLanguages[language],
  };
};

/* eslint-disable react/jsx-props-no-spreading */
export const withPrefetchDynamicTranslations = <Props, >(
  Component: React.FC<Props>, path: string,
): React.FC<Props> => {
  const WithPrefetchDynamicTranslations: React.FC<Props> = (props) => {
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

  return WithPrefetchDynamicTranslations;
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
/*
  pageRoute is used to add the href alternate head tags link. Optional
*/
export const withI18n = (Page: NextPage, pageRoute?: string): NextPage<GetI18nProps> => {
  const WithI18nProvider: NextPage<GetI18nProps> = ({ language, translations, ...props }) => (
    <I18nContext.Provider value={{
      language,
      translations,
      config: allLanguages[language],
    }}
    >
      {
        typeof pageRoute !== 'undefined' && (
          <HrefAlternateHeadTags pathname={pageRoute} />
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

const loadAllTranslations = async (
  translationsDir: string,
  language: string,
  fs: any,
): Promise<Translations> => {
  const translations: Translations = {};

  const loadTranslationsFromDir = async (dirname: string): Promise<void> => {
    const files = await fs.readdir(dirname);
    await Promise.all(
      files.map(async (file: any) => {
        const fileOrSubDir = `${dirname}/${file}`;
        const stats = await fs.stat(fileOrSubDir);
        if (stats.isDirectory()) {
          await loadTranslationsFromDir(fileOrSubDir);
        } else if (stats.isFile() && (file.endsWith(`${language}.json`))) {
          // const module = await import(`../${fileOrSubDir}`);
          // translations[fileOrSubDir] = module.default as JsonMap;
          const data = await fs.readFile(fileOrSubDir);
          const jsonModule = JSON.parse(data.toString());
          translations[fileOrSubDir] = jsonModule;
        }
      }),
    );
  };
  await loadTranslationsFromDir(translationsDir);
  return translations;
};

export const getI18nProps = async ({
  language,
  paths,
  translationsDir = 'public/translations',
  fs,
}: {
  language: AvailableLanguage;
  paths?: string[];
  translationsDir?: string;
  fs?: any
}): Promise<GetI18nProps> => {
  const translations: Translations = {};
  if (!paths) {
    // recurse over all existing translations
    const fullTranslations = await loadAllTranslations(translationsDir, language, fs);
    Object.keys(fullTranslations).forEach((translationKey) => {
      translations[
        translationKey
          .slice(translationsDir.length + 1)
          .slice(0, -(language.length + '.json/'.length))
      ] = fullTranslations[translationKey];
    });
  } else {
    await Promise.all(
      paths.map(async (path) => {
        const module = await import(`../${translationsDir}/${path}/${language}.json`);
        translations[path] = module.default as JsonMap;
      }),
    );
  }

  return ({
    language: language || defaultLanguage.prefix,
    translations,
  });
};

/*
only works in the browser, where `window` is defined
*/
export const getLanguageFromURL = (): AvailableLanguage | undefined => {
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

/*
only works in the browser, where `window` is defined
*/
export const getI18nAgnosticPathname = (): string | undefined => {
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

  return undefined;
};

export const changeDocumentLanguage = (language: string): void => {
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    window.document.querySelector('html')!.lang = language;
  }
};

export const setI18nCookie = (language: string): void => {
  document.cookie = `preferred-language=${language}`;
};

export const Link: React.FC<LinkProps> = ({
  children, href, as, language, ...props
}) => {
  const { language: contextLanguage } = React.useContext(I18nContext);
  const finalLanguage = language || contextLanguage;
  const child = React.Children.only<typeof children>(
    typeof children === 'string' ? <a>{children}</a> : children,
  ) as JSX.Element;

  function onClick(e: React.MouseEvent<HTMLAnchorElement>) {
    changeDocumentLanguage(finalLanguage);
    setI18nCookie(finalLanguage);
    if (child) {
      if (typeof child.props.onClick === 'function') {
        child.props.onClick(e);
      }
    }
  }

  const finalHref = typeof href === 'undefined' ? getI18nAgnosticPathname() || '' : href;

  return (
    <NextLink
      href={`/[language]${finalHref}`}
      as={`/${finalLanguage}${as || finalHref}`}
      passHref
      {...props}
    >
      {React.cloneElement(child, { onClick })}
    </NextLink>
  );
};
