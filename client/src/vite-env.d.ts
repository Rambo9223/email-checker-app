/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Tells TypeScript that any .eml file imported with ?raw is a plain string
declare module "*.eml?raw" {
  const content: string;
  export default content;
}