document.getElementById("image-upload").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById("avatar-preview").src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

document.querySelector("form").addEventListener("submit", function(event) {
    let newPassword = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;
    let errorText = document.getElementById("passwordError");

    if (newPassword && newPassword !== confirmPassword) {
        event.preventDefault();
        errorText.textContent = "Mật khẩu xác nhận không khớp!";
    } else {
        errorText.textContent = "";
    }
});

// Tải thông tin người dùng
async function loadUserProfile() {
    try {
        const response = await fetch(`${API_URL}/users/profile`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Không thể tải thông tin người dùng');
        }

        const user = await response.json();
        
        // Hiển thị thông tin cá nhân
        document.getElementById('profileFullName').value = user.fullName;
        document.getElementById('profileEmail').value = user.email;
        document.getElementById('profilePhone').value = user.phone;
        document.getElementById('profileBirthDate').value = user.birthDate;
        
        // Hiển thị avatar nếu có
        const avatarElement = document.getElementById('profileAvatar');
        if (user.avatar) {
            avatarElement.src = user.avatar;
        }
        
        // Tải lịch sử đơn hàng
        loadOrderHistory();
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

// Tải lịch sử đơn hàng
async function loadOrderHistory() {
    try {
        const response = await fetch(`${API_URL}/users/orders`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Không thể tải lịch sử đơn hàng');
        }

        const orders = await response.json();
        
        // Hiển thị danh sách đơn hàng
        const ordersContainer = document.getElementById('orderHistory');
        if (ordersContainer) {
            ordersContainer.innerHTML = orders.map(order => `
                <div class="order-item">
                    <div class="order-header">
                        <div class="order-info">
                            <span class="order-id">Đơn hàng #${order.id}</span>
                            <span class="order-date">${formatDate(order.createdAt)}</span>
                        </div>
                        <span class="order-status ${getStatusClass(order.status)}">
                            ${getStatusText(order.status)}
                        </span>
                    </div>
                    <div class="order-items">
                        ${order.items.map(item => `
                            <div class="order-item-product">
                                <img src="${item.product.image}" alt="${item.product.name}">
                                <div class="order-item-info">
                                    <h5>${item.product.name}</h5>
                                    <p>Số lượng: ${item.quantity}</p>
                                    <p>Giá: ${formatCurrency(item.price)}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="order-footer">
                        <div class="order-total">
                            Tổng cộng: ${formatCurrency(order.total)}
                        </div>
                        <div class="order-actions">
                            ${order.status === 'pending' ? `
                                <button class="btn btn-danger btn-sm" onclick="cancelOrder(${order.id})">
                                    Hủy đơn
                                </button>
                            ` : ''}
                            <button class="btn btn-primary btn-sm" onclick="viewOrderDetail(${order.id})">
                                Chi tiết
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

// Xử lý cập nhật thông tin cá nhân
async function handleUpdateProfile(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    try {
        const response = await fetch(`${API_URL}/users/profile`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fullName: formData.get('fullName'),
                phone: formData.get('phone'),
                birthDate: formData.get('birthDate')
            })
        });
        
        if (!response.ok) {
            throw new Error('Không thể cập nhật thông tin');
        }
        
        showMessage('Cập nhật thông tin thành công', 'success');
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

// Xử lý upload avatar
async function handleUploadAvatar(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const avatarFile = formData.get('avatar');
    
    try {
        const response = await fetch(`${API_URL}/users/avatar`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('Không thể upload ảnh đại diện');
        }
        
        const data = await response.json();
        document.getElementById('profileAvatar').src = data.avatarUrl;
        showMessage('Cập nhật ảnh đại diện thành công', 'success');
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

// Xử lý hủy đơn hàng
async function cancelOrder(orderId) {
    if (!confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/orders/${orderId}/cancel`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Không thể hủy đơn hàng');
        }
        
        showMessage('Hủy đơn hàng thành công', 'success');
        loadOrderHistory(); // Tải lại danh sách đơn hàng
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

// Xem chi tiết đơn hàng
function viewOrderDetail(orderId) {
    window.location.href = `order-detail.html?id=${orderId}`;
}

// Khởi tạo các event listener
document.addEventListener('DOMContentLoaded', () => {
    // Tải thông tin người dùng
    loadUserProfile();
    
    // Form cập nhật thông tin
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', handleUpdateProfile);
    }
    
    // Form upload avatar
    const avatarForm = document.getElementById('avatarForm');
    if (avatarForm) {
        avatarForm.addEventListener('submit', handleUploadAvatar);
    }
});
