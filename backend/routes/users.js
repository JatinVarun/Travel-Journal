import express from 'express';
import { updateUserProfilePicture } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { uploadProfilePic } from '../middleware/upload.js';

const router = express.Router();

router.route('/profile/picture').put(protect, uploadProfilePic, updateUserProfilePicture);

export default router;