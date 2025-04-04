/// <reference types="vite/client" />
/// <reference types="vite/types/importMeta.d.ts" />

interface ImportMetaEnv {
    readonly VITE_BASE_URL: string; // Add more environment variables here if needed
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}