import React from 'react';
import { useI18n } from '../../utils/i18n';

const Component: React.FC = () => {
  const { translations } = useI18n('/components/RosettaImage');
  return (
    <img src="/rosetta.png" alt={translations.alt as string} title={translations.title as string} style={{ width: '300px' }} />
  );
};

export default Component;
