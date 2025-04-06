const API_URL = 'http://localhost:5000/api';

// Khởi tạo carousel
function initCarousel() {
    const carousel = document.querySelector('#carouselExampleDark');
    if (carousel) {
        // Khởi tạo carousel với các tùy chọn
        const carouselInstance = new bootstrap.Carousel(carousel, {
            interval: 3000,
            wrap: true,
            touch: true,
            pause: false
        });

        // Tắt pause mặc định của Bootstrap
        carousel.addEventListener('mouseover', (e) => {
            e.stopPropagation();
            carouselInstance.cycle();
        });
        carousel.addEventListener('mouseout', (e) => {
            e.stopPropagation();
            carouselInstance.cycle();
        });

        // Tắt pause trên tất cả các phần tử con
        const carouselItems = carousel.querySelectorAll('.carousel-item');
        carouselItems.forEach(item => {
            item.addEventListener('mouseover', (e) => {
                e.stopPropagation();
                carouselInstance.cycle();
            });
            item.addEventListener('mouseout', (e) => {
                e.stopPropagation();
                carouselInstance.cycle();
            });
        });
    }
}

// Tải danh mục sản phẩm nổi bật
async function loadFeaturedCategories() {
    try {
        const response = await fetch(`${API_URL}/categories/featured`);
        if (!response.ok) {
            throw new Error('Không thể tải danh mục');
        }
        const categories = await response.json();
        const dropdownMenu = document.querySelector('.dropdown-menu');
        if (dropdownMenu) {
            dropdownMenu.innerHTML = categories.map(category => `
                <li><a class="dropdown-item" href="products.html?category=${category.id}">${category.name}</a></li>
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
                        <button class="btn btn-primary" onclick="addToCart('${product.id}')">
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

// Xử lý tìm kiếm
function handleSearch(event) {
    event.preventDefault();
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        window.location.href = `products.html?search=${encodeURIComponent(searchTerm)}`;
    }
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

// Khởi tạo các event listener khi DOM đã load
document.addEventListener('DOMContentLoaded', () => {
    // Khởi tạo carousel
    initCarousel();

    // Xử lý tìm kiếm
    const searchForm = document.querySelector('.search-box form');
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearch);
    }

    // Tải dữ liệu
    loadFeaturedCategories();
    loadFeaturedProducts();

    // Xử lý chuyển tab sản phẩm nổi bật
    const productNavs = document.querySelectorAll('.product-nav');
    productNavs.forEach(nav => {
        nav.addEventListener('click', async () => {
            productNavs.forEach(n => n.classList.remove('product-nav--active'));
            nav.classList.add('product-nav--active');
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
                                <button class="btn btn-primary" onclick="addToCart('${product.id}')">
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

    // Add quick view buttons
    const products = document.querySelectorAll('.product');
    products.forEach(product => {
        const productImg = product.querySelector('.product_img');
        const quickViewBtn = document.createElement('button');
        quickViewBtn.className = 'quick-view-btn';
        quickViewBtn.innerHTML = '<i class="fas fa-eye"></i> Xem nhanh';
        productImg.appendChild(quickViewBtn);

        quickViewBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = product.id;
            goToProductDetail(productId);
        });
    });

    // Add hover effects to discover images
    const discoverImages = document.querySelectorAll('.discover-img');
    discoverImages.forEach(img => {
        img.style.transition = 'transform 0.5s ease';
    });

    // Navigation active state
    let navItems = document.querySelectorAll(".second-nav-text");
    navItems.forEach(item => {
        item.addEventListener("click", function () {
            navItems.forEach(nav => nav.classList.remove("active"));
            this.classList.add("active");
        });
    });

    // Dropdown scroll
    document.querySelectorAll(".dropdown-item").forEach(item => {
        item.addEventListener("click", function (event) {
            event.preventDefault();
            let targetElement = document.getElementById('products');
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });

    // Products hot scroll
    document.getElementById("products-hot")?.addEventListener("click", function (event) {
        event.preventDefault();
        let targetElement = document.getElementById('products-highlight');
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });

    // News scroll
    document.getElementById("news")?.addEventListener("click", function (event) {
        event.preventDefault();
        let targetElement = document.getElementById('article');
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });

    // Product pagination
    let dots = document.querySelectorAll(".dot");
    let productsContainer = document.querySelector(".product-container");
    let totalProducts = document.querySelectorAll(".product-container > .col-3").length;
    let productsPerPage = 4;
    let currentPage = 0;

    dots.forEach((dot, index) => {
        dot.addEventListener("click", function () {
            dots.forEach(d => d.classList.remove("active"));
            this.classList.add("active");
            currentPage = index;
            let scrollPosition = index * productsContainer.clientWidth;
            productsContainer.scrollTo({
                left: scrollPosition,
                behavior: "smooth"
            });
        });
    });

    let totalPages = Math.ceil(totalProducts / productsPerPage);
    dots.forEach((dot, index) => {
        if (index >= totalPages) {
            dot.style.display = "none";
        }
    });
});

function goToProductDetail() {
    window.location.href = `sanphamchitiet.html`;
}
function goToHomePage() {
    window.location.href = "index.html"; // Thay bằng trang chủ của bạn
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

function addToCart(event) {
    event.preventDefault();
    if (!checkLogin()) {
        window.location.href = 'login.html';
        return;
    }
    // Thêm logic xử lý thêm vào giỏ hàng ở đây
}