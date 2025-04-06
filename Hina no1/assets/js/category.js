// Tải danh mục cho user (hiển thị ở trang chủ)
async function loadCategoriesForUser() {
    try {
        const response = await fetch(`${API_URL}/categories`);
        if (!response.ok) throw new Error('Không thể tải danh mục');
        
        const categories = await response.json();
        
        // Hiển thị danh mục dạng grid
        const categoryGrid = document.getElementById('categoryGrid');
        if (categoryGrid) {
            categoryGrid.innerHTML = categories.map(category => `
                <div class="category-card">
                    <div class="category-image">
                        <img src="${category.image}" alt="${category.name}">
                    </div>
                    <div class="category-info">
                        <h3>${category.name}</h3>
                        <p>${category.description}</p>
                        <a href="products.html?category=${category.id}" class="btn btn-primary">
                            Xem sản phẩm
                        </a>
                    </div>
                </div>
            `).join('');
        }

        // Hiển thị danh mục trong menu
        const categoryMenu = document.getElementById('categoryMenu');
        if (categoryMenu) {
            categoryMenu.innerHTML = categories.map(category => `
                <li class="nav-item">
                    <a class="nav-link" href="products.html?category=${category.id}">
                        ${category.name}
                    </a>
                </li>
            `).join('');
        }
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

// Tải danh mục cho trang sản phẩm
async function loadCategoriesForProducts() {
    try {
        const response = await fetch(`${API_URL}/categories`);
        if (!response.ok) throw new Error('Không thể tải danh mục');
        
        const categories = await response.json();
        
        // Hiển thị filter danh mục
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.innerHTML = `
                <div class="category-filter">
                    <h4>Danh mục</h4>
                    <div class="list-group">
                        <a href="products.html" class="list-group-item list-group-item-action ${
                            !getUrlParam('category') ? 'active' : ''
                        }">
                            Tất cả
                        </a>
                        ${categories.map(category => `
                            <a href="products.html?category=${category.id}" 
                               class="list-group-item list-group-item-action ${
                                   getUrlParam('category') == category.id ? 'active' : ''
                               }">
                                ${category.name}
                            </a>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

// Lấy category ID từ URL
function getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Hiển thị danh mục trong footer
function renderFooterCategories(categories) {
    const footerCategories = document.getElementById('footer-categories');
    if (!footerCategories) return;

    // Xóa nội dung cũ
    footerCategories.innerHTML = '';

    // Thêm các danh mục mới
    categories.forEach(category => {
        const p = document.createElement('p');
        const a = document.createElement('a');
        a.href = `products.html?category=${category.id}`;
        a.textContent = category.name;
        p.appendChild(a);
        footerCategories.appendChild(p);
    });
}

// Tải danh mục sản phẩm từ backend
async function loadCategories() {
    try {
        const response = await fetch('http://localhost:5000/api/categories', {
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Không thể tải danh mục sản phẩm');
        }

        const categories = await response.json();
        renderCategories(categories);
        renderFooterCategories(categories);
    } catch (error) {
        console.error('Lỗi khi tải danh mục:', error);
        showNotification('Không thể tải danh mục sản phẩm', 'error');
    }
}

// Hiển thị danh mục sản phẩm
function renderCategories(categories) {
    const dropdownMenu = document.querySelector('.dropdown-menu');
    if (!dropdownMenu) return;

    // Xóa nội dung cũ
    dropdownMenu.innerHTML = '';

    // Thêm các danh mục mới
    categories.forEach(category => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.className = 'dropdown-item';
        a.href = `products.html?category=${category.id}`;
        a.textContent = category.name;
        li.appendChild(a);
        dropdownMenu.appendChild(li);
    });
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

// Khởi tạo các event listener
document.addEventListener('DOMContentLoaded', () => {
    // Tải danh mục cho trang chủ
    if (document.getElementById('categoryGrid')) {
        loadCategoriesForUser();
    }
    
    // Tải danh mục cho trang sản phẩm
    if (document.getElementById('categoryFilter')) {
        loadCategoriesForProducts();
    }

    // Tải danh mục khi trang được tải
    loadCategories();
}); 