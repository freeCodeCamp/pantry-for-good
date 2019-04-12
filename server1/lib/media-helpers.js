import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import multer from 'multer'
import {last} from 'lodash'

const mediaRoot = process.env.NODE_ENV === 'production' ? 'dist/client/media' : 'assets/media'

const getPath = filename => {
  return path.resolve(`${mediaRoot}/${filename}`)
}

const generateUniqueFilename = filename => {
  const ext = last(filename.split('.'))
  const raw = crypto.pseudoRandomBytes(16)
  return `${raw.toString('hex')}.${ext}`
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${mediaRoot}`)
  },
  filename: (req, file, cb) => {
    const filename = generateUniqueFilename(file.originalname)
    cb(null, filename)
  }
})

export const upload = multer({storage})

export const deleteFile = filename => {
  return fs.unlink(getPath(filename))
}

