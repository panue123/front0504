document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
  
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const username = document.getElementById('username').value;
      const fullname = document.getElementById('fullname').value;
      const email = document.getElementById('email').value;
      const phoneInput = document.getElementById('phone');
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      const phonenumber = phoneInput.value.trim(); 
  
      
      if (!username || !fullname || !email || !phonenumber || !password || !confirmPassword) {
        showNotification('Vui lòng điền đầy đủ thông tin!', 'error');
        return;
      }
  
      
      if (password !== confirmPassword) {
        showNotification('Mật khẩu xác nhận không khớp!', 'error');
        return;
      }
  
      try {
        const serverStatus = await checkServerStatus();
        if (!serverStatus) {
          showNotification('Không thể kết nối đến server. Vui lòng kiểm tra lại server và thử lại!', 'error');
          return;
        }
  
        const response = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            username,
            fullname,
            email,
            phonenumber, 
            password,
            password1: confirmPassword 
          })
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          throw new Error(data.message || 'Đăng ký thất bại!');
        }
  
        showNotification('Đăng ký thành công! Vui lòng đăng nhập.', 'success');
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 2000);
  
      } catch (error) {
        console.error('Error:', error);
        if (error.message.includes('Failed to fetch')) {
          showNotification('Không thể kết nối đến server. Vui lòng kiểm tra lại server và thử lại!', 'error');
        } else {
          showNotification(error.message, 'error');
        }
      }
    });
  });
  
  
  async function checkServerStatus() {
    try {
      const response = await fetch('http://localhost:5000/api/health');
      return response.ok;
    } catch (error) {
      console.error('Server status check failed:', error);
      return false;
    }
  }
  
 
  function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
  
    document.body.appendChild(notification);
  
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }