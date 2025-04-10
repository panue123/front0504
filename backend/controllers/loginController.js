const loginService = require('../services/loginService');
const { validationResult } = require('express-validator');
const { ValidationError } = require('../utils/errors');

const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const result = await loginService.login(username, password);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

module.exports = { login };
