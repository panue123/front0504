document.addEventListener("DOMContentLoaded", function () {
    const categoryTable = document.getElementById("category-list");

    //Các phần tử sửa danh mục
    const overlayEditCategory = document.getElementById("overlay-edit-category");
    const popupEditCategory = document.getElementById("popup-edit-category");
    const cancelEditCategoryBtn = document.getElementById("cancelEditCategory");
    const editCategoryNameInput = document.getElementById("editCategoryName");
    const editCategoryForm = document.getElementById("editCategoryForm");

    //Các phần tử xóa danh mục
    const overlayDeleteCategory = document.getElementById("overlay-delete-category");
    const popupDeleteCategory = document.getElementById("confirm-delete-popup");
    const deleteCategoryForm = document.getElementById("deleteCategoryForm");
    const confirmDeleteCategory = document.getElementById("confirmDeleteCategory");
    const cancelDeleteCategory = document.getElementById("cancelDeleteCategory");

    // Khởi tạo các biến
    let currentCategoryId = null;
    let selectedProducts = new Set();

    // Hàm đóng/mở popup chung
    function togglePopup(popup, overlay, isOpen) {
        overlay.style.display = isOpen ? "block" : "none";
        popup.style.display = isOpen ? "block" : "none";
    }

    // Lấy danh sách danh mục từ API 
    async function loadCategories() {
        try {
            const response = await fetch("http://localhost:5000/api/categories");
            if (!response.ok) throw new Error("⚠ Không thể tải danh mục!");

            const categories = await response.json();
            categoryTable.innerHTML = "";
            if (!Array.isArray(categories) || categories.length === 0) {
                categoryTable.innerHTML = `<tr><td colspan="3">Không có danh mục nào.</td></tr>`;
                return;
            }

            categories.forEach((category, index) => addCategoryRow(category, index));
        } catch (error) {
            console.error("❌ Lỗi khi tải danh mục:", error);
            alert(error.message);
        }
    }

    //  Thêm một hàng danh mục vào bảng 
    function addCategoryRow(category, index) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${category.name}</td>
            <td>
                <button class="btn view" data-id="${category.id}" data-action="view">👁 Xem sản phẩm</button>
                <button class="btn edit" data-id="${category.id}" data-name="${category.name}" data-action="edit">✏️ Sửa</button>
                <button class="btn delete" data-id="${category.id}" data-action="delete">🗑️ Xóa</button>
                <button class="btn add" data-id="${category.id}" data-action="add-product">➕ Thêm sản phẩm</button>
            </td>
        `;
        categoryTable.appendChild(row);
    }
    
    // Xử lý sự kiện trên bảng danh mục 
    categoryTable.addEventListener("click", function (event) {
        const button = event.target.closest("button");
        if (!button) return;

        const action = button.dataset.action;
        const categoryId = button.dataset.id;
        const categoryName = button.dataset.name;

        if (action === "edit") {
            openEditCategoryPopup(categoryId, categoryName);
        } else if (action === "delete") {
            openDeleteCategoryPopup(categoryId);
        } else if (action === "view") {
            viewProducts(categoryId);
        } else if (action === "add-product") {
            addProductToCategory(categoryId);
        }
    });

    // Mở popup sửa danh mục 
    function openEditCategoryPopup(categoryId, categoryName) {
        editCategoryNameInput.value = categoryName;
        popupEditCategory.setAttribute("data-id", categoryId);
        togglePopup(popupEditCategory, overlayEditCategory, true);
    }

    // Xử lý lưu thay đổi danh mục 
    editCategoryForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const categoryId = popupEditCategory.getAttribute("data-id");
        const newName = editCategoryNameInput.value.trim();

        if (!newName) {
            alert("❌ Vui lòng nhập tên danh mục mới!");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/categories/${categoryId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newName })
            });

            if (!response.ok) {
                alert("⚠ Lỗi khi cập nhật danh mục!");
                return;
            }

            alert("🎉 Cập nhật danh mục thành công!");
            closeEditCategoryPopup();
            loadCategories();
        } catch (error) {
            console.error("❌ Lỗi khi gửi request:", error);
            alert("⚠ Không thể cập nhật danh mục! Kiểm tra console để biết thêm chi tiết.");
        }
    });

    // Đóng popup sửa danh mục
    function closeEditCategoryPopup() {
        togglePopup(popupEditCategory, overlayEditCategory, false);
    }
    cancelEditCategoryBtn.addEventListener("click", closeEditCategoryPopup);

    // Mở popup xóa danh mục
    function openDeleteCategoryPopup(categoryId) {
        popupDeleteCategory.setAttribute("data-id", categoryId);
        togglePopup(popupDeleteCategory, overlayDeleteCategory, true);
    }
    
    // Hàm xóa danh mục
    document.getElementById("confirmDeleteCategory").addEventListener("click", async function () {       
        // Lấy categoryId từ popup
        const categoryId = popupDeleteCategory.getAttribute("data-id");
    
        try {
            const response = await fetch(`http://localhost:5000/api/categories/${categoryId}`, {
                method: "DELETE",
            });
    
            if (!response.ok) {
                alert("⚠ Lỗi khi xóa danh mục!");
                return;
            }
    
            alert("🗑️ Danh mục đã được xóa thành công!");
            closeDeleteCategoryPopup();  // Đóng popup xóa
            loadCategories();  // Tải lại danh mục sau khi xóa
        } catch (error) {
            console.error("❌ Lỗi khi gửi request:", error);
            alert("⚠ Không thể xóa danh mục! Kiểm tra console để biết thêm chi tiết.");
        }
    });
    
    // Hàm đóng popup xóa
    function closeDeleteCategoryPopup() {
        togglePopup(popupDeleteCategory, overlayDeleteCategory, false);
    }
    cancelDeleteCategory.addEventListener("click", closeDeleteCategoryPopup);

    // Hàm lấy danh sách sản phẩm từ API
    async function fetchProducts() {
        try {
            const response = await fetch('http://localhost:5000/api/products');
            const products = await response.json();
            return products;
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    }

    // Hàm lấy sản phẩm theo danh mục
    async function fetchProductsByCategory(categoryId) {
        try {
            const response = await fetch(`http://localhost:5000/api/categories/${categoryId}/products`);
            const products = await response.json();
            return products;
        } catch (error) {
            console.error('Error fetching products by category:', error);
            return [];
        }
    }

    // Hàm thêm sản phẩm vào danh mục
    async function addProductToCategory(categoryId, productId) {
        try {
            const response = await fetch(`http://localhost:5000/api/categories/${categoryId}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ productId })
            });
            return response.ok;
        } catch (error) {
            console.error('Error adding product to category:', error);
            return false;
        }
    }

    // Hàm xóa sản phẩm khỏi danh mục
    async function removeProductFromCategory(categoryId, productId) {
        try {
            const response = await fetch(`http://localhost:5000/api/categories/${categoryId}/products/${productId}`, {
                method: 'DELETE'
            });
            return response.ok;
        } catch (error) {
            console.error('Error removing product from category:', error);
            return false;
        }
    }

    // Hàm hiển thị popup thêm sản phẩm
    async function showAddProductPopup(categoryId) {
        currentCategoryId = categoryId;
        const products = await fetchProducts();
        const productSelect = document.getElementById('productSelect');
        const selectedProductsList = document.getElementById('selectedProducts');
        
        // Xóa các options cũ
        productSelect.innerHTML = '<option value="">-- Chọn sản phẩm --</option>';
        selectedProductsList.innerHTML = '';
        selectedProducts.clear();

        // Thêm các options mới
        products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.id;
            option.textContent = product.name;
            productSelect.appendChild(option);
        });

        // Hiển thị popup
        document.getElementById('overlay-add-product').style.display = 'block';
        document.getElementById('popup-add-product-category').style.display = 'block';
    }

    // Hàm hiển thị popup xem sản phẩm
    async function showViewProductsPopup(categoryId) {
        currentCategoryId = categoryId;
        const products = await fetchProductsByCategory(categoryId);
        const productList = document.getElementById('productList');
        
        // Xóa danh sách cũ
        productList.innerHTML = '';

        // Thêm danh sách mới
        products.forEach(product => {
            const productItem = document.createElement('div');
            productItem.className = 'product-item';
            productItem.innerHTML = `
                <input type="checkbox" value="${product.id}">
                <span>${product.name}</span>
            `;
            productList.appendChild(productItem);
        });

        // Hiển thị popup
        document.getElementById('overlay-view-product').style.display = 'block';
        document.getElementById('popup-view-product').style.display = 'block';
    }

    // Event Listeners
    document.addEventListener('DOMContentLoaded', () => {
        // Xử lý thêm sản phẩm vào danh mục
        const addProductBtn = document.getElementById('addProductBtn');
        const productSelect = document.getElementById('productSelect');
        const selectedProductsList = document.getElementById('selectedProducts');
        const addProductToCategoryForm = document.getElementById('addProductToCategoryForm');

        addProductBtn.addEventListener('click', () => {
            const productId = productSelect.value;
            if (productId && !selectedProducts.has(productId)) {
                selectedProducts.add(productId);
                const li = document.createElement('li');
                li.textContent = productSelect.options[productSelect.selectedIndex].text;
                li.dataset.productId = productId;
                selectedProductsList.appendChild(li);
                productSelect.value = '';
            }
        });

        addProductToCategoryForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (currentCategoryId && selectedProducts.size > 0) {
                for (const productId of selectedProducts) {
                    await addProductToCategory(currentCategoryId, productId);
                }
                alert('Thêm sản phẩm thành công!');
                closeAddProductPopup();
            }
        });

        // Xử lý xem sản phẩm trong danh mục
        const removeProductBtn = document.getElementById('removeProductBtn');
        const clearSelectionBtn = document.getElementById('clearSelectionBtn');

        removeProductBtn.addEventListener('click', async () => {
            const checkboxes = document.querySelectorAll('#productList input[type="checkbox"]:checked');
            for (const checkbox of checkboxes) {
                const productId = checkbox.value;
                await removeProductFromCategory(currentCategoryId, productId);
            }
            showViewProductsPopup(currentCategoryId); // Refresh danh sách
        });

        clearSelectionBtn.addEventListener('click', () => {
            const checkboxes = document.querySelectorAll('#productList input[type="checkbox"]');
            checkboxes.forEach(checkbox => checkbox.checked = false);
        });
    });

    // Hàm đóng popup thêm sản phẩm
    function closeAddProductPopup() {
        document.getElementById('overlay-add-product').style.display = 'none';
        document.getElementById('popup-add-product-category').style.display = 'none';
    }

    // Hàm đóng popup xem sản phẩm
    function closeViewProductsPopup() {
        document.getElementById('overlay-view-product').style.display = 'none';
        document.getElementById('popup-view-product').style.display = 'none';
    }

    // Thêm event listeners cho nút đóng popup
    document.getElementById('cancelAddProduct').addEventListener('click', closeAddProductPopup);
    document.getElementById('cancelViewProduct').addEventListener('click', closeViewProductsPopup);

    // Load danh mục khi trang được tải
    loadCategories();
});


//     /** 🏷 Xem sản phẩm trong danh mục */
//     async function viewProducts(categoryId) {
//         try {
//             const response = await fetch(`http://localhost:5000/api/categories/${categoryId}/products`);
//             if (!response.ok) throw new Error("⚠ Không thể tải sản phẩm!");

//             const products = await response.json();
//             alert(`📌 Sản phẩm trong danh mục: ${products.map(p => p.name).join(", ") || "Không có sản phẩm."}`);
//         } catch (error) {
//             console.error("❌ Lỗi tải sản phẩm:", error);
//             alert("⚠ Không thể tải sản phẩm!");
//         }
//     }
