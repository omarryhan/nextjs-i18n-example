import React from 'react';
import { useDynamicI18n, withPrefetchDynamicTranslations } from '../../utils/i18n';

const TranslationsPath = 'DynamicTranslations';

const Component: React.FC = () => {
  const {
    translations, isLoading,
  } = useDynamicI18n(TranslationsPath);

  if (isLoading) {
    return (
      <h1>
        Loading translations...
      </h1>
    );
  }

  return (
    <h1>
      {translations.name}
    </h1>
  );
};

export default withPrefetchDynamicTranslations(Component, TranslationsPath);
