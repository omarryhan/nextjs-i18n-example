import React from 'react';
import Router from 'next/router';
import { useI18n } from '../../utils/i18n';

const Component: React.FC = () => {
  const {
    translations, isLoading, config,
  } = useI18n('SwitchButton');

  if (isLoading) {
    return (
      <h1>
        Loading translations...
      </h1>
    );
  }

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
