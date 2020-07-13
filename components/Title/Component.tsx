import React from 'react';
import { useI18n } from '../../utils/i18n';

const TranslationsPath = 'Title';

const Component: React.FC = () => {
  const {
    language, translations, config,
  } = useI18n(TranslationsPath);

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

        {/* Same */}
        {config.prefix || language}
      </p>
    </div>
  );
};

export default Component;
