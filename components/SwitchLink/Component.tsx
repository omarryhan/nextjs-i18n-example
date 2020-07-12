import React from 'react';
import styles from './styles.css';
import {
  useI18n, withPrefetchTranslations, Link, getI18nAgnosticPathname,
} from '../../utils/i18n';

const TranslationsPath = 'SwitchLink';

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
    <Link language={config.prefix === 'en' ? 'ar' : `en${getI18nAgnosticPathname()}`}>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a className={styles.link}>
        {translations.name}
      </a>
    </Link>
  );
};

export default withPrefetchTranslations(Component, TranslationsPath);
