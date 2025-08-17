import Entry from '../models/Entry.js';

export const createEntry = async (req, res) => {
  const { title, location, date, description } = req.body;
  if (!title || !location || !date || !description) {
    return res.status(400).json({ message: 'Please fill all required fields' });
  }
  try {
    const images = req.files ? req.files.map(file => `/${file.path.replace(/\\/g, "/")}`) : [];
    const entry = new Entry({ user: req.user._id, title, location, date, description, images });
    const createdEntry = await entry.save();
    res.status(201).json(createdEntry);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const getAllEntries = async (req, res) => {
  try {
    const entries = await Entry.find({}).sort({ createdAt: -1 }).populate('user', 'name');
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getLikedEntries = async (req, res) => {
  try {
    const entries = await Entry.find({ likes: req.user._id }).sort({ createdAt: -1 }).populate('user', 'name');
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getEntryById = async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id).populate('user', 'name');
    if (entry) {
      res.json(entry);
    } else {
      res.status(404).json({ message: 'Entry not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const toggleLikeEntry = async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Entry not found' });

    const isLiked = entry.likes.some(like => like.equals(req.user._id));
    if (isLiked) {
      entry.likes = entry.likes.filter(like => !like.equals(req.user._id));
    } else {
      entry.likes.push(req.user._id);
    }
    await entry.save();
    const populatedEntry = await Entry.findById(entry._id).populate('user', 'name');
    res.json(populatedEntry);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const deleteEntry = async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id);
    if (entry) {
      if (entry.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }
      await Entry.deleteOne({ _id: req.params.id });
      res.json({ message: 'Entry removed' });
    } else {
      res.status(404).json({ message: 'Entry not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};