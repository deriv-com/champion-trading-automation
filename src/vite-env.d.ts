/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_Auth_Url: string
  readonly VITE_Deriv_Url: string
  readonly VITE_OAUTH_APP_ID: string
  readonly VITE_OAUTH_URL: string
  readonly VITE_PLATFORM_NAME: string
  readonly VITE_BRAND_NAME: string
  readonly VITE_WS_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.svg' {
  const content: string
  export default content
}
