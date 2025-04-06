const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');

// Cấu hình CORS
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400 // 24 giờ
};

// Cấu hình Helmet
const helmetOptions = {
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", 'data:', 'https:'],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
            sandbox: ['allow-forms', 'allow-scripts', 'allow-same-origin']
        }
    },
    crossOriginEmbedderPolicy: false
};

// Cấu hình HPP
const hppOptions = {
    whitelist: [
        'page',
        'limit',
        'sort',
        'fields'
    ]
};

// Middleware bảo mật
const securityMiddleware = [
    // Bảo vệ headers
    helmet(helmetOptions),
    
    // CORS
    cors(corsOptions),
    
    // Chống XSS
    xss(),
    
    // Chống NoSQL injection
    mongoSanitize(),
    
    // Chống Parameter Pollution
    hpp(hppOptions)
];

module.exports = securityMiddleware; 