const API_URL = 'http://localhost:5000/api/admin';

document.addEventListener("DOMContentLoaded", function () {
    const userTableBody = document.getElementById("userTableBody");
    const overlay = document.getElementById("overlay");
    const popup = document.getElementById("popup");
    const resetPasswordForm = document.getElementById("resetPasswordForm");
    const userIdInput = document.getElementById("userId");
    const newPasswordInput = document.getElementById("newPassword");
    const confirmPasswordInput = document.getElementById("confirmPassword");

    // Danh sách người dùng giả lập (sẽ lấy từ backend)
    let users = [
        { id: 1, name: "Nguyễn Văn A", email: "nguyenvana@example.com", phone: "0918759123", role: "Khách hàng" },
        { id: 2, name: "Trần Thị B", email: "tranthib@example.com", phone: "0981121235", role: "Quản trị viên" }
    ];

    function renderUsers() {
        userTableBody.innerHTML = "";
        users.forEach((user, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td>${user.role}</td>
                <td>
                    <button class="btn edit-btn" data-id="${user.id}">✏️ Sửa</button>
                    <button class="btn delete-btn" data-id="${user.id}">🗑️ Xóa</button>
                    <button class="btn reset-password-btn" data-id="${user.id}">🔑 Đặt lại mật khẩu</button>
                </td>
            `;
            userTableBody.appendChild(row);
        });
    }

    renderUsers();

    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("reset-password-btn")) {
            const userId = event.target.getAttribute("data-id");
            userIdInput.value = userId;
            overlay.style.display = "block";
            popup.style.display = "block";
        }

        if (event.target.classList.contains("delete-btn")) {
            const userId = event.target.getAttribute("data-id");
            if (confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
                users = users.filter(user => user.id != userId);
                renderUsers();
                console.log(`Đã gửi request xóa user với ID: ${userId}`);
            }
        }
    });

    resetPasswordForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const userId = userIdInput.value;
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (newPassword !== confirmPassword) {
            alert("Mật khẩu xác nhận không khớp!");
            return;
        }

        console.log(`Gửi request đặt lại mật khẩu cho user ID: ${userId}`);
    });

    document.querySelector(".cancel-btn").addEventListener("click", function () {
        overlay.style.display = "none";
        popup.style.display = "none";
    });
});

// Hàm hiển thị thông báo
function showNotification(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type === 'success' ? 'success' : 'danger'} border-0`;
    toast.role = 'alert';
    toast.style.position = 'fixed';
    toast.style.top = '20px';
    toast.style.right = '20px';
    toast.style.zIndex = '1050';
    toast.style.minWidth = '300px';
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    document.body.appendChild(toast);
    new bootstrap.Toast(toast).show();
    setTimeout(() => toast.remove(), 3000);
}

// Tải danh sách người dùng
async function loadUsers() {
    try {
        const response = await fetch(`${API_URL}/users`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (!response.ok) throw new Error('Không thể tải danh sách người dùng');

        const users = await response.json();
        const userTableBody = document.getElementById('userTableBody');
        userTableBody.innerHTML = '';

        users.forEach((user, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${user.fullName || 'Không có tên'}</td>
                <td>${user.email}</td>
                <td>${user.phone || 'Chưa cập nhật'}</td>
                <td><span class="badge ${user.role === 'admin' ? 'bg-danger' : 'bg-primary'}">${user.role === 'admin' ? 'Admin' : 'Người dùng'}</span></td>
                <td><span class="badge ${getStatusBadgeClass(user.status)}">${getStatusText(user.status)}</span></td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="viewUserDetail('${user.id}')" title="Xem chi tiết"><i class="fas fa-eye"></i></button>
                    <button class="btn btn-sm btn-primary" onclick="editUser('${user.id}')" title="Chỉnh sửa"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-warning" onclick="showResetPasswordModal('${user.id}')" title="Đặt lại mật khẩu"><i class="fas fa-key"></i></button>
                    <button class="btn btn-sm btn-danger" onclick="deleteUser('${user.id}')" title="Xóa"><i class="fas fa-trash"></i></button>
                </td>
            `;
            userTableBody.appendChild(tr);
        });
    } catch (error) {
        console.error('Lỗi:', error);
        showNotification(error.message, 'danger');
    }
}

// Xem chi tiết người dùng
async function viewUserDetail(userId) {
    try {
        const response = await fetch(`${API_URL}/users/${userId}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (!response.ok) throw new Error('Không thể tải thông tin người dùng');

        const user = await response.json();
        document.getElementById('detailUsername').textContent = user.username;
        document.getElementById('detailFullName').textContent = user.fullName || 'Không có tên';
        document.getElementById('detailEmail').textContent = user.email;
        document.getElementById('detailPhone').textContent = user.phone || 'Chưa cập nhật';
        document.getElementById('detailRole').textContent = user.role === 'admin' ? 'Admin' : 'Người dùng';
        document.getElementById('detailStatus').textContent = getStatusText(user.status);
        document.getElementById('detailCreatedAt').textContent = new Date(user.createdAt).toLocaleString('vi-VN');
        document.getElementById('detailLastLogin').textContent = user.lastLogin ? new Date(user.lastLogin).toLocaleString('vi-VN') : 'Chưa đăng nhập';

        new bootstrap.Modal(document.getElementById('userDetailsModal')).show();
    } catch (error) {
        showNotification(error.message, 'danger');
    }
}

// Chỉnh sửa người dùng
async function editUser(userId) {
    try {
        const response = await fetch(`${API_URL}/users/${userId}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (!response.ok) throw new Error('Không thể tải thông tin người dùng');

        const user = await response.json();
        const form = document.getElementById('editUserForm');
        form.editUserId.value = user.id;
        form.editUsername.value = user.username;
        form.editFullName.value = user.fullName || '';
        form.editEmail.value = user.email;
        form.editPhone.value = user.phone || '';
        form.editRole.value = user.role;
        form.editStatus.value = user.status;

        new bootstrap.Modal(document.getElementById('editUserModal')).show();
    } catch (error) {
        showNotification(error.message, 'danger');
    }
}

// Hiển thị modal đặt lại mật khẩu
function showResetPasswordModal(userId) {
    document.getElementById('resetPasswordUserId').value = userId;
    new bootstrap.Modal(document.getElementById('resetPasswordModal')).show();
}

// Reset mật khẩu
document.getElementById('saveNewPasswordBtn').addEventListener('click', async () => {
    const form = document.getElementById('resetPasswordForm');
    const userId = form.resetPasswordUserId.value;
    const newPassword = form.newPassword.value;
    const confirmPassword = form.confirmPassword.value;

    if (newPassword !== confirmPassword) {
        showNotification('Mật khẩu xác nhận không khớp!', 'danger');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/users/${userId}/reset-password`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ newPassword })
        });

        if (!response.ok) throw new Error('Không thể đặt lại mật khẩu');
        showNotification('Đặt lại mật khẩu thành công!', 'success');
        bootstrap.Modal.getInstance(document.getElementById('resetPasswordModal')).hide();
        form.reset();
    } catch (error) {
        showNotification(error.message, 'danger');
    }
});

// Cập nhật người dùng
document.getElementById('updateUserBtn').addEventListener('click', async () => {
    const form = document.getElementById('editUserForm');
    const userId = form.editUserId.value;
    const formData = {
        username: form.editUsername.value,
        fullName: form.editFullName.value,
        email: form.editEmail.value,
        phone: form.editPhone.value,
        role: form.editRole.value,
        status: form.editStatus.value
    };

    try {
        const response = await fetch(`${API_URL}/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) throw new Error('Không thể cập nhật người dùng');
        showNotification('Cập nhật thông tin thành công!', 'success');
        bootstrap.Modal.getInstance(document.getElementById('editUserModal')).hide();
        loadUsers();
    } catch (error) {
        showNotification(error.message, 'danger');
    }
});

// Thêm người dùng mới
document.getElementById('saveUserBtn').addEventListener('click', async () => {
    const form = document.getElementById('addUserForm');
    const formData = {
        username: form.username.value,
        fullName: form.fullName.value,
        email: form.email.value,
        phone: form.phone.value,
        password: form.password.value,
        role: form.role.value,
        status: 'pending'
    };

    try {
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) throw new Error('Không thể thêm người dùng');
        showNotification('Thêm người dùng thành công!', 'success');
        bootstrap.Modal.getInstance(document.getElementById('addUserModal')).hide();
        form.reset();
        loadUsers();
    } catch (error) {
        showNotification(error.message, 'danger');
    }
});

// Xóa người dùng
async function deleteUser(userId) {
    if (!confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;

    try {
        const response = await fetch(`${API_URL}/users/${userId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (!response.ok) throw new Error('Không thể xóa người dùng');
        showNotification('Xóa người dùng thành công!', 'success');
        loadUsers();
    } catch (error) {
        showNotification(error.message, 'danger');
    }
}

// Kiểm tra yêu cầu đặt lại mật khẩu
async function checkResetPasswordRequests() {
    try {
        const response = await fetch(`${API_URL}/reset-password-requests`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (!response.ok) throw new Error('Không thể tải yêu cầu đặt lại mật khẩu');

        const requests = await response.json();
        document.getElementById('resetPasswordBadge').style.display = requests.length > 0 ? 'inline' : 'none';
    } catch (error) {
        console.error('Lỗi:', error);
    }
}

// Utility functions
function getStatusBadgeClass(status) {
    return {
        'pending': 'bg-warning',
        'active': 'bg-success',
        'locked': 'bg-danger'
    }[status] || 'bg-secondary';
}

function getStatusText(status) {
    return {
        'pending': 'Chờ kích hoạt',
        'active': 'Hoạt động',
        'locked': 'Đã khóa'
    }[status] || 'Không xác định';
}

// Khởi tạo sự kiện
document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
    checkResetPasswordRequests();

    // Đăng xuất
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    });
});