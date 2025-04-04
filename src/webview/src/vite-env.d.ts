/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_RUN_MOCKS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
