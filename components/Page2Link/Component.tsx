import React from 'react';
import styles from './styles.css';
import { useI18n, withPrefetchTranslations, Link } from '../../utils/i18n';

const TranslationsPath = 'Page2Link';

const Component: React.FC = () => {
  const {
    translations, isLoading,
  } = useI18n(TranslationsPath);

  if (isLoading) {
    return (
      <h1>
        Loading translations...
      </h1>
    );
  }

  return (
    <Link href="/page-2">
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a className={styles.link}>
        {translations.name}
      </a>
    </Link>
  );
};

export default withPrefetchTranslations(Component, TranslationsPath);
