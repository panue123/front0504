const API_URL = 'http://localhost:5000/api';
const TOKEN_KEY = 'token';
const USER_KEY = 'user';

// Kiểm tra role người dùng
function checkRole() {
    const user = JSON.parse(localStorage.getItem(USER_KEY));
    return user ? user.role : null;
}

// Yêu cầu quyền admin
function requireAdmin() {
    const role = checkRole();
    if (role !== 'admin') {
        showMessage('Bạn không có quyền truy cập trang này', 'error');
        window.location.href = '/index.html';
        return false;
    }
    return true;
}

// Kiểm tra trạng thái đăng nhập
function checkLogin() {
    const token = localStorage.getItem('token');
    return !!token;
}

// Lưu thông tin đăng nhập
function saveLogin(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
}

// Đăng nhập
async function login(email, password) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            throw new Error('Đăng nhập thất bại');
        }

        const data = await response.json();
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));

        showMessage('Đăng nhập thành công', 'success');

        // Chuyển hướng dựa vào role
        if (data.user.role === 'admin') {
            window.location.href = '/admin/dashboard.html';
        } else {
            // Nếu có URL trước đó, quay lại trang đó
            const previousUrl = localStorage.getItem('previousUrl');
            if (previousUrl) {
                localStorage.removeItem('previousUrl');
                window.location.href = previousUrl;
            } else {
                window.location.href = '/index.html';
            }
        }

        updateUserInterface();
    } catch (error) {
        showMessage(error.message, 'error');
        throw error;
    }
}

// Đăng ký
async function register(userData) {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error('Đăng ký thất bại');
        }

        showMessage('Đăng ký thành công', 'success');
        window.location.href = '/login.html';
    } catch (error) {
        showMessage(error.message, 'error');
        throw error;
    }
}

// Đăng xuất
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';

    updateUserInterface();
}

// Lấy token
function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

// Lấy thông tin user
function getCurrentUser() {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
}

// Cập nhật thông tin user trong localStorage
function updateCurrentUser(userData) {
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
}

// Kiểm tra trạng thái đăng nhập
function checkAuth() {
    const token = localStorage.getItem('token');
    const currentPage = window.location.pathname.split('/').pop();

    // Danh sách các trang không yêu cầu đăng nhập
    const publicPages = ['index.html', 'login.html', 'register.html', 'forgot-password.html', 'products.html', 'product-detail.html', 'about.html', 'news.html'];
    
    // Nếu đang ở trang public, cho phép truy cập
    if (publicPages.includes(currentPage)) {
        return true;
    }

    // Nếu không có token và đang ở trang yêu cầu đăng nhập
    if (!token) {
        window.location.href = 'login.html';
        return false;
    }

    // Nếu có token và đang ở trang login
    if (token && currentPage === 'login.html') {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user.role === 'admin') {
            window.location.href = 'statistic.html';
        } else {
            window.location.href = 'index.html';
        }
        return false;
    }

    return true;
}

// Xử lý đăng xuất
function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// Hàm xử lý đăng nhập
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorElement = document.getElementById('loginError');

    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Lưu token vào localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Chuyển hướng dựa vào role
            if (data.user.role === 'admin') {
                window.location.href = 'statistic.html';
            } else {
                window.location.href = 'index.html';
            }
        } else {
            // Hiển thị lỗi
            errorElement.textContent = data.message || 'Đăng nhập thất bại';
            errorElement.style.display = 'block';
        }
    } catch (error) {
        errorElement.textContent = 'Có lỗi xảy ra, vui lòng thử lại sau';
        errorElement.style.display = 'block';
        console.error('Login error:', error);
    }
}

// Hàm xử lý đăng ký
async function handleRegister(e) {
    e.preventDefault();
    
    const email = document.getElementById('registerEmail').value;
    const fullName = document.getElementById('registerName').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorElement = document.getElementById('registerError');

    // Kiểm tra mật khẩu xác nhận
    if (password !== confirmPassword) {
        errorElement.textContent = 'Mật khẩu xác nhận không khớp';
        errorElement.style.display = 'block';
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, fullName, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Đăng ký thành công, chuyển về form đăng nhập
            document.getElementById('registerFormContainer').classList.remove('active');
            document.getElementById('loginFormContainer').classList.add('active');
            // Xóa form đăng ký
            document.getElementById('registerForm').reset();
            // Hiển thị thông báo thành công
            alert('Đăng ký thành công! Vui lòng đăng nhập.');
        } else {
            // Hiển thị lỗi
            errorElement.textContent = data.message || 'Đăng ký thất bại';
            errorElement.style.display = 'block';
        }
    } catch (error) {
        errorElement.textContent = 'Có lỗi xảy ra, vui lòng thử lại sau';
        errorElement.style.display = 'block';
        console.error('Register error:', error);
    }
}

