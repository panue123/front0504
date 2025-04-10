const profileService = require('../services/profileService');

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullname, email, phone} = req.body;

    const updatedUser = await profileService.updateProfile(userId, {
      fullname,
      email,
      phone,
    });

    res.status(200).json({
      message: 'Cập nhật thành công',
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        fullname: updatedUser.fullname,
        email: updatedUser.email,
        phone: updatedUser.phone,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getProfile = async (req, res) => {
    try {
      const userId = req.user.id;
  
      const user = await profileService.getProfile(userId);
  
      res.status(200).json({
        id: user.id,
        username: user.username,
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  module.exports = {
    updateProfile,
    getProfile
  };