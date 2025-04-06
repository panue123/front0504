const API_URL = 'http://localhost:5000/api';
document.addEventListener("DOMContentLoaded", function() {
    const selectAllCheckbox = document.querySelector('.order-bg input[type="checkbox"]');
    const productCheckboxes = document.querySelectorAll('tbody input[type="checkbox"]');
    const productRows = document.querySelectorAll('tbody tr');

    const productCountElement = document.querySelector('.order-bg .col-3.order-width:nth-child(3)');
    const totalPriceElement = document.querySelector('.order-bg .col-1.price');

    // Hàm tính lại tổng số lượng sản phẩm và tổng tiền
    function updateTotal() {
        let totalProducts = 0;
        let totalPrice = 0;

        productRows.forEach(row => {
            const checkbox = row.querySelector('input[type="checkbox"]');
            const priceText = row.querySelector('.price').innerText.replace(/[^\d]/g, ''); // Lấy số tiền
            const price = parseInt(priceText);

            if (checkbox.checked) {
                totalProducts += 1;
                totalPrice += price;
            }
        });

        productCountElement.innerText = `${totalProducts} sản phẩm`;
        totalPriceElement.innerText = `₫${totalPrice.toLocaleString()}`;
    }

    // Xử lý chọn tất cả
    selectAllCheckbox.addEventListener('change', function() {
        productCheckboxes.forEach(checkbox => {
            checkbox.checked = selectAllCheckbox.checked;
        });
        updateTotal();
    });

    // Xử lý chọn từng sản phẩm
    productCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (!checkbox.checked) {
                selectAllCheckbox.checked = false;
            } else {
                const allChecked = [...productCheckboxes].every(cb => cb.checked);
                selectAllCheckbox.checked = allChecked;
            }
            updateTotal();
        });
    });

    // Xử lý xóa từng sản phẩm
    const deleteButtons = document.querySelectorAll('tbody .btn-color');

    deleteButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            const row = button.closest('tr');
            if (row) {
                row.remove();
                updateTotal();
            }
        });
    });

    // Khởi động tính tổng lúc mới tải trang
    updateTotal();
});

// Lấy giỏ hàng từ localStorage
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

// Lưu giỏ hàng vào localStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Check login status
function checkLogin() {
    const token = localStorage.getItem('token');
    return !!token;
}

// Update cart count
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (!cartCount) return;

    if (checkLogin()) {
        // Get cart items from localStorage
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
        
        if (totalItems > 0) {
            cartCount.textContent = totalItems;
            cartCount.style.display = 'block';
        } else {
            cartCount.style.display = 'none';
        }
    } else {
        cartCount.style.display = 'none';
    }
}

// Initialize cart
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    
    // Listen for login/logout events
    document.addEventListener('login', updateCartCount);
    document.addEventListener('logout', updateCartCount);
    
    // Listen for cart updates
    document.addEventListener('cartUpdated', updateCartCount);
});

// Add to cart function
function addToCart(event) {
    event.preventDefault();
    
    if (!checkLogin()) {
        window.location.href = 'login.html';
        return;
    }
    
    // Get product details from the clicked element
    const productElement = event.target.closest('.product');
    const productId = productElement.id;
    const productName = productElement.querySelector('p').textContent;
    const productPrice = productElement.querySelector('.product-price span').textContent;
    
    // Get current cart items
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    // Check if product already exists in cart
    const existingItem = cartItems.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({
            id: productId,
            name: productName,
            price: productPrice,
            quantity: 1
        });
    }
    
    // Save to localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    // Dispatch event for cart update
    document.dispatchEvent(new Event('cartUpdated'));
    
    // Show success message
    showNotification('Đã thêm sản phẩm vào giỏ hàng');
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Cập nhật số lượng sản phẩm trong giỏ hàng
function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) return;

    const cart = getCart();
    const product = cart.find(item => item.id === productId);
    if (product) {
        product.quantity = newQuantity;
        saveCart(cart);
        updateCartDisplay();
        updateCartCount();
    }
}

// Xóa sản phẩm khỏi giỏ hàng
function removeFromCart(productId) {
    const cart = getCart();
    const newCart = cart.filter(item => item.id !== productId);
    saveCart(newCart);
    updateCartDisplay();
    updateCartCount();
    showNotification('Đã xóa sản phẩm khỏi giỏ hàng!');
}

// Cập nhật hiển thị giỏ hàng
function updateCartDisplay() {
    const cart = getCart();
    const cartContainer = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartContainer) return;

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="text-center">Giỏ hàng trống</p>';
        if (cartTotal) cartTotal.textContent = '0đ';
        return;
    }

    let total = 0;
    cartContainer.innerHTML = cart.map(item => {
        total += item.price * item.quantity;
        return `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h5>${item.name}</h5>
                    <p class="price">${formatCurrency(item.price)}</p>
                    <div class="quantity-controls">
                        <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    }).join('');

    if (cartTotal) {
        cartTotal.textContent = formatCurrency(total);
    }
}

// Xử lý thanh toán
async function handleCheckout(event) {
    event.preventDefault();
    
    const cart = getCart();
    if (cart.length === 0) {
        showNotification('Giỏ hàng trống!', 'error');
        return;
    }

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            localStorage.setItem('redirectUrl', window.location.href);
            window.location.href = 'login.html';
            return;
        }

        const response = await fetch('http://localhost:5000/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                items: cart.map(item => ({
                    productId: item.id,
                    quantity: item.quantity
                }))
            })
        });

        if (!response.ok) {
            throw new Error('Đặt hàng thất bại');
        }

        // Xóa giỏ hàng sau khi đặt hàng thành công
        saveCart([]);
        updateCartCount();
        updateCartDisplay();
        showNotification('Đặt hàng thành công!');
        window.location.href = 'order-success.html';
    } catch (error) {
        console.error('Error:', error);
        showNotification('Có lỗi xảy ra khi đặt hàng!', 'error');
    }
}

// Format tiền tệ
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}
