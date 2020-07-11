export interface Language {
  name: string;
  prefix: string;
  direction?: string;
}

interface Config {
  [key:string]: Language
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

const defaultLanguage = allLanguages.ar;

export default {
  allLanguages,
  defaultLanguage,
};
