const Joi = require('joi');
const { MESSAGES } = require('../constants');

// Schema cập nhật profile
const updateProfileSchema = Joi.object({
    fullname: Joi.string()
        .required()
        .messages({
            'string.empty': 'Họ tên không được để trống!',
            'any.required': 'Họ tên là bắt buộc!'
        }),
    phone: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .messages({
            'string.pattern.base': 'Số điện thoại không hợp lệ!'
        }),
    address: Joi.string(),
    birth_date: Joi.date()
        .max('now')
        .messages({
            'date.max': 'Ngày sinh không hợp lệ!'
        })
});

// Schema tạo user (admin)
const createUserSchema = Joi.object({
    username: Joi.string()
        .min(3)
        .max(30)
        .required()
        .messages({
            'string.empty': 'Tên đăng nhập không được để trống!',
            'string.min': 'Tên đăng nhập phải có ít nhất 3 ký tự!',
            'string.max': 'Tên đăng nhập không được vượt quá 30 ký tự!',
            'any.required': 'Tên đăng nhập là bắt buộc!'
        }),
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.empty': 'Email không được để trống!',
            'string.email': 'Email không hợp lệ!',
            'any.required': 'Email là bắt buộc!'
        }),
    password: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.empty': 'Mật khẩu không được để trống!',
            'string.min': 'Mật khẩu phải có ít nhất 6 ký tự!',
            'any.required': 'Mật khẩu là bắt buộc!'
        }),
    fullname: Joi.string()
        .required()
        .messages({
            'string.empty': 'Họ tên không được để trống!',
            'any.required': 'Họ tên là bắt buộc!'
        }),
    phone: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .messages({
            'string.pattern.base': 'Số điện thoại không hợp lệ!'
        }),
    address: Joi.string(),
    birth_date: Joi.date()
        .max('now')
        .messages({
            'date.max': 'Ngày sinh không hợp lệ!'
        }),
    role: Joi.string()
        .valid('user', 'admin')
        .default('user')
        .messages({
            'any.only': 'Vai trò không hợp lệ!'
        })
});

// Schema cập nhật user (admin)
const updateUserSchema = Joi.object({
    fullname: Joi.string()
        .required()
        .messages({
            'string.empty': 'Họ tên không được để trống!',
            'any.required': 'Họ tên là bắt buộc!'
        }),
    email: Joi.string()
        .email()
        .messages({
            'string.email': 'Email không hợp lệ!'
        }),
    phone: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .messages({
            'string.pattern.base': 'Số điện thoại không hợp lệ!'
        }),
    address: Joi.string(),
    birth_date: Joi.date()
        .max('now')
        .messages({
            'date.max': 'Ngày sinh không hợp lệ!'
        }),
    role: Joi.string()
        .valid('user', 'admin')
        .messages({
            'any.only': 'Vai trò không hợp lệ!'
        }),
    is_active: Joi.boolean()
});

// Middleware validate
const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            message: MESSAGES.VALIDATION_ERROR,
            errors: error.details.map(detail => ({
                field: detail.path[0],
                message: detail.message
            }))
        });
    }
    next();
};

module.exports = {
    updateProfileSchema,
    createUserSchema,
    updateUserSchema,
    validate
}; 