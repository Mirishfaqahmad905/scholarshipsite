import multer from 'multer';

// Memory storage configuration so uploads work seamlessly on Vercel/serverless
const storage = multer.memoryStorage();

// File filter check for images only
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp|gif|svg/;
  const mimetype = filetypes.test(file.mimetype) || file.mimetype.includes('image');

  if (mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, jpeg, png, webp, gif, svg) are allowed!'));
  }
}

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB
  fileFilter(req, file, cb) {
    checkFileType(file, cb);
  },
});

export default upload;
