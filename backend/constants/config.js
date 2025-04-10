module.exports = {
    // Server configuration
    SERVER: {
        PORT: process.env.PORT || 5000,
        NODE_ENV: process.env.NODE_ENV || 'development',
        API_PREFIX: '/api',
        JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
        JWT_EXPIRES_IN: '24h'
    },

    // Database configuration
    DB: {
        HOST: process.env.DB_HOST || 'localhost',
        USER: process.env.DB_USER || 'root',
        PASS: process.env.DB_PASS || '',
        NAME: process.env.DB_NAME || 'shop_db',
        PORT: process.env.DB_PORT || 3306,
        DIALECT: 'mysql',
        LOGGING: process.env.NODE_ENV === 'development'
    },

    // Redis configuration
    REDIS: {
        HOST: process.env.REDIS_HOST || 'localhost',
        PORT: process.env.REDIS_PORT || 6379,
        PASSWORD: process.env.REDIS_PASSWORD,
        KEY_PREFIX: 'shop:',
        TTL: {
            CART: 24 * 60 * 60, // 24 hours
            PRODUCT: 60 * 60, // 1 hour
            CATEGORY: 60 * 60, // 1 hour
            USER: 30 * 60 // 30 minutes
        }
    },

    // Cloudinary configuration
    CLOUDINARY: {
        CLOUD_NAME: process.env.CLOUD_NAME,
        API_KEY: process.env.API_KEY,
        API_SECRET: process.env.API_SECRET,
        FOLDER: 'shop'
    },

    // Upload configuration
    UPLOAD: {
        MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
        ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
        TEMP_DIR: 'uploads/temp'
    },

    // Rate limiting configuration
    RATE_LIMIT: {
        WINDOW_MS: 15 * 60 * 1000, // 15 minutes
        MAX_REQUESTS: 100, // limit each IP to 100 requests per windowMs
        LOGIN: {
            WINDOW_MS: 60 * 60 * 1000, // 1 hour
            MAX_REQUESTS: 5 // limit each IP to 5 failed login attempts per hour
        }
    },

    // CORS configuration
    CORS: {
        ORIGIN: process.env.CORS_ORIGIN || '*',
        METHODS: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        ALLOWED_HEADERS: ['Content-Type', 'Authorization'],
        CREDENTIALS: true
    },

    // Logging configuration
    LOGGING: {
        LEVEL: process.env.LOG_LEVEL || 'info',
        FILE: {
            ERROR: 'logs/error.log',
            COMBINED: 'logs/combined.log',
            MAX_SIZE: 5242880, // 5MB
            MAX_FILES: 5
        }
    },

    // Pagination configuration
    PAGINATION: {
        DEFAULT_PAGE: 1,
        DEFAULT_LIMIT: 10,
        MAX_LIMIT: 100
    }
}; 