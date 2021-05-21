import React from 'react';
import { useDynamicI18n, withPrefetchDynamicTranslations } from '../../utils/i18n';

const TranslationsNeeded = '/components/DynamicTranslations';

const Component: React.FC = () => {
  const {
    translations, isLoading, error, language,
  } = useDynamicI18n(TranslationsNeeded);

  if (error) {
    return (
      <h1>
        {error.toString()}
      </h1>
    );
  }

  if (!isLoading) {
    return (
      <h1>
        {language === 'en' ? 'Loading translations...' : 'جاري التحميل...'}
      </h1>
    );
  }

  return (
    <h1 style={{ padding: '10px 10px' }}>
      {translations.name}
    </h1>
  );
};

export const AllTranslationsNeeded: string[] = [
  TranslationsNeeded,
];

export default withPrefetchDynamicTranslations(Component, TranslationsNeeded);
