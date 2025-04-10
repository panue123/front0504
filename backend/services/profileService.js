const User = require('../models/User');
const bcrypt = require('bcrypt');

const updateProfile = async (userId, newData) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error('Người dùng không tồn tại');
  }

  user.fullname = newData.fullname || user.fullname;
  user.phone = newData.phone || user.phone;
  user.email = newData.email || user.email;



  await user.save();
  return user;
};

const getProfile = async (userId) => {
    const user = await User.findByPk(userId, {
      attributes: ['id', 'username', 'fullname', 'email', 'phone']
    });
    if (!user) {
      throw new Error('Người dùng không tồn tại');
    }
    return user;
  };
  
  module.exports = {
    updateProfile,
    getProfile
  };