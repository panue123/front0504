// Tải chi tiết sản phẩm
async function loadProductDetail(productId) {
    try {
        const response = await fetch(`${API_URL}/products/${productId}`);
        if (!response.ok) {
            throw new Error('Không thể tải chi tiết sản phẩm');
        }

        const product = await response.json();
        
        // Hiển thị thông tin sản phẩm
        document.getElementById('productName').textContent = product.name;
        document.getElementById('productPrice').textContent = formatCurrency(product.price);
        document.getElementById('productDescription').innerHTML = product.description;
        document.getElementById('productImage').src = product.image;
        document.getElementById('productImage').alt = product.name;
        
        // Hiển thị giảm giá nếu có
        const discountElement = document.getElementById('productDiscount');
        if (product.discount) {
            discountElement.textContent = `${product.discount}%`;
            discountElement.style.display = 'block';
            document.getElementById('productFinalPrice').textContent = 
                formatCurrency(product.price * (1 - product.discount/100));
        } else {
            discountElement.style.display = 'none';
            document.getElementById('productFinalPrice').textContent = formatCurrency(product.price);
        }
        
        // Hiển thị đánh giá
        displayReviews(product.reviews);
        
        // Hiển thị sản phẩm liên quan
        loadRelatedProducts(product.category);
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

// Hiển thị đánh giá sản phẩm
function displayReviews(reviews) {
    const reviewsContainer = document.getElementById('productReviews');
    if (reviewsContainer) {
        reviewsContainer.innerHTML = reviews.map(review => `
            <div class="review-item">
                <div class="review-header">
                    <div class="review-user">
                        <img src="${review.user.avatar || 'assets/img/default-avatar.png'}" alt="${review.user.fullName}" class="review-avatar">
                        <span class="review-name">${review.user.fullName}</span>
                    </div>
                    <div class="review-rating">
                        ${generateStarRating(review.rating)}
                    </div>
                </div>
                <div class="review-content">
                    <p>${review.content}</p>
                    <span class="review-date">${formatDate(review.createdAt)}</span>
                </div>
            </div>
        `).join('');
    }
}

// Tạo HTML cho đánh giá sao
function generateStarRating(rating) {
    return Array(5).fill().map((_, index) => `
        <i class="fas fa-star ${index < rating ? 'text-warning' : 'text-muted'}"></i>
    `).join('');
}

// Tải sản phẩm liên quan
async function loadRelatedProducts(category) {
    try {
        const response = await fetch(`${API_URL}/products?category=${category}&limit=4`);
        if (!response.ok) {
            throw new Error('Không thể tải sản phẩm liên quan');
        }

        const products = await response.json();
        
        const relatedContainer = document.getElementById('relatedProducts');
        if (relatedContainer) {
            relatedContainer.innerHTML = products.map(product => `
                <div class="col-3">
                    <div class="product-item">
                        <div class="product-img">
                            <img src="${product.image}" alt="${product.name}">
                        </div>
                        <div class="product-info">
                            <h5>${product.name}</h5>
                            <p class="price">${formatCurrency(product.price)}</p>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

// Xử lý thêm vào giỏ hàng
async function handleAddToCart(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const quantity = parseInt(formData.get('quantity'));
    const productId = formData.get('productId');
    
    try {
        await addToCart(productId, quantity);
        showMessage('Thêm vào giỏ hàng thành công', 'success');
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

// Xử lý đánh giá sản phẩm
async function handleReview(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const rating = parseInt(formData.get('rating'));
    const content = formData.get('content');
    const productId = formData.get('productId');
    
    try {
        const response = await fetch(`${API_URL}/products/${productId}/reviews`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ rating, content })
        });
        
        if (!response.ok) {
            throw new Error('Không thể gửi đánh giá');
        }
        
        showMessage('Cảm ơn bạn đã đánh giá sản phẩm', 'success');
        form.reset();
        loadProductDetail(productId); // Tải lại trang để hiển thị đánh giá mới
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

// Khởi tạo các event listener
document.addEventListener('DOMContentLoaded', () => {
    // Lấy ID sản phẩm từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (productId) {
        // Tải chi tiết sản phẩm
        loadProductDetail(productId);
        
        // Form thêm vào giỏ hàng
        const addToCartForm = document.getElementById('addToCartForm');
        if (addToCartForm) {
            addToCartForm.addEventListener('submit', handleAddToCart);
        }
        
        // Form đánh giá sản phẩm
        const reviewForm = document.getElementById('reviewForm');
        if (reviewForm) {
            reviewForm.addEventListener('submit', handleReview);
        }
    }
}); 