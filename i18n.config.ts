export interface Language {
  name: string;
  prefix: string;
  direction?: string;
}

interface Config {
  [key:string]: Language
}

interface Domains {
  development: string;
  production: string;
}

const allLanguages: Config = {
  en: {
    name: 'English',
    prefix: 'en',
  },
  ar: {
    name: 'العربية',
    prefix: 'ar',
    direction: 'rtl',
  },
};

const defaultLanguage: Language = allLanguages.ar;

const domains: Domains = {
  development: 'http://localhost:3000',
  production: 'https://next-i18n-dynamic.netlify.app',
};

export default {
  allLanguages,
  defaultLanguage,
  domains,
};
