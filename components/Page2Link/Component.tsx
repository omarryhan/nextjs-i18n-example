import React from 'react';
import styles from './styles.css';
import { useI18n, Link } from '../../utils/i18n';

const TranslationsPath = 'Page2Link';

const Component: React.FC = () => {
  const {
    translations,
  } = useI18n(TranslationsPath);

  return (
    <Link href="/page-2">
      <a className={styles.link}>
        {translations.name}
      </a>
    </Link>
  );
};

export default Component;
