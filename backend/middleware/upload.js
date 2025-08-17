import multer from 'multer';
import path from 'path';

// Storage engine for profile pictures
const profilePicStorage = multer.diskStorage({
  destination: './uploads/profile_pictures/',
  filename: function (req, file, cb) {
    cb(null, 'profile-' + req.user.id + path.extname(file.originalname));
  },
});

// Storage engine for entry images
const entryImageStorage = multer.diskStorage({
  destination: './uploads/entry_images/',
  filename: function (req, file, cb) {
    cb(null, 'entry-' + Date.now() + path.extname(file.originalname));
  },
});

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

// Init upload for profile picture (single file)
export const uploadProfilePic = multer({
  storage: profilePicStorage,
  limits: { fileSize: 1000000 }, // 1MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('profilePicture');


// Init upload for entry images (up to 3 files)
export const uploadEntryImages = multer({
  storage: entryImageStorage,
  limits: { fileSize: 5000000 }, // 5MB limit per file
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).array('images', 3);