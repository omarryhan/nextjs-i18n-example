import React from 'react';
import styles from './styles.css';
import SwitchButton, { AllTranslationsNeeded as SwitchButtonAllTranslationsNeeded } from '../SwitchButton';
import SwtichLink, { AllTranslationsNeeded as SwitchLinkAllTranslationsNeeded } from '../SwitchLink';
import { useI18n, Link } from '../../utils/i18n';
import { JsonMap } from '../../types/json';

const TranslationsNeeded = '/components/Header';

const Component: React.FC = () => {
  const {
    translations,
  } = useI18n(TranslationsNeeded);

  return (
    <header className={styles.header}>
      <nav>
        <Link href="">
          <a>
            {(translations.pages as JsonMap)['/']}
          </a>
        </Link>

        <Link href="/ssr">
          <a>
            {(translations.pages as JsonMap).ssr}
          </a>
        </Link>

        <Link href="/dynamic">
          <a>
            {(translations.pages as JsonMap).dynamic}
          </a>
        </Link>

        <SwitchButton />
        <SwtichLink />
      </nav>
    </header>
  );
};

export const AllTranslationsNeeded: string[] = [
  TranslationsNeeded,
  ...SwitchButtonAllTranslationsNeeded,
  ...SwitchLinkAllTranslationsNeeded,
];

export default Component;
