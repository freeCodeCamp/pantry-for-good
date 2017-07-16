import * as fs from 'fs';
import * as path from 'path';
import {last} from 'lodash';
import multer from 'multer';

const mediaRoot = process.env.NODE_ENV === 'production' ? 'dist/client/media' : 'assets/media';

const getPath = (filename) => {
    return path.resolve(`${mediaRoot}/${filename}`);
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${mediaRoot}`)
    },
    filename: function (req, file, cb) {
        const ext = last(file.originalname.split('.'));
        cb(null, `${file.fieldname}.${ext}`)
    }
});

export const upload = multer({storage});

export const deleteFile = (filename) => {
    return fs.unlink(getPath(filename));
};

