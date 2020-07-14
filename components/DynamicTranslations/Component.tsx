import React from 'react';
import { useDynamicI18n, withPrefetchDynamicTranslations } from '../../utils/i18n';

const TranslationsPath = '/components/DynamicTranslations';

const Component: React.FC = () => {
  const {
    translations, isLoading, error,
  } = useDynamicI18n(TranslationsPath);

  if (error) {
    return (
      <h1>
        {error.toString()}
      </h1>
    );
  }

  if (isLoading) {
    return (
      <h1>
        Loading translations...
      </h1>
    );
  }

  return (
    <h1 style={{ padding: '10px 10px' }}>
      {translations.name}
    </h1>
  );
};

export default withPrefetchDynamicTranslations(Component, TranslationsPath);
