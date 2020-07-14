import React from 'react';
import { useRouter } from 'next/router';
import styles from './styles.css';
import {
  useI18n, Link,
} from '../../utils/i18n';

const Component: React.FC = () => {
  const {
    translations, config,
  } = useI18n('/components/SwitchLink');

  const router = useRouter();

  return (
    <Link href={router.pathname} language={config.prefix === 'en' ? 'ar' : 'en'}>
      <a className={styles.link}>
        {translations.name}
      </a>
    </Link>
  );
};

export default Component;
