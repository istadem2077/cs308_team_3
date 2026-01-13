// Custom env typings so TypeScript knows about import.meta.env
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}


