# Next.JS i18n Example

## Demo

[https://nextjs-i18n-example.vercel.app](https://nextjs-i18n-example.vercel.app)

## Features

- In the spirit of React, instead of declaring all translations in a global `locales` folder, each component and page has its own set of translations. Each translation dir is placed under: `/public/translations/` by default. That way, translations for `components/Title` component, are found under: `/public/translations/components/Title`, and for `components/Nested/NestedComponent` are found under `/public/translations/Nested/NestedComponent` and `pages/[language]/ssr` are found under `public/translations/pages/[language]/ssr`.

- SEO as a top priority

  - Adds hreflang tags for you
  - Sets HTML lang attribute for you on both the server and client.

- Doesn't block Next.js Automatic Static Optimizations.

- RTL and custom direction

- Works with next export. (You'll only have to remove the `getServerSideProps` function in `pages/index.js` and rely only on the client side redirect or create one yourself on your HTTP server)

- Support for both: server loaded translations and dynamic translations

- Dynamic translations are cahched using a stale while revlidate cache strategy (using Vercel's [SWR lib](https://github.com/vercel/swr)), so that only the first load will result in a delay.

- Automatic language detection

- Save user's preferred language in a cookie on every language transition.

- No heavy I18n lib dependency e.g. i18next.

## Don't use if you

- Don't want to maintain the all the i18n logic yourself.

- Don't want to write a fair amount of boilerplate

- Don't want to use HTTP subdirectory based i18n. e.g. `https://example.com/en/about`, and want to use a subdomain or TLD based i18n strategy instead.

## Files

### 0. `i18n.config.ts`

Example config:

```TS
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

const defaultLanguage: Language = allLanguages.en;

// used for setting the `hreflang` alternate tag.
// Read the withI18n section for more info.
const domains: Domains = {
  development: 'http://localhost:3000',
  production: 'https://next-i18n-dynamic.netlify.app',
};

export default {
  allLanguages,
  defaultLanguage,
  domains
}
```

### 1. `pages/_document.tsx`

Is only there to add the `lang` property in the `html` tag. Note: due to a limitation of Next.JS, the `_document` page won't change the lang property after client side language transitions because the `_document` page is only rendered on the server. For client side html lang transitions, check: `changeDocumentLanguage` and how it's used in `_app.tsx`.

### 2. `pages/_app.tsx`

Is there to:

1. add a `div` with a `dir` property. e.g. `rtl` and `ltr`. You should define the direction of the languages you specify in `i18n.config.ts`.

2. Set the preferred-language cookie with the language found in context (Defaults to a 3 year cookie).

3. Makes sure the `<html>` lang property is changed if the language changes.

### 3. `utils/i18n.tsx`

**Has:**

#### `getI18nStaticPaths`

Enumerates `getStaticPaths` with all the lanugage prefixes that you define in your config.

#### `getI18nProps`

Should be used for: `getStaticProps` and `getServerSideProps`.

A simple function that given the language param code generated by: `getI18nStaticPaths` and the paths of the translation files needed (optional), loads:

- The language prefix. Returns the default language if no language prefix was given (Shouldn't normally happen).

- The translation namespaces specified, from `public/translations` into memory. (You can change the directory by passing a custom `translationsDir`)

There are two main ways you can load translations:

1. Specify the paths you want to load like in: `pages/dynamic.tsx` and `pages/ssr.tsx` by passing an array of strings as the `paths` parameter (More performant, but a bit annoying)

2. Pass Node's fs module to `getI18nProps` for it to use to recurse over all the translations in the `tranlationsDir` you specify. (Less performant, but way less annoying). The reason we're doing a dependency injection here, is because `getI18nProps` is the only place you can import node modules as opposed to browser supported modules. `utils/i18n.ts` will be shipped to the browser, while `getStaticProps` and `getServerSideProps` are guaranteed to not ship to the browser.

Personally, I find that the convenience of method no.2 overweighs the performance gains from method no.1 when starting. But as your project gets bigger, you'll eventually need to specify which translation files being load. I recommend starting with method no.2. If after a while, using method 2 starts to seriously degrade your app's performance and load times, switch to method no.1, easy peasy.

The two main ineffeciencies caused by passing node's fs module (i.e. loading **all** the translations, instead of only the ones your page is going to use):

- Needlessly bigger bundle size **&** bigger size of XHR payloads from calling `getServerSideProps` and `getStaticProps` when doing page transitions on the client. At first, I thought that `getStaticProps` is never called from the browser. But turns out, it gets called just like `getServerSideProps`. The only difference is, `getServerSideProps` runs a function on every call, while `getStaticProps`, returns a static response that is guaranteed to stay the same. That means that, it's only ever called once on each browsing session.

- Response latency because of the IO time needed to load all the translations. I'm going to take a wild guess, and say that this latency is probably negligible. Especially if you're hosting with a hosting provider that uses SSD (most popular ones do). It can be useful to cache the loaded translations in memory though.

#### `withI18n`

Should wrap all the pages that use the `getI18nProps` method.

It accepts the props passed by `getI18nProps` and sets them in the `i18nContext` so that all your components can access them using the `useI18n` hook.

This HOC also adds an `hreflang` alternate tag given the page route, e.g.

If you pass the page: `pages/ssr.tsx` to the `withI18n` HOC like this:

```TS
export default withI18n(Page, '/ssr');
```

It will add the following links to your header.

```jsx
  <Head>
    <link
      rel="alternate"
      href={`http://localhost:3000/en${pathname}`}  // pathname is '/ssr' in that case
      hrefLang="en"
    />

    <link
      rel="alternate"
      href={`http://localhost:3000/ar${pathname}`}  // pathname is '/ssr' in that case
      hrefLang="ar"
    />
  </Head>
```

This tag is used to tell search engines which pages are translations of which pages. This is needed because Google claims that the Google crawler doesn't understand path-directories/sub-domains in regards to how they relate to a page's language. (Anyway, stop lying to us Google. We all know that your bots have super intellegence and will be ruling us in a matter of years).

#### `useI18n`

A hook that given a translation path, returns the translations JSON needed along with:

- the current language prefix
- the current language configs

#### `useDynamicI18n`

Asynchronously loads the translations by doing an ajax call. Check: ***components/DynamicTranslations*** for an example.

#### `withPrefetchDynamicTranslations`

To be used with `useDynamicI18n`

A HOC to wrap components that use the `useDynamicI18n` hook. It adds a prefetch header so that the user doesn't have to wait for the component to mount in order to download the translations. This however doesn't entirely solve the latency issue because your page won't show the translations until the components actually mount. That's because SWR can only access the prefetched version when the component mounts and the all the JS has been loaded. This can be useful for large translations and large XHR requests in general. But given the atomicity of the translations in this example, it probably won't make much difference in the latency anyway, because the major latency bottleneck is React, not the translations. **NOTE:** link prefetch is neither supported on Safari nor Safari IOS.

#### `Link`

Wraps `next/link` and accepts these extra props:

- language: string of which language you want to redirect to.
- href is optional. If you only pass a language without an href, this link will only switch to the language you chose.

#### `changeDocumentLanguage`

Given a language prefix on the browser, sets it to `<html>`'s lang attribute.

I can't find a scenario where you'll need to manually call this, because our custom `_app.tsx` already sets the HTML lang for you on every page transition, and our custom `_document.tsx` automatically sets it on every prerender.

#### `setI18nCookie`

Sets a cookie with a name of: `preferred-language` to your cookies. Only works in the browser. See `pages/[language]/index.tsx::{ getServerSideProps }` to see how this cookie is loaded on the server.

#### `getI18nAgnosticPathname`

Strips the language directory prefix from `window.location.pathname` or any pathname you pass it and returns it. You can skip passing a pathname on the browser.

#### `getLanguageFromURL`

Opposite of `changeDocumentLanguage`. Strips the language prefix from `window.location.pathname` or any pathname you pass it and returns it. You can skip passing a pathname on the browser.

## Pain points

1. It's quite cumbersome to list the names of the translations needed for each page. Since all pages already knows which components they will mount, we should expect them to know which translations to load without needing to specify them. A workaround is passing Node's fs module, to load all the translations, but this can be a bit inefficient for `getServerSideProps`.

2. Redirecting from '/' to '/ar' or '/en' is easy. But what if the user goes to '/ssr' and not '/[language]/ssr'. It should redirect to `/[language]/ssr` and not return a 404.

3. If we solve point #2, we can automatically detect the user's preferred language on the browser using the browser's `navigator.languages`. If you want a full static website, you can use this `navigator.languages` API in the `pages/index.tsx` page instead of the language detection logic in `pages/index.tsx::getServerSideProps`.

## Misc. notes

- At first, I tried to store all the translations, in the directory of their respective component, instead of the current approach (which is having an identical component and pages tree in the `/public` directory). I was also dynamically importing all translations. I switched to the current approach because:

  - **Dynamically** importing JSON files as opposed to fetching them via XHR returned a webpack JS module instead of a simple JSON file. This means more payload size. :thumbs-down:. I'm not sure why this was happening, is it a Typescript thing? No clue.

  - I found it hard to dynamically (on the browser) import JSON files using a helper that's located in another directory. e.g. with the `useDynamicI18n` hook, I tried passing it the `__dirname` of the component from the component, but apparantly this feature [isn't](https://nextjs.org/docs/basic-features/data-fetching#reading-files-use-processcwd) [yet](https://github.com/vercel/next.js/issues/8251) [supported](https://github.com/vercel/next.js/issues/10943) by Next.JS. AFAIR, `__dirname` always returned an empty string. Tl;Dr I can't think of a way to dynamically import translations found in the folder of the component. from a helper module, e.g. `utils/i18n.ts`.

  - I was thinking of returning the translations back in the folder of their respective component. That way when you refactor your components (Move the components around your components dir), you won't have to sync the translations tree as well. However, one downside is that you'll have to rename all the refactored components. On the other hand, you'll have to rename all the inputs to the `useI18n` hook. Also, where do we keep the translations of /pages?

- Use next@^9.4.5-canary.32 if you want don't want trailing slashes to throw errors. If you want to redirect all routes to have a trailing slash by default, in `next.config.js`, add:

```js
  experimental: {
    trailingSlash: true
  }
```

This example doesn't use it, but I tested it once and it works fine.

## SEO resources

- https://support.google.com/webmasters/answer/182192?hl=en
- https://support.google.com/webmasters/answer/189077

## This example builds heavily on the work done by

- Vinissimus in [next-translate](https://github.com/vinissimus/next-translate)
- Janus Reith in [i18n example](https://codesandbox.io/s/nextjs-i18n-staticprops-new-ouyrb)
- Filip Wojciechowski in [simple-i18n-example](https://github.com/fwojciec/simple-i18n-example)