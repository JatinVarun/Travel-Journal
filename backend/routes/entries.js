import express from 'express';
import {
  createEntry,
  getAllEntries,
  getLikedEntries,
  getEntryById,
  deleteEntry,
  toggleLikeEntry,
} from '../controllers/entryController.js';
import { protect } from '../middleware/auth.js';
import { uploadEntryImages } from '../middleware/upload.js';

const router = express.Router();

// Anyone can GET all entries. Only logged-in users can POST a new one.
router.route('/')
  .get(getAllEntries) // PUBLIC
  .post(protect, uploadEntryImages, createEntry); // PRIVATE

// These actions are specific to a logged-in user
router.route('/liked').get(protect, getLikedEntries);
router.route('/:id/like').put(protect, toggleLikeEntry);

// Anyone can GET a single entry. Only the author can DELETE it.
router.route('/:id')
  .get(getEntryById) // PUBLIC
  .delete(protect, deleteEntry); // PRIVATE

export default router;