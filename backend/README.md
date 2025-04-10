# Backend API

## Cấu trúc thư mục

```
backend/
├── config/             # Cấu hình (database, redis, cloudinary)
├── constants/          # Các hằng số
├── controllers/        # Xử lý logic
├── middlewares/       # Middleware (auth, validation, error handling)
├── models/           # Database models
├── routes/           # API routes
├── services/         # Business logic
├── utils/            # Utility functions
├── validations/      # Validation schemas
├── uploads/          # Uploaded files
├── .env              # Environment variables
├── .env.example      # Example environment variables
├── .gitignore        # Git ignore file
├── package.json      # Dependencies
└── server.js         # Entry point
```

## Cài đặt

1. Clone repository
2. Cài đặt dependencies:
```bash
npm install
```

3. Tạo file .env từ .env.example và cập nhật các biến môi trường:
```bash
cp .env.example .env
```

4. Chạy database migrations:
```bash
npm run migrate
```

5. Chạy database seeds (tùy chọn):
```bash
npm run seed
```

6. Chạy server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Documentation

### Authentication
- POST /api/auth/register - Đăng ký
- POST /api/auth/login - Đăng nhập
- GET /api/auth/me - Lấy thông tin user

### Products
- GET /api/products - Lấy danh sách sản phẩm
- GET /api/products/:id - Lấy chi tiết sản phẩm
- POST /api/products - Thêm sản phẩm (Admin)
- PUT /api/products/:id - Cập nhật sản phẩm (Admin)
- DELETE /api/products/:id - Xóa sản phẩm (Admin)

### Categories
- GET /api/categories - Lấy danh sách danh mục
- GET /api/categories/:id - Lấy chi tiết danh mục
- POST /api/categories - Thêm danh mục (Admin)
- PUT /api/categories/:id - Cập nhật danh mục (Admin)
- DELETE /api/categories/:id - Xóa danh mục (Admin)

### Cart
- GET /api/cart - Lấy giỏ hàng
- POST /api/cart/add - Thêm sản phẩm vào giỏ hàng
- PUT /api/cart/update - Cập nhật số lượng
- DELETE /api/cart/remove/:productId - Xóa sản phẩm khỏi giỏ hàng
- DELETE /api/cart/clear - Xóa toàn bộ giỏ hàng

### Orders
- GET /api/orders - Lấy danh sách đơn hàng
- GET /api/orders/:id - Lấy chi tiết đơn hàng
- POST /api/orders - Tạo đơn hàng mới
- PUT /api/orders/:id/status - Cập nhật trạng thái đơn hàng (Admin)

### Upload
- POST /api/upload - Upload file

## Testing

```bash
# Run all tests
npm test

# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Run API tests
npm run test:api
```

## Development

```bash
# Run linter
npm run lint

# Run linter with fix
npm run lint:fix

# Run type checking
npm run type-check
```

## Production

```bash
# Build
npm run build

# Start production server
npm start
```

## Error Handling

API sử dụng các mã lỗi HTTP chuẩn:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Security

- JWT Authentication
- Rate Limiting
- CORS
- XSS Protection
- SQL Injection Protection
- Request Validation
- File Upload Validation

## Logging

- Request/Response logging
- Error logging
- Access logging
- Performance logging

## Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request 