import React from 'react';
import Router from 'next/router';
import { useI18n, withPrefetchTranslations, getI18nAgnosticPathname } from '../../utils/i18n';

const TranslationsPath = 'SwitchButton';

const Component: React.FC = () => {
  const {
    translations, isLoading, config,
  } = useI18n(TranslationsPath);

  if (isLoading) {
    return (
      <h1>
        Loading translations...
      </h1>
    );
  }

  return (
    <button
      onClick={
        () => Router.push(`/${config.prefix === 'en' ? 'ar' : 'en'}${getI18nAgnosticPathname()}`)
      }
      type="button"
    >
      {translations.name}
    </button>
  );
};

export default withPrefetchTranslations(Component, TranslationsPath);
