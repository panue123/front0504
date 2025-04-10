document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Lấy giá trị từ form
            const username = document.getElementById('username').value;
            const fullname = document.getElementById('fullname').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const termsAccepted = document.getElementById('termsAccepted').checked;

            // Kiểm tra dữ liệu
            if (!username || !fullname || !email || !phone || !password || !confirmPassword) {
                alert('Vui lòng điền đầy đủ thông tin!');
                return;
            }

            if (!termsAccepted) {
                alert('Vui lòng xác nhận thông tin!');
                return;
            }

            // Kiểm tra mật khẩu
            if (password !== confirmPassword) {
                alert('Mật khẩu xác nhận không khớp!');
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username,
                        password,
                        confirmPassword, 
                        fullname,
                        email,
                        phone
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Đăng ký thất bại!');
                }

                alert('Đăng ký thành công! Vui lòng đăng nhập.');
                window.location.href = 'login.html';

            } catch (error) {
                alert(error.message || 'Có lỗi xảy ra!');
            }
        });

        // Xử lý hiện/ẩn mật khẩu
        const togglePasswordButtons = document.querySelectorAll('.toggle-password');
        togglePasswordButtons.forEach(button => {
            button.addEventListener('click', function() {
                const input = this.previousElementSibling;
                const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                input.setAttribute('type', type);
                this.classList.toggle('fa-eye');
                this.classList.toggle('fa-eye-slash');
            });
        });
    }
});