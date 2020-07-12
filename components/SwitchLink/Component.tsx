import React from 'react';
import Link from 'next/link';
import styles from './styles.css';
import { useI18n, withPrefetchTranslations } from '../../utils/i18n';

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
    <Link href={`/${config.prefix === 'en' ? 'ar' : 'en'}`}>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a className={styles.link}>
        {translations.name}
      </a>
    </Link>
  );
};

export default withPrefetchTranslations(Component, TranslationsPath);
