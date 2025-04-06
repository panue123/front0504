const Joi = require('joi');
const { MESSAGES } = require('../constants');

// Schema tạo danh mục
const createCategorySchema = Joi.object({
    name: Joi.string()
        .required()
        .messages({
            'string.empty': 'Tên danh mục không được để trống!',
            'any.required': 'Tên danh mục là bắt buộc!'
        }),
    description: Joi.string()
        .messages({
            'string.empty': 'Mô tả danh mục không được để trống!'
        })
});

// Schema cập nhật danh mục
const updateCategorySchema = Joi.object({
    name: Joi.string()
        .messages({
            'string.empty': 'Tên danh mục không được để trống!'
        }),
    description: Joi.string()
        .messages({
            'string.empty': 'Mô tả danh mục không được để trống!'
        })
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
    createCategorySchema,
    updateCategorySchema,
    validate
}; 