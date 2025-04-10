document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Bạn chưa đăng nhập!');
      window.location.href = '/login.html';
      return;
    }
  
    try {
      const res = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!res.ok) {
        throw new Error('Lỗi khi lấy thông tin người dùng');
      }
  
      const user = await res.json();
      document.getElementById('username').value = user.username || '';
      document.getElementById('fullName').value = user.fullname || '';
      document.getElementById('phoneNumber').value = user.phone || '';
      document.getElementById('email').value = user.email || '';
  
    } catch (error) {
      console.error(error.message);
      alert('Không thể tải dữ liệu hồ sơ.');
    }
  });
  
  document.getElementById('saveProfileBtn').addEventListener('click', async (e) => {
    e.preventDefault();
  
    const fullname = document.getElementById('fullName').value;
    const phone = document.getElementById('phoneNumber').value;
    const email = document.getElementById('email').value;
    

    const token = localStorage.getItem('token'); // cần lại token ở đây
  
    try {
      const res = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ fullname, phone, email })
      });
  
      const result = await res.json();
  
      if (!res.ok) {
        throw new Error(result.message || 'Cập nhật không thành công');
      }
  
      alert('✅ Cập nhật hồ sơ thành công!');
      window.location.href = 'index.html'; 
  
    } catch (err) {
      console.error(err.message);
      alert('❌ Cập nhật thất bại!');
    }
  });
  