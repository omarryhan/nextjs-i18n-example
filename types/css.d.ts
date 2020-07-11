declare module '*.css' {
  interface Content {
    [className: string]: string;
  }

  const content: Content;
  export default content;
}
