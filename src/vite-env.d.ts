/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />
/// <reference types="unplugin-icons/types/react" />

declare module "figma:asset/*" {
  const src: string;
  export default src;
}
