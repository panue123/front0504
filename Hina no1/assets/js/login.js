document.addEventListener('DOMContentLoaded', function() {
    // Xử lý form đăng nhập
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    password
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Đăng nhập thất bại');
            }

            const data = await response.json();
            
            // Lưu token và thông tin user
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Nếu chọn ghi nhớ đăng nhập
            if (rememberMe) {
                localStorage.setItem('rememberedUsername', username);
            } else {
                localStorage.removeItem('rememberedUsername');
            }

            // Kiểm tra role và chuyển hướng
            if (data.user.role === 'admin') {
                window.location.href = 'admin-dashboard.html';
            } else {
                // Kiểm tra URL chuyển hướng trước đó
                const redirectUrl = localStorage.getItem('redirectUrl');
                if (redirectUrl) {
                    localStorage.removeItem('redirectUrl');
                    window.location.href = redirectUrl;
                } else {
                    window.location.href = 'index.html';
                }
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification(error.message || 'Có lỗi xảy ra!', 'error');
        }
    });
    
    // Xử lý form đăng ký
    document.getElementById('registerForm').addEventListener('submit', handleRegister);

    // Xử lý chuyển đổi form
    document.getElementById('showRegister').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('loginFormContainer').classList.remove('active');
        document.getElementById('registerFormContainer').classList.add('active');
    });

    document.getElementById('showLogin').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('registerFormContainer').classList.remove('active');
        document.getElementById('loginFormContainer').classList.add('active');
    });
});

// Xử lý quên mật khẩu
document.getElementById('forgotPassword').addEventListener('click', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    if (!username) {
        showNotification('Vui lòng nhập tên đăng nhập/email/số điện thoại!', 'error');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Yêu cầu đặt lại mật khẩu thất bại');
        }

        showNotification('Yêu cầu đặt lại mật khẩu đã được gửi đến admin!');
        window.location.href = 'forgot-password.html';
    } catch (error) {
        console.error('Error:', error);
        showNotification(error.message || 'Có lỗi xảy ra!', 'error');
    }
});

// Hiển thị thông báo
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Kiểm tra và điền username đã ghi nhớ
document.addEventListener('DOMContentLoaded', () => {
    const rememberedUsername = localStorage.getItem('rememberedUsername');
    if (rememberedUsername) {
        document.getElementById('username').value = rememberedUsername;
        document.getElementById('rememberMe').checked = true;
    }
}); 