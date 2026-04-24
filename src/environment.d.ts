declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PAYLOAD_SECRET: string
      DATABASE_URL: string
      NEXT_PUBLIC_SERVER_URL: string
      VERCEL_PROJECT_PRODUCTION_URL: string
      CRON_SECRET: string
      PREVIEW_SECRET: string
      // Telegram notifications
      TELEGRAM_BOT_TOKEN?: string
      TELEGRAM_CHAT_ID?: string
      // CRM integration (set when credentials are available)
      CRM_API_URL?: string
      CRM_API_KEY?: string
    }
  }
}

export {}
