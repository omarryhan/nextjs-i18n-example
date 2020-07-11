import React from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import styles from './styles.css';
import { useI18n } from '../../utils/i18n';

const Component: React.FC = () => {
  const { language, config } = useI18n();

  const { data } = useSWR(
    `Components/SwitchLink/translations/${language}`,
    async (_) => await import(`./translations/${language}.json`),
  );

  const translations = data || {};

  return (
    <Link href={`/${config.prefix === 'en' ? 'ar' : 'en'}`}>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a className={styles.link}>
        {translations.name}
      </a>
    </Link>
  );
};

export default Component;
