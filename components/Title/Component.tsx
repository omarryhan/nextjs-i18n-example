import React from 'react';
import useSWR from 'swr';
import { useI18n } from '../../utils/i18n';

const Component: React.FC = () => {
  const { language, config } = useI18n();

  const { data } = useSWR(
    `Components/Title/translations/${language}`,
    async (_) => await import(`./translations/${language}.json`),
  );

  const translations = data || {};

  return (
    <div>
      <h1>
        {translations.name}
      </h1>
      <h2>
        {translations.language_description}
        {' '}
        {config.name}
      </h2>
      <p>
        {translations.prefix_description}
        {' '}
        {config.prefix}
      </p>
    </div>
  );
};

export default Component;
