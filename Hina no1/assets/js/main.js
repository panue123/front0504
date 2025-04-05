const API_URL = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', () => {
    // Khởi tạo các event listeners
    initializeEventListeners();
    
    // Cập nhật UI dựa trên trạng thái đăng nhập (nếu có)
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    updateLoginStatus(token, user);

    // Tải dữ liệu
    loadFeaturedCategories();
    loadFeaturedProducts();
    loadLatestArticles();
});

// Tải danh mục sản phẩm nổi bật
async function loadFeaturedCategories() {
    try {
        const response = await fetch(`${API_URL}/categories/featured`);
        if (!response.ok) {
            throw new Error('Không thể tải danh mục');
        }

        const categories = await response.json();
        const categoriesContainer = document.querySelector('.discover .row:first-child');
        
        if (categoriesContainer) {
            categoriesContainer.innerHTML = categories.map(category => `
                <div class="col-3 px-0">
                    <a href="products.html?category=${category.id}">
                        <img src="${category.image}" class="discover-img" alt="${category.name}">
                    </a>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Lỗi tải danh mục:', error);
    }
}

// Tải sản phẩm nổi bật
async function loadFeaturedProducts() {
    try {
        const response = await fetch(`${API_URL}/products/featured`);
        if (!response.ok) {
            throw new Error('Không thể tải sản phẩm');
        }

        const products = await response.json();
        const productsContainer = document.querySelector('.product-container');
        
        if (productsContainer) {
            productsContainer.innerHTML = products.map(product => `
                <div class="col-3">
                    <div class="row product-sale">
                        ${product.discount ? `<span>${product.discount}%</span>` : ''}
                    </div>
                    <div class="row mb-1">
                        <div class="product_img">
                            <img src="${product.image}" alt="${product.name}" class="">
                        </div>
                    </div>
                    <div class="row product-info mb-1">
                        <p onclick="goToProductDetail('${product.id}')">
                            ${product.name}
                        </p>
                    </div>
                    <div class="row product-price">
                        ${product.discount ? 
                            `<span>${formatCurrency(product.price)} chi còn ${formatCurrency(product.price * (1 - product.discount/100))}</span>` :
                            `<span>${formatCurrency(product.price)}</span>`
                        }
                    </div>
                    <div class="row mt-2">
                        <button class="btn btn-primary add-to-cart" data-product-id="${product.id}">
                            Thêm vào giỏ hàng
                        </button>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Lỗi tải sản phẩm:', error);
    }
}

// Tải bài viết mới nhất
async function loadLatestArticles() {
    try {
        const response = await fetch(`${API_URL}/articles/latest`);
        if (!response.ok) {
            throw new Error('Không thể tải bài viết');
        }

        const articles = await response.json();
        const articlesContainer = document.querySelector('.blog-content-news');
        
        if (articlesContainer) {
            articlesContainer.innerHTML = articles.map(article => `
                <div class="col blog-content-news-item">
                    <div class="row blog-content-news-item-img">
                        <img src="${article.image}" alt="${article.title}" class="">
                    </div>
                    <div class="row blog-content-news-item-title mt-2">${article.title}</div>
                    <div class="row blog-content-news-item-btn mt-3">
                        <a href="article.html?id=${article.id}" class="col">Xem thêm</a>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Lỗi tải bài viết:', error);
    }
}

// Cập nhật UI dựa trên trạng thái đăng nhập
function updateLoginStatus(token, user) {
    const userDropdown = document.getElementById('userDropdown');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (userDropdown) {
        if (token && user) {
            // Đã đăng nhập
            userDropdown.innerHTML = `
                <i class="fa-regular fa-user"></i>
                <span class="ms-1">${user.username}</span>
            `;
        } else {
            // Chưa đăng nhập
            userDropdown.innerHTML = '<i class="fa-regular fa-user"></i>';
        }
    }
    
    if (logoutBtn) {
        logoutBtn.style.display = token && user ? 'block' : 'none';
    }
}

// Khởi tạo các event listeners
function initializeEventListeners() {
    // Xử lý đăng xuất
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }

    // Xử lý tìm kiếm
    const searchInput = document.getElementById('searchInput');
    const searchIcon = document.querySelector('.nav-search-icon i');
    
    if (searchInput) {
        // Xử lý khi nhấn Enter
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }

    // Xử lý khi click vào icon tìm kiếm
    if (searchIcon) {
        searchIcon.addEventListener('click', handleSearch);
    }

    // Xử lý thêm vào giỏ hàng
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            e.preventDefault();
            const productId = e.target.dataset.productId;
            addToCart(productId);
        }
    });

    // Xử lý chuyển tab sản phẩm nổi bật
    const productNavs = document.querySelectorAll('.product-nav');
    productNavs.forEach(nav => {
        nav.addEventListener('click', async () => {
            // Xóa active class từ tất cả các nav
            productNavs.forEach(n => n.classList.remove('product-nav--active'));
            // Thêm active class cho nav được click
            nav.classList.add('product-nav--active');

            // Tải sản phẩm theo danh mục
            const category = nav.textContent.trim();
            try {
                const response = await fetch(`${API_URL}/products?category=${encodeURIComponent(category)}`);
                if (!response.ok) {
                    throw new Error('Không thể tải sản phẩm');
                }

                const products = await response.json();
                const productsContainer = document.querySelector('.product-container');
                
                if (productsContainer) {
                    productsContainer.innerHTML = products.map(product => `
                        <div class="col-3">
                            <div class="row product-sale">
                                ${product.discount ? `<span>${product.discount}%</span>` : ''}
                            </div>
                            <div class="row mb-1">
                                <div class="product_img">
                                    <img src="${product.image}" alt="${product.name}" class="">
                                </div>
                            </div>
                            <div class="row product-info mb-1">
                                <p onclick="goToProductDetail('${product.id}')">
                                    ${product.name}
                                </p>
                            </div>
                            <div class="row product-price">
                                ${product.discount ? 
                                    `<span>${formatCurrency(product.price)} chi còn ${formatCurrency(product.price * (1 - product.discount/100))}</span>` :
                                    `<span>${formatCurrency(product.price)}</span>`
                                }
                            </div>
                            <div class="row mt-2">
                                <button class="btn btn-primary add-to-cart" data-product-id="${product.id}">
                                    Thêm vào giỏ hàng
                                </button>
                            </div>
                        </div>
                    `).join('');
                }
            } catch (error) {
                console.error('Lỗi tải sản phẩm:', error);
            }
        });
    });

    // Xử lý active menu
    let navItems = document.querySelectorAll(".second-nav-text");
    navItems.forEach(item => {
        item.addEventListener("click", function () {
            navItems.forEach(nav => nav.classList.remove("active"));
            this.classList.add("active");
        });
    });

    // Xử lý cuộn trang mượt
    document.querySelectorAll(".dropdown-item").forEach(item => {
        item.addEventListener("click", function (event) {
            event.preventDefault();
            let targetElement = document.getElementById('products');
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });

    // Xử lý cuộn đến sản phẩm nổi bật
    document.getElementById("products-hot")?.addEventListener("click", function (event) {
        event.preventDefault();
        let targetElement = document.getElementById('products-highlight');
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });

    // Xử lý cuộn đến tin tức
    document.getElementById("news")?.addEventListener("click", function (event) {
        event.preventDefault();
        let targetElement = document.getElementById('article');
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });
}

// Xử lý tìm kiếm
function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        const query = searchInput.value.trim();
        if (query) {
            localStorage.setItem('searchQuery', query);
            window.location.href = `products.html?search=${encodeURIComponent(query)}`;
        } else {
            showNotification('Vui lòng nhập từ khóa tìm kiếm', 'warning');
        }
    }
}

// Thêm vào giỏ hàng
async function addToCart(productId) {
    const token = localStorage.getItem('token');
    
    if (!token) {
        showNotification('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }

    try {
        const response = await fetch(`${API_URL}/cart/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                productId,
                quantity: 1
            })
        });

        if (!response.ok) {
            throw new Error('Không thể thêm sản phẩm vào giỏ hàng');
        }

        updateCartCount();
        showNotification('Đã thêm sản phẩm vào giỏ hàng!', 'success');
    } catch (error) {
        console.error('Error:', error);
        showNotification(error.message, 'error');
    }
}

// Cập nhật số lượng sản phẩm trong giỏ hàng
async function updateCartCount() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const response = await fetch(`${API_URL}/cart`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Không thể lấy thông tin giỏ hàng');
        }

        const cart = await response.json();
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            cartCount.textContent = cart.items.length;
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Đăng xuất
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
}

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

// Chuyển đến trang chi tiết sản phẩm
function goToProductDetail(productId) {
    window.location.href = `product-detail.html?id=${productId}`;
}

// Định dạng tiền tệ
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
} 