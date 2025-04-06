const API_URL = 'http://localhost:5000/api';

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

// Khởi tạo carousel
function initCarousel() {
    const carousel = document.getElementById('carouselExampleDark');
    if (carousel) {
        const carouselInstance = new bootstrap.Carousel(carousel, {
            interval: 4000,
            wrap: true,
            touch: true,
            pause: false
        });

        // Disable pause on hover
        carousel.setAttribute('data-bs-pause', 'false');
        const items = carousel.querySelectorAll('.carousel-item');
        items.forEach(item => {
            item.setAttribute('data-bs-pause', 'false');
        });
    }
}

// Scroll to top function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Scroll to section function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const sectionTop = section.offsetTop - headerHeight;
        window.scrollTo({
            top: sectionTop,
            behavior: 'smooth'
        });
    }
}

// Update active nav link based on scroll position
function updateActiveNavLink() {
    const sections = ['products', 'products-highlight', 'about'];
    const navLinks = document.querySelectorAll('.nav-link');
    const headerHeight = document.querySelector('.header').offsetHeight;
    const scrollPosition = window.scrollY + headerHeight + 50; // Add some offset

    // If at top of page, set home as active
    if (scrollPosition < 100) {
        navLinks.forEach(link => link.classList.remove('active'));
        navLinks[0].classList.add('active');
        return;
    }

    sections.forEach((sectionId, index) => {
        const section = document.getElementById(sectionId);
        if (section) {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                navLinks.forEach(link => link.classList.remove('active'));
                navLinks[index + 1].classList.add('active');
            }
        }
    });
}

// Add scroll event listener
document.addEventListener('scroll', updateActiveNavLink);

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

    // Update active nav link on page load
    updateActiveNavLink();
    
    // Handle hash links on page load
    if (window.location.hash) {
        const sectionId = window.location.hash.substring(1);
        setTimeout(() => {
            scrollToSection(sectionId);
        }, 100);
    }
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

// Sample product data
const products = [
    {
        id: 1,
        name: "Kem Dưỡng Body Trẻ Hóa Da Toàn Thân Image BODY SPA Rejuvenating Body Lotion",
        image: "./assets/img/product.png",
        oldPrice: 1400000,
        currentPrice: 1190000,
        discount: 15
    },
    {
        id: 2,
        name: "Kem Dưỡng Da Mặt Chống Lão Hóa Image AGELESS Total Repair Crème",
        image: "./assets/img/product2.png",
        oldPrice: 2500000,
        currentPrice: 2160000,
        discount: 14
    },
    {
        id: 3,
        name: "Kem Dưỡng Da Mặt Phục Hồi Da Image Irescue Post Treatment Recovery Balm",
        image: "./assets/img/product3.png",
        oldPrice: 2100000,
        currentPrice: 1760000,
        discount: 16
    },
    {
        id: 4,
        name: "Kem Dưỡng Da Mặt Phục Hồi và Chống Lão Hóa Image MD Restoring Youth Repair Creme",
        image: "./assets/img/product4.png",
        oldPrice: 3400000,
        currentPrice: 2930000,
        discount: 14
    }
];

// Format price to VND
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', { 
        style: 'currency', 
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
}

// Create product HTML
function createProductHTML(product) {
    return `
        <div class="col-3" id="product-${product.id}">
            <div class="product-item">
                <div class="product-sale">
                    <span>${product.discount}%</span>
                </div>
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    <button class="btn-quick-view" onclick="openQuickView(${product.id})" data-bs-toggle="modal" data-bs-target="#quickViewModal">
                        Xem nhanh <i class="fas fa-eye ms-1"></i>
                    </button>
                </div>
                <div class="product-info">
                    <p class="product-name">${product.name}</p>
                    <div class="product-price">
                        <span class="old-price">${formatPrice(product.oldPrice)}</span>
                        <span class="current-price">${formatPrice(product.currentPrice)}</span>
                    </div>
                    <button class="btn-add-cart" onclick="addToCart(${product.id})">
                        Thêm vào giỏ
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Load products
function loadProducts() {
    const productList = document.getElementById('productList');
    if (productList) {
        productList.innerHTML = products.map(product => createProductHTML(product)).join('');
    }

    // Also load featured products
    const featuredProductList = document.getElementById('featuredProductList');
    if (featuredProductList) {
        featuredProductList.innerHTML = products.map(product => createProductHTML(product)).join('');
    }
}

// Quick view functionality
function openQuickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Update modal content
    document.getElementById('quickViewImage').src = product.image;
    document.getElementById('quickViewName').textContent = product.name;
    document.querySelector('#quickViewModal .old-price').textContent = formatPrice(product.oldPrice);
    document.querySelector('#quickViewModal .current-price').textContent = formatPrice(product.currentPrice);
    document.getElementById('quickViewQuantity').value = 1;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();

    // Quantity buttons
    const quantityInput = document.getElementById('quickViewQuantity');
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');

    if (minusBtn && quantityInput) {
        minusBtn.addEventListener('click', () => {
            const currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });
    }

    if (plusBtn && quantityInput) {
        plusBtn.addEventListener('click', () => {
            const currentValue = parseInt(quantityInput.value);
            quantityInput.value = currentValue + 1;
        });
    }
});

// Add to cart function
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    alert(`Đã thêm ${product.name} vào giỏ hàng`);
}

// View product detail function
function viewProductDetail(productId) {
    window.location.href = `product-detail.html?id=${productId}`;
}