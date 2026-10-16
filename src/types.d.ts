declare module "*.woff2" {
  const url: string;
  export default url;
}

declare module "virtual:voiddeck-button-assets" {
  export const buttonGlyphs: Record<string, Record<string, string>>;
}
