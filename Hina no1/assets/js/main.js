import { updateLoginStatus, initializeAuthListeners } from './m/auth.js';
import { loadFeaturedProducts, loadCategoriesToNavbar, initializeProductListeners } from './assets/index';
import { initCarousel }  from './assets/index';

document.addEventListener('DOMContentLoaded', () => {
    // Khởi tạo các event listeners
    initializeAuthListeners();
    initializeProductListeners();
    initializeUIListeners();

    // Cập nhật UI dựa trên trạng thái đăng nhập (nếu có)
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    updateLoginStatus(token, user);

    // Khởi tạo carousel
    initCarousel();

    // Tải dữ liệu
    // loadFeaturedCategories();      // Dùng ở phần sản phẩm nổi bật
    loadCategoriesToNavbar();      // Dùng để hiển thị danh mục trong navbar
    loadFeaturedProducts();
});
