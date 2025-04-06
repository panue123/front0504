document.addEventListener('DOMContentLoaded', function() {
    // Switch between login and register forms
    const switchToRegister = document.querySelector('.switch-to-register');
    const switchToLogin = document.querySelector('.switch-to-login');
    const loginForm = document.querySelector('.login-form');
    const registerForm = document.querySelector('.register-form');
    const forgotPasswordLink = document.querySelector('.forgot-password');
    const rememberMeCheckbox = document.querySelector('input[type="checkbox"]');

    if (switchToRegister && switchToLogin && loginForm && registerForm) {
        switchToRegister.addEventListener('click', function(e) {
            e.preventDefault();
            loginForm.classList.remove('active');
            registerForm.classList.add('active');
        });

        switchToLogin.addEventListener('click', function(e) {
            e.preventDefault();
            registerForm.classList.remove('active');
            loginForm.classList.add('active');
        });
    }

    // Handle forgot password form switching
    if (forgotPasswordLink && backToLogin && forgotPasswordForm) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            loginForm.classList.remove('active');
            registerForm.classList.remove('active');
            forgotPasswordForm.classList.add('active');
        });

        backToLogin.addEventListener('click', function(e) {
            e.preventDefault();
            forgotPasswordForm.classList.remove('active');
            loginForm.classList.add('active');
        });
    }

    // Toggle password visibility
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    togglePasswordButtons.forEach(button => {
        if (button) {
            button.addEventListener('click', function() {
                const input = this.previousElementSibling;
                if (input) {
                    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                    input.setAttribute('type', type);
                    this.classList.toggle('fa-eye');
                    this.classList.toggle('fa-eye-slash');
                }
            });
        }
    });

    // Form validation and submission
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        if (form) {
            form.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                // Basic form validation
                const inputs = this.querySelectorAll('input[required]');
                let isValid = true;

                inputs.forEach(input => {
                    if (!input.value.trim()) {
                        isValid = false;
                        showError(input, 'Vui lòng điền thông tin này');
                    } else {
                        removeError(input);
                    }
                });

                if (this.classList.contains('register-form')) {
                    // Username validation
                    const usernameInput = this.querySelector('input[name="username"]');
                    if (usernameInput && !isValidUsername(usernameInput.value)) {
                        isValid = false;
                        showError(usernameInput, 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới, độ dài 3-20 ký tự');
                    }

                    // Email validation
                    const emailInput = this.querySelector('input[name="email"]');
                    if (emailInput && !isValidEmail(emailInput.value)) {
                        isValid = false;
                        showError(emailInput, 'Email không hợp lệ');
                    }

                    // Password validation
                    const password = this.querySelector('input[name="password"]');
                    const confirmPassword = this.querySelector('input[name="confirmPassword"]');

                    if (password && !isValidPassword(password.value)) {
                        isValid = false;
                        showError(password, 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số');
                    }

                    if (password && confirmPassword && password.value !== confirmPassword.value) {
                        isValid = false;
                        showError(confirmPassword, 'Mật khẩu không khớp');
                    }
                }

                if (isValid) {
                    const formData = new FormData(this);
                    const data = Object.fromEntries(formData.entries());

                    try {
                        // Giả lập API call thành công
                        if (this.classList.contains('login-form')) {
                            // Handle remember me
                            if (rememberMeCheckbox && rememberMeCheckbox.checked) {
                                localStorage.setItem('rememberedUsername', data.login);
                            } else {
                                localStorage.removeItem('rememberedUsername');
                            }

                            // Simulate successful login
                            localStorage.setItem('user', JSON.stringify({
                                username: data.login,
                                role: 'user'
                            }));
                            showSuccess('Đăng nhập thành công!');
                            setTimeout(() => {
                                window.location.href = 'index.html';
                            }, 1500);
                        } else {
                            // Simulate successful registration
                            showSuccess('Đăng ký thành công! Vui lòng đăng nhập.');
                            setTimeout(() => {
                                if (switchToLogin) {
                                    switchToLogin.click();
                                }
                            }, 1500);
                        }
                    } catch (error) {
                        console.error('Error:', error);
                        showError(this.querySelector('button[type="submit"]'), 'Có lỗi xảy ra, vui lòng thử lại sau');
                    }
                }
            });
        }
    });

    // Load remembered username if exists
    const rememberedUsername = localStorage.getItem('rememberedUsername');
    if (rememberedUsername && loginForm) {
        const loginInput = loginForm.querySelector('input[name="login"]');
        if (loginInput) {
            loginInput.value = rememberedUsername;
        }
        if (rememberMeCheckbox) {
            rememberMeCheckbox.checked = true;
        }
    }
});

// Helper functions
function isValidUsername(username) {
    const re = /^[a-zA-Z0-9_]{3,20}$/;
    return re.test(username);
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function isValidPassword(password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return re.test(password);
}

function showError(input, message) {
    if (!input) return;
    
    removeError(input);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = '#ff4444';
    errorDiv.style.fontSize = '12px';
    errorDiv.style.marginTop = '5px';
    errorDiv.style.paddingLeft = '15px';
    errorDiv.textContent = message;
    input.parentNode.appendChild(errorDiv);
    input.style.borderColor = '#ff4444';
}

function removeError(input) {
    if (!input || !input.parentNode) return;
    
    const errorDiv = input.parentNode.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
    input.style.borderColor = '#ddd';
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.style.position = 'fixed';
    successDiv.style.top = '20px';
    successDiv.style.right = '20px';
    successDiv.style.backgroundColor = '#fff';
    successDiv.style.color = '#333';
    successDiv.style.padding = '15px 25px';
    successDiv.style.borderRadius = '8px';
    successDiv.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    successDiv.style.fontSize = '14px';
    successDiv.style.fontWeight = '500';
    successDiv.style.zIndex = '9999';
    successDiv.style.border = '2px solid #EFC5C9';
    successDiv.style.display = 'flex';
    successDiv.style.alignItems = 'center';
    
    // Add success icon
    const icon = document.createElement('i');
    icon.className = 'fas fa-check-circle';
    icon.style.color = '#EFC5C9';
    icon.style.marginRight = '10px';
    icon.style.fontSize = '16px';
    successDiv.prepend(icon);
    
    // Add message
    const messageSpan = document.createElement('span');
    messageSpan.textContent = message;
    successDiv.appendChild(messageSpan);

    document.body.appendChild(successDiv);

    // Add fade in animation
    successDiv.style.opacity = '0';
    successDiv.style.transform = 'translateY(-20px)';
    successDiv.style.transition = 'all 0.3s ease';
    
    setTimeout(() => {
        successDiv.style.opacity = '1';
        successDiv.style.transform = 'translateY(0)';
    }, 10);

    // Remove notification
    setTimeout(() => {
        successDiv.style.opacity = '0';
        successDiv.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.remove();
            }
        }, 300);
    }, 3000);
}

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
