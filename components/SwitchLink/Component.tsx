import React from 'react';
import styles from './styles.css';
import {
  useI18n, Link,
} from '../../utils/i18n';

const Component: React.FC = () => {
  const {
    translations, config,
  } = useI18n('components/SwitchLink');

  return (
    <Link language={config.prefix === 'en' ? 'ar' : 'en'}>
      <a className={styles.link}>
        {translations.name}
      </a>
    </Link>
  );
};

export default Component;
