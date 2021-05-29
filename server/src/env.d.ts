declare namespace NodeJS {
  interface ProcessEnv {
    ENV: string
    PROD_API_URL: string
    DATABASE_URL: string
    REDIS_URL: string
    REDIS_PORT: string
    REDIS_HOST: string
    PORT: string
    SESSION_SECRET: string
    CORS_ORIGIN: string
    FIREBASE_BUCKET_URL: string
  }
}
