# Shop Backend

## Yêu cầu hệ thống
- Node.js (v14 trở lên)
- MySQL
- Tài khoản Cloudinary

## Cài đặt

1. Clone repository:
```bash
git clone <repository-url>
cd backend
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Tạo file .env:
```bash
cp .env.example .env
```

4. Cấu hình file .env:
- Điền thông tin database của bạn
- Điền thông tin Cloudinary của bạn
- Điều chỉnh PORT nếu cần

5. Tạo database:
```sql
mysql -u root -p < database.sql
```

6. Chạy server:
```bash
npm start
```

## Cấu trúc Database
- Bảng Product: Lưu thông tin sản phẩm
- Bảng Category: Lưu thông tin danh mục

## API Endpoints
- GET /api/products: Lấy danh sách sản phẩm
- POST /api/products: Thêm sản phẩm mới
- GET /api/products/:id: Lấy chi tiết sản phẩm
- PUT /api/products/:id: Cập nhật sản phẩm
- DELETE /api/products/:id: Xóa sản phẩm
- PUT /api/products/:id/restore: Khôi phục sản phẩm đã xóa

## Lưu ý
- Đảm bảo đã cài đặt và cấu hình MySQL
- Đảm bảo đã có tài khoản Cloudinary và cấu hình đúng thông tin
- Thư mục uploads/ sẽ được tạo tự động khi chạy server 