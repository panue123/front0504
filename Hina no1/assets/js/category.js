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
}); 