import multer from 'multer'
import path from 'path'

export default multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
      cb(new Error('Unsupported file type!'), false)
      return
    }
    cb(null, true)
  }
})
