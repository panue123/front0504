const { checkSchema } = require('express-validator');

const logoutValidation = checkSchema({
    // Không có field nào cần validate cho logout
});

module.exports = logoutValidation;
