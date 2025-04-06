import { updateLoginStatus, initializeAuthListeners } from './modules/auth.js';
import { loadFeaturedCategories, loadFeaturedProducts, initializeProductListeners } from './modules/product.js';
import { initCarousel, initializeUIListeners } from './modules/ui.js';

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
    loadFeaturedCategories();
    loadFeaturedProducts();
});