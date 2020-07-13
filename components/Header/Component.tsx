import React from 'react';
import styles from './styles.css';
import SwitchButton from '../SwitchButton';
import SwtichLink from '../SwitchLink';
import { useI18n, Link } from '../../utils/i18n';
import { JsonMap } from '../../types/json';

const Component: React.FC = () => {
  const {
    translations,
  } = useI18n('components/Header');

  return (
    <div className={styles.header}>
      <Link href="">
        <a>
          {(translations.pages as JsonMap)['/']}
        </a>
      </Link>

      <Link href="/page-2">
        <a>
          {(translations.pages as JsonMap)['page-2']}
        </a>
      </Link>

      <Link href="/dynamic">
        <a>
          {(translations.pages as JsonMap).dynamic}
        </a>
      </Link>

      <SwitchButton />
      <SwtichLink />
    </div>
  );
};

export default Component;
