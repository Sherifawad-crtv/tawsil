/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

declare module "figma:asset/*" {
  const src: string;
  export default src;
}
