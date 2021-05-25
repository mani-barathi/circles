import admin from "firebase-admin"
import crypto from "crypto"
import { ReadStream } from "node:fs"
import { FIREBASE_BUCKET_URL, IMAGES_FOLDER } from "../constants"
import serviceAccount from "../firebase-admin-credentials.json"
import { createRandomName } from "./fsOperations"

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  storageBucket: FIREBASE_BUCKET_URL,
})

export const bucket = admin.storage().bucket()

/*  uploading reference: https://stackoverflow.com/questions/36661795/how-to-upload-an-image-to-google-cloud-storage-from-an-image-url-in-node
 *  deleting reference : https://github.com/googleapis/nodejs-storage/blob/master/samples/deleteFile.js
 */

export const uploadToFirebaseStorage = (
  createReadStream: () => ReadStream,
  filename: string,
  mimetype: string
): string | Promise<string> => {
  return new Promise((resolve, reject) => {
    const imageName = createRandomName(filename)
    const imagePath = `${IMAGES_FOLDER}/${imageName}`
    const fullPathUrlEncoded = `${IMAGES_FOLDER}%2F${imageName}`
    const accessToken = crypto.randomBytes(12).toString("hex")

    const upload = bucket.file(imagePath)
    createReadStream()
      .pipe(
        upload.createWriteStream({
          contentType: mimetype,
          public: false,
          metadata: {
            contentType: mimetype,
            metadata: {
              firebaseStorageDownloadTokens: accessToken, // define access token
            },
          },
        })
      )
      .on("finish", () => {
        // const url = `https://storage.googleapis.com/${bucket.name}/images/${imageName}` // only for public
        const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${fullPathUrlEncoded}?alt=media&token=${accessToken}`
        resolve(url)
      })
      .on("error", (error) => {
        console.log("upload error:", error)
        reject(new Error("something went wrong! unable to upload image"))
      })
  })
}

export const deleteFromFirebaseStroage = async (imageUrl: string) => {
  const imageName = imageUrl.split(`${IMAGES_FOLDER}%2F`)[1].split("?")[0]
  const imagePath = `${IMAGES_FOLDER}/${imageName}`
  await bucket.file(imagePath).delete()
}
