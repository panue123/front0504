const Joi = require('joi');
const { MESSAGES } = require('../constants');

// Schema tạo đơn hàng
const createOrderSchema = Joi.object({
    shipping_address: Joi.string()
        .required()
        .messages({
            'string.empty': 'Địa chỉ giao hàng không được để trống!',
            'any.required': 'Địa chỉ giao hàng là bắt buộc!'
        }),
    phone: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .required()
        .messages({
            'string.empty': 'Số điện thoại không được để trống!',
            'string.pattern.base': 'Số điện thoại không hợp lệ!',
            'any.required': 'Số điện thoại là bắt buộc!'
        }),
    payment_method: Joi.string()
        .valid('cash', 'banking', 'momo')
        .required()
        .messages({
            'any.only': 'Phương thức thanh toán không hợp lệ!',
            'any.required': 'Phương thức thanh toán là bắt buộc!'
        }),
    notes: Joi.string()
        .messages({
            'string.empty': 'Ghi chú không được để trống!'
        })
});

// Schema cập nhật trạng thái đơn hàng
const updateOrderStatusSchema = Joi.object({
    status: Joi.string()
        .valid('pending', 'processing', 'shipped', 'delivered', 'cancelled')
        .required()
        .messages({
            'any.only': 'Trạng thái đơn hàng không hợp lệ!',
            'any.required': 'Trạng thái đơn hàng là bắt buộc!'
        })
});

// Schema cập nhật trạng thái thanh toán
const updatePaymentStatusSchema = Joi.object({
    payment_status: Joi.string()
        .valid('pending', 'paid', 'failed')
        .required()
        .messages({
            'any.only': 'Trạng thái thanh toán không hợp lệ!',
            'any.required': 'Trạng thái thanh toán là bắt buộc!'
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
    createOrderSchema,
    updateOrderStatusSchema,
    updatePaymentStatusSchema,
    validate
}; 