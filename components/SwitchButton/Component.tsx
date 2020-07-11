import React from 'react';
import Router from 'next/router';
import useSWR from 'swr';
import { useI18n } from '../../utils/i18n';

const Component: React.FC = () => {
  const { language, config } = useI18n();

  const { data } = useSWR(
    `Components/SwitchButton/translations/${language}`,
    async (_) => await import(`./translations/${language}.json`),
  );

  const translations = data || {};

  return (
    <button
      onClick={
        () => Router.push(`/${config.prefix === 'en' ? 'ar' : 'en'}`)
      }
      type="button"
    >
      {translations.name}
    </button>
  );
};

export default Component;
