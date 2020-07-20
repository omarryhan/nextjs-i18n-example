import React from 'react';
import { useI18n } from '../../utils/i18n';

const TranslationsNeeded = '/components/Title';

const Component: React.FC<{title: string}> = ({ title }) => {
  const {
    language, translations, config,
  } = useI18n(TranslationsNeeded);

  return (
    <div style={{ padding: '10px 10px' }}>
      <h1>
        {title}
      </h1>
      <h2>
        {translations.language_description}
        {' '}
        {config.name}
      </h2>
      <p>
        {translations.prefix_description}
        {' '}

        {/* Should be the same */}
        {config.prefix || language}
      </p>
    </div>
  );
};

export const AllTranslationsNeeded: string[] = [
  TranslationsNeeded,
];

export default Component;
