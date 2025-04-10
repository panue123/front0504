const { body, validationResult } = require('express-validator');

const validateProfile = [
  body('fullname')
    .notEmpty().withMessage('Họ và tên không được để trống')
    .isLength({ min: 4 }).withMessage('Họ và tên quá ngắn'),

  body('email')
    .notEmpty().withMessage('Email không được để trống')
    .isEmail().withMessage('Email không hợp lệ'),

  body('phone')
    .notEmpty().withMessage('Số điện thoại không được để trống')
    .matches(/^(0|\+84)[0-9]{9}$/).withMessage('Số điện thoại không hợp lệ'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = validateProfile;
