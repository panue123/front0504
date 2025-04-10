document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        // Tự động điền username nếu đã lưu
        const rememberedUsername = localStorage.getItem('rememberedUsername');
        if (rememberedUsername) {
            document.getElementById('loginUsername').value = rememberedUsername;
            document.getElementById('rememberMe').checked = true;
        }

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = document.getElementById('loginUsername').value.trim();
            const password = document.getElementById('loginPassword').value.trim();
            const rememberMe = document.getElementById('rememberMe').checked;

            if (!username || !password) {
                alert('Vui lòng điền đầy đủ thông tin!');
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();
                console.log('Server response:', data); // Debug

                if (!response.ok) {
                    const errorMsg = data.message || 'Tên đăng nhập hoặc mật khẩu không chính xác!';
                    throw new Error(errorMsg);
                }

                if (!data.token) {
                    throw new Error('Không nhận được token từ máy chủ!');
                }

                // Lưu token vào localStorage
                localStorage.setItem('token', data.token);

                // Ghi nhớ username nếu được chọn
                if (rememberMe) {
                    localStorage.setItem('rememberedUsername', username);
                } else {
                    localStorage.removeItem('rememberedUsername');
                }

                alert('Đăng nhập thành công!');
                window.location.href = 'index.html'; // Chuyển về trang chủ

            } catch (error) {
                console.error('Lỗi đăng nhập:', error);
                alert(error.message || 'Đã có lỗi xảy ra khi đăng nhập!');
            }
        });
    }
});
