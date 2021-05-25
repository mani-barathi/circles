import path from "path"
import fs from "fs"
import { ReadStream } from "node:fs"
import crypto from "crypto"
import { PORT } from "../constants"

interface Image {
  filename: string
  imageUrl: string
}

export const saveToFs = async (
  filename: string,
  createReadStream: () => ReadStream
): Promise<Image> => {
  const randomName = createRandomName(filename)
  const imageUrl = `http://localhost:${PORT}/images/${randomName}`
  const pathName = path.join(__dirname, `../../public/images/${randomName}`)

  const stream = createReadStream()
  await stream.pipe(fs.createWriteStream(pathName))

  return { filename, imageUrl }
}

export const deleteFromFs = (imageUrl: string) => {
  const imageName = imageUrl.split("images/")[1]
  const pathName = path.join(__dirname, `../../public/images/${imageName}`)
  fs.unlinkSync(pathName)
}

export const createRandomName = (filename: string): string => {
  const randomString = crypto.randomBytes(12).toString("hex")
  const ext = path.extname(filename)
  const randomName = `img_${randomString}${ext}`
  return randomName
}
