const Joi = require('joi');

const productValidation = {
    create: Joi.object({
        name: Joi.string().required().messages({
            'string.empty': 'Tên sản phẩm không được để trống!',
            'any.required': 'Tên sản phẩm là bắt buộc!'
        }),
        description: Joi.string().required().messages({
            'string.empty': 'Mô tả không được để trống!',
            'any.required': 'Mô tả là bắt buộc!'
        }),
        price: Joi.number().min(0).required().messages({
            'number.base': 'Giá phải là số!',
            'number.min': 'Giá không được âm!',
            'any.required': 'Giá là bắt buộc!'
        }),
        pricediscount: Joi.number().min(0).messages({
            'number.base': 'Giá khuyến mãi phải là số!',
            'number.min': 'Giá khuyến mãi không được âm!'
        }),
        stock: Joi.number().integer().min(0).required().messages({
            'number.base': 'Số lượng phải là số!',
            'number.integer': 'Số lượng phải là số nguyên!',
            'number.min': 'Số lượng không được âm!',
            'any.required': 'Số lượng là bắt buộc!'
        }),
        categoryId: Joi.number().integer().required().messages({
            'number.base': 'ID danh mục phải là số!',
            'number.integer': 'ID danh mục phải là số nguyên!',
            'any.required': 'ID danh mục là bắt buộc!'
        })
    }),

    update: Joi.object({
        name: Joi.string().messages({
            'string.empty': 'Tên sản phẩm không được để trống!'
        }),
        description: Joi.string().messages({
            'string.empty': 'Mô tả không được để trống!'
        }),
        price: Joi.number().min(0).messages({
            'number.base': 'Giá phải là số!',
            'number.min': 'Giá không được âm!'
        }),
        pricediscount: Joi.number().min(0).messages({
            'number.base': 'Giá khuyến mãi phải là số!',
            'number.min': 'Giá khuyến mãi không được âm!'
        }),
        stock: Joi.number().integer().min(0).messages({
            'number.base': 'Số lượng phải là số!',
            'number.integer': 'Số lượng phải là số nguyên!',
            'number.min': 'Số lượng không được âm!'
        }),
        categoryId: Joi.number().integer().messages({
            'number.base': 'ID danh mục phải là số!',
            'number.integer': 'ID danh mục phải là số nguyên!'
        })
    })
};

module.exports = productValidation; 