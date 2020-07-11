import React from 'react';
import Router from 'next/router';

import i18nConfig from '../i18n.config';

const { defaultLanguage } = i18nConfig;

const Component: React.FC = () => {
  React.useEffect(() => {
    Router.replace(`/${defaultLanguage.prefix}`);
  }, []);

  return null;
};

export default Component;
