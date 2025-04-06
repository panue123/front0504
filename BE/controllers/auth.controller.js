const bcrypt = require('bcrypt');
const User = require('../model/User'); 
const { Op } = require('sequelize');

const register = async (req, res) => {
  const { username, fullname, email, phonenumber, password, password1 } = req.body; 

  if (!username || !fullname || !phonenumber || !password || !email || !password1) {
    return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin.' });
  }

  if (password !== password1) {
    return res.status(400).json({ message: 'Mật khẩu và mật khẩu xác nhận không khớp.' });
  }

  try {
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }, { phonenumber: phonenumber }],
      },
    });

    if (existingUser) {
      return res.status(409).json({ message: 'Username, email hoặc số điện thoại đã tồn tại.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      fullname,
      email,
      password: hashedPassword,
      phonenumber,
    });

    res.status(201).json({
      message: 'Đăng ký thành công!',
      user: {
        id: newUser.id,
        username: newUser.username,
        fullname: newUser.fullname,
        email: newUser.email,
        phonenumber: newUser.phonenumber,
      },
    });
  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    res.status(500).json({ message: 'Đã có lỗi xảy ra khi đăng ký.' });
  }
};

module.exports = {
  register,
};