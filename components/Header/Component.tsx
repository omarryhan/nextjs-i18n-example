import React from 'react';
import styles from './styles.css';
import SwitchButton from '../SwitchButton';
import SwtichLink from '../SwitchLink';
import { useI18n, Link } from '../../utils/i18n';
import { JsonMap } from '../../types/json';

const Component: React.FC = () => {
  const {
    translations,
  } = useI18n('/components/Header');

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

export default Component;