// Xử lý quên mật khẩu
async function handleForgotPassword(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const data = {
        email: formData.get('email'),
        birthDate: formData.get('birthDate')
    };

    try {
        const response = await fetch(`${API_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Không thể gửi yêu cầu đặt lại mật khẩu');
        }

        showMessage('Vui lòng kiểm tra email của bạn', 'success');
        form.reset();
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

// Xử lý đổi mật khẩu
async function handleChangePassword(event) {
    event.preventDefault();
    
    if (!requireLogin()) return;
    
    const form = event.target;
    const formData = new FormData(form);
    const data = {
        currentPassword: formData.get('currentPassword'),
        newPassword: formData.get('newPassword')
    };

    try {
        const response = await fetch(`${API_URL}/auth/change-password`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Không thể đổi mật khẩu');
        }

        showMessage('Đổi mật khẩu thành công', 'success');
        form.reset();
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

// Hiển thị thông báo
function showMessage(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    const container = document.getElementById('toastContainer') || document.body;
    container.appendChild(toast);
    
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

// Lưu URL hiện tại trước khi chuyển đến trang đăng nhập
function saveCurrentUrl() {
    if (!isAuthenticated()) {
        localStorage.setItem('previousUrl', window.location.href);
    }
}

// Kiểm tra đăng nhập khi trang được tải
document.addEventListener('DOMContentLoaded', checkAuth);

// Xử lý sự kiện click vào icon người dùng
document.addEventListener('DOMContentLoaded', function() {
    const userIcon = document.querySelector('.user-icon');
    if (userIcon) {
        userIcon.addEventListener('click', function(e) {
            if (!checkLogin()) {
                e.preventDefault();
                window.location.href = 'login.html';
            }
        });
    }

    // Xử lý sự kiện click vào icon giỏ hàng
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            if (!checkLogin()) {
                e.preventDefault();
                window.location.href = 'login.html';
            }
        });
    }

    // Xử lý sự kiện thêm sản phẩm vào giỏ hàng
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    if (addToCartButtons) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                if (!checkLogin()) {
                    e.preventDefault();
                    window.location.href = 'login.html';
                }
            });
        });
    }
});

function updateUserInterface() {
    const userDropdown = document.getElementById('userDropdown');
    const loggedInItems = document.querySelectorAll('.logged-in');
    const notLoggedInItems = document.querySelectorAll('.not-logged-in');
    const cartBadge = document.getElementById('cartCount');
    
    if (isLoggedIn()) {
        // Add dropdown toggle for logged in users
        userDropdown.classList.add('dropdown-toggle');
        userDropdown.setAttribute('data-bs-toggle', 'dropdown');
        userDropdown.setAttribute('aria-expanded', 'false');
        
        // Show arrow for logged in users
        if (!document.querySelector('.dropdown-arrow')) {
            const arrow = document.createElement('i');
            arrow.className = 'fas fa-chevron-down dropdown-arrow';
            userDropdown.appendChild(arrow);
        }
        
        // Show logged in menu items, hide not logged in items
        loggedInItems.forEach(item => item.style.display = 'block');
        notLoggedInItems.forEach(item => item.style.display = 'none');

        // Show cart badge if logged in
        if (cartBadge) {
            cartBadge.style.display = 'flex';
        }
    } else {
        // Remove dropdown toggle for not logged in users
        userDropdown.classList.remove('dropdown-toggle');
        userDropdown.removeAttribute('data-bs-toggle');
        userDropdown.removeAttribute('aria-expanded');
        
        // Remove arrow for not logged in users
        const arrow = document.querySelector('.dropdown-arrow');
        if (arrow) {
            arrow.remove();
        }
        
        // Show not logged in menu items, hide logged in items
        loggedInItems.forEach(item => item.style.display = 'none');
        notLoggedInItems.forEach(item => item.style.display = 'block');

        // Hide cart badge if not logged in
        if (cartBadge) {
            cartBadge.style.display = 'none';
        }
    }
}

// Thêm hàm kiểm tra đăng nhập
function isLoggedIn() {
    return localStorage.getItem('token') !== null;
}

// Call updateUserInterface when page loads
document.addEventListener('DOMContentLoaded', updateUserInterface);

// Call updateUserInterface after login/logout
function login(username, password) {
    // ... existing login code ...
    updateUserInterface();
}

function logout() {
    // ... existing logout code ...
    updateUserInterface();
} 