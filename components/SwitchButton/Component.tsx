import React from 'react';
import Router from 'next/router';
import { useI18n, getI18nAgnosticPathname } from '../../utils/i18n';

const Component: React.FC = () => {
  const {
    translations, config,
  } = useI18n('components/SwitchButton');

  return (
    <button
      onClick={
        () => Router.push(`/${config.prefix === 'en' ? 'ar' : 'en'}${getI18nAgnosticPathname() || ''}`)
      }
      type="button"
    >
      {translations.name}
    </button>
  );
};

export default Component;
