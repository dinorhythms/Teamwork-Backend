import multer from 'multer';

const storage = multer.diskStorage({
  filename(req, file, callback) {
    callback(null, file.originalname);
  }
});

const imageFilter = (req, file, cb) => {
  // accept image files only
  if (!file.originalname.match(/\.(gif)$/i)) {
    return cb(new Error('Only gif image files are allowed!'), false);
  }
  cb(null, true);
};

const multerUploads = multer({ storage, fileFilter: imageFilter }).single('image');

export default multerUploads;
