import User from '../models/User.js';

// @desc    Update user profile picture
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // The upload middleware puts the file path in req.file.path
      // The path from multer includes 'uploads/', which we need to make a server path
      user.profilePicture = `/${req.file.path.replace(/\\/g, "/")}`;
      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        profilePicture: updatedUser.profilePicture,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Image upload failed', error: error.message });
  }
};