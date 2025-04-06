document.addEventListener("DOMContentLoaded", function () {
    const popup = document.getElementById("popup");
    const overlay = document.getElementById("overlay");

    // Lấy tất cả các nút mở popup
    const openPopupBtns = document.querySelectorAll(".detail-link");
    openPopupBtns.forEach(btn => {
        btn.addEventListener("click", function () {
            overlay.style.display = "block";
            popup.style.display = "block";
        });
    });

    // Đóng popup khi click overlay
    overlay.addEventListener("click", function () {
        closePopup();
    });

    function closePopup() {
        overlay.style.display = "none";
        popup.style.display = "none";
    }

    fetch('/api/orders/update-status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: 1, state: 'Đã xác nhận' })
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Lỗi:', error));
    
});

// Tải danh sách đơn hàng
async function loadOrders() {
    try {
        const response = await fetch(`${API_URL}/orders`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Không thể tải danh sách đơn hàng');
        }

        const orders = await response.json();
        
        // Hiển thị danh sách đơn hàng
        const ordersContainer = document.getElementById('ordersContainer');
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

// Xem chi tiết đơn hàng
async function viewOrderDetail(orderId) {
    try {
        const response = await fetch(`${API_URL}/orders/${orderId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Không thể tải chi tiết đơn hàng');
        }

        const order = await response.json();
        
        // Hiển thị chi tiết đơn hàng trong modal
        const modal = document.getElementById('orderDetailModal');
        if (modal) {
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Chi tiết đơn hàng #${order.id}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="order-info">
                            <p><strong>Ngày đặt:</strong> ${formatDate(order.createdAt)}</p>
                            <p><strong>Trạng thái:</strong> ${getStatusText(order.status)}</p>
                            <p><strong>Tổng tiền:</strong> ${formatCurrency(order.total)}</p>
                        </div>
                        <div class="order-items">
                            <h6>Sản phẩm</h6>
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
                        <div class="order-address">
                            <h6>Địa chỉ giao hàng</h6>
                            <p>${order.shippingAddress}</p>
                        </div>
                    </div>
                </div>
            `;
            
            const modalInstance = new bootstrap.Modal(modal);
            modalInstance.show();
        }
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
        loadOrders(); // Tải lại danh sách đơn hàng
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

// Xử lý đặt hàng
async function handleCheckout(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    try {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                items: JSON.parse(localStorage.getItem('cart')),
                shippingAddress: formData.get('shippingAddress'),
                paymentMethod: formData.get('paymentMethod')
            })
        });
        
        if (!response.ok) {
            throw new Error('Không thể đặt hàng');
        }
        
        const order = await response.json();
        showMessage('Đặt hàng thành công', 'success');
        localStorage.removeItem('cart'); // Xóa giỏ hàng
        window.location.href = `order-detail.html?id=${order.id}`; // Chuyển đến trang chi tiết đơn hàng
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

// Khởi tạo các event listener
document.addEventListener('DOMContentLoaded', () => {
    // Tải danh sách đơn hàng
    loadOrders();
    
    // Form đặt hàng
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckout);
    }
});

// Lấy danh sách đơn hàng
async function getOrders() {
    try {
        const response = await fetch(`${API_URL}/orders`, {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });
        if (!response.ok) {
            throw new Error('Không thể lấy danh sách đơn hàng');
        }
        return await response.json();
    } catch (error) {
        showMessage(error.message, 'error');
        return [];
    }
}

// Lấy chi tiết đơn hàng
async function getOrderDetail(orderId) {
    try {
        const response = await fetch(`${API_URL}/orders/${orderId}`, {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });
        if (!response.ok) {
            throw new Error('Không thể lấy thông tin đơn hàng');
        }
        return await response.json();
    } catch (error) {
        showMessage(error.message, 'error');
        return null;
    }
}

// Cập nhật trạng thái đơn hàng
async function updateOrderStatus(orderId, status) {
    if (!requireAdmin()) return;

    try {
        const response = await fetch(`${API_URL}/orders/${orderId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });

        if (!response.ok) {
            throw new Error('Không thể cập nhật trạng thái đơn hàng');
        }

        showMessage('Cập nhật trạng thái đơn hàng thành công', 'success');
        window.location.reload();
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

// Hiển thị danh sách đơn hàng
async function displayOrders() {
    const orders = await getOrders();
    const container = document.getElementById('orderList');

    if (!container) return;

    if (orders.length === 0) {
        container.innerHTML = '<p>Không có đơn hàng nào</p>';
        return;
    }

    container.innerHTML = orders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <h3>Đơn hàng #${order.id}</h3>
                <span class="status ${order.status}">${getStatusText(order.status)}</span>
            </div>
            <div class="order-details">
                <p>Ngày đặt: ${new Date(order.created_at).toLocaleDateString()}</p>
                <p>Tổng tiền: ₫${order.total_amount.toLocaleString()}</p>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="item-info">
                            <h4>${item.name}</h4>
                            <p>Số lượng: ${item.quantity}</p>
                            <p>Giá: ₫${item.price.toLocaleString()}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="order-actions">
                <button onclick="viewOrderDetail(${order.id})">Xem chi tiết</button>
                ${checkRole() === 'admin' ? `
                    <select onchange="updateOrderStatus(${order.id}, this.value)">
                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Chờ xử lý</option>
                        <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Đang xử lý</option>
                        <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Hoàn thành</option>
                        <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Đã hủy</option>
                    </select>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// Hiển thị chi tiết đơn hàng
async function displayOrderDetail(orderId) {
    const order = await getOrderDetail(orderId);
    const container = document.getElementById('orderDetail');

    if (!container || !order) return;

    container.innerHTML = `
        <div class="order-detail">
            <div class="order-header">
                <h1>Đơn hàng #${order.id}</h1>
                <span class="status ${order.status}">${getStatusText(order.status)}</span>
            </div>
            <div class="order-info">
                <p>Ngày đặt: ${new Date(order.created_at).toLocaleDateString()}</p>
                <p>Tổng tiền: ₫${order.total_amount.toLocaleString()}</p>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="item-info">
                            <h3>${item.name}</h3>
                            <p>Số lượng: ${item.quantity}</p>
                            <p>Giá: ₫${item.price.toLocaleString()}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Lấy text hiển thị trạng thái
function getStatusText(status) {
    const statusMap = {
        pending: 'Chờ xử lý',
        processing: 'Đang xử lý',
        completed: 'Hoàn thành',
        cancelled: 'Đã hủy'
    };
    return statusMap[status] || status;
}

// Khởi tạo trang đơn hàng
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('orderList')) {
        displayOrders();
    }
    if (document.getElementById('orderDetail')) {
        const urlParams = new URLSearchParams(window.location.search);
        const orderId = urlParams.get('id');
        if (orderId) {
            displayOrderDetail(orderId);
        }
    }
});
