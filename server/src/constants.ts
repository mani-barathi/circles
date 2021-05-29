import dotenv from "dotenv"
dotenv.config()

export const UNIQUE_CONSTRAINT_ERROR_CODE = "23505"
export const FOREIGN_KEY_CONSTRAINT_ERROR_CODE = "23503"

export const COOKIE_NAME = "qwe"

export const PORT = parseInt(process.env.PORT)
export const PROD = process.env.ENV === "production"
export const PROD_API_URL = process.env.PROD_API_URL

export const FIREBASE_BUCKET_URL = process.env.FIREBASE_BUCKET_URL
export const IMAGES_FOLDER = "images"
