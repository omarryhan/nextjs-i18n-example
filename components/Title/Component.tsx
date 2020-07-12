import React from 'react';
import { useI18n, withPrefetchTranslations } from '../../utils/i18n';

const TranslationsPath = 'Title';

const Component: React.FC = () => {
  const {
    language, translations, isLoading, config,
  } = useI18n(TranslationsPath);

  if (isLoading) {
    return (
      <h1>
        Loading translations...
      </h1>
    );
  }

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

export default withPrefetchTranslations(Component, TranslationsPath);
