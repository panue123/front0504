const API_URL = 'http://localhost:5000/api';

// Kiểm tra quyền admin
async function checkAdminAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '../login.html';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Token không hợp lệ');
        }

        const user = await response.json();
        if (user.role !== 'admin') {
            window.location.href = '../index.html';
            return;
        }

        // Cập nhật thông tin admin
        const adminName = document.getElementById('adminName');
        if (adminName) {
            adminName.textContent = user.fullName;
        }
    } catch (error) {
        window.location.href = '../login.html';
    }
}

// Xử lý đăng xuất admin
function handleAdminLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '../login.html';
}

// Hiển thị thông báo
function showMessage(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 5000);
}

// Định dạng tiền tệ
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

// Định dạng ngày tháng
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Khởi tạo các event listener
document.addEventListener('DOMContentLoaded', () => {
    // Kiểm tra quyền admin
    checkAdminAuth();

    // Xử lý đăng xuất
    const logoutBtn = document.getElementById('adminLogoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleAdminLogout);
    }
}); 