// Kiểm tra quyền admin
// document.addEventListener('DOMContentLoaded', async () => {
//     const token = localStorage.getItem('token');
//     const user = JSON.parse(localStorage.getItem('user') || '{}');

//     if (!token || user.role !== 'admin') {
//         window.location.href = 'login.html';
//         return;
//     }

//     // Load danh sách danh mục
//     await loadCategories();
    
//     // Khởi tạo các event listeners
//     initializeEventListeners();
// });

document.addEventListener("DOMContentLoaded", function () {
    // Khai báo các phần tử DOM
    const categoryTable = document.getElementById("category-list");
    
    //Các phần tử xử lý thêm mới danh mục
    const overlayAddCategory = document.getElementById("overlay-add-category");
    const popupAddCategory = document.getElementById("popup-add-category");
    const openPopupAddCategoryBtn = document.getElementById("openAddCategory");
    const cancelAddCategoryBtn = document.getElementById("cancelAddCategory");
    const addCategoryForm = document.getElementById("addCategoryForm");
    const categoryNameInput = document.getElementById("categoryName");
    const categoryDescriptionInput = document.getElementById("categoryDescription");

    //Các phần tử sửa danh mục
    const overlayEditCategory = document.getElementById("overlay-edit-category");
    const popupEditCategory = document.getElementById("popup-edit-category");
    const cancelEditCategoryBtn = document.getElementById("cancelEditCategory");
    const editCategoryNameInput = document.getElementById("editCategoryName");
    const editCategoryDescriptionInput = document.getElementById("editCategoryDescription");
    const editCategoryForm = document.getElementById("editCategoryForm");

    //Các phần tử xóa danh mục
    const overlayDeleteCategory = document.getElementById("overlay-delete-category");
    const popupDeleteCategory = document.getElementById("confirm-delete-popup");
    const confirmDeleteCategory = document.getElementById("confirmDeleteCategory");
    const cancelDeleteCategory = document.getElementById("cancelDeleteCategory");

    // Khởi tạo các biến
    let currentCategoryId = null;

    // Hàm đóng/mở popup chung
    function togglePopup(popup, overlay, isOpen) {
        overlay.style.display = isOpen ? "block" : "none";
        popup.style.display = isOpen ? "block" : "none";
    }

    // Lấy danh sách danh mục từ API 
    async function loadCategories() {
        try {
            const response = await fetch("http://localhost:5000/api/categories", {
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error("⚠ Không thể tải danh mục!");
            }

            const categories = await response.json();
            categoryTable.innerHTML = "";
            
            if (!Array.isArray(categories) || categories.length === 0) {
                categoryTable.innerHTML = `<tr><td colspan="4">Không có danh mục nào.</td></tr>`;
                return;
            }

            categories.forEach((category, index) => addCategoryRow(category, index));
        } catch (error) {
            console.error("❌ Lỗi khi tải danh mục:", error);
            showNotification(error.message, 'error');
        }
    }

    // Thêm một hàng danh mục vào bảng 
    function addCategoryRow(category, index) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${category.name}</td>
            <td>${category.description || ''}</td>
            <td>
                <button class="btn view" data-id="${category.id}" data-action="view">👁 Xem sản phẩm</button>
                <button class="btn edit" data-id="${category.id}" data-name="${category.name}" data-description="${category.description || ''}" data-action="edit">✏️ Sửa</button>
                <button class="btn delete" data-id="${category.id}" data-action="delete">🗑️ Xóa</button>
            </td>
        `;
        categoryTable.appendChild(row);
    }
    
    // Mở popup thêm danh mục 
    function openAddCategoryPopup() {
        togglePopup(popupAddCategory, overlayAddCategory, true);
    }
    openPopupAddCategoryBtn.addEventListener("click", () => openAddCategoryPopup());

    // Xử lý thêm danh mục
    if (addCategoryForm) {
        addCategoryForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const name = categoryNameInput.value.trim();
            const description = categoryDescriptionInput.value.trim();
            
            if (!name) {
                showNotification("❌ Vui lòng nhập tên danh mục!", 'error');
                return;
            }

            try {
                const response = await fetch("http://localhost:5000/api/categories", {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({ name, description })
                });

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.message || "Lỗi khi thêm danh mục!");
                }

                showNotification("🎉 Danh mục đã được thêm thành công!");
                closeAddCategoryPopup();
                categoryNameInput.value = "";
                categoryDescriptionInput.value = "";
                loadCategories();
            } catch (error) {
                console.error("❌ Lỗi khi gửi request:", error);
                showNotification(error.message, 'error');
            }
        });
    }

    // Đóng popup thêm danh mục
    function closeAddCategoryPopup() {
        togglePopup(popupAddCategory, overlayAddCategory, false);
    }
    cancelAddCategoryBtn.addEventListener("click", () => closeAddCategoryPopup());

    // Mở popup sửa danh mục
    function openEditCategoryPopup(categoryId, categoryName, categoryDescription) {
        currentCategoryId = categoryId;
        editCategoryNameInput.value = categoryName;
        editCategoryDescriptionInput.value = categoryDescription || '';
        togglePopup(popupEditCategory, overlayEditCategory, true);
    }

    // Xử lý sửa danh mục
    if (editCategoryForm) {
        editCategoryForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const name = editCategoryNameInput.value.trim();
            const description = editCategoryDescriptionInput.value.trim();

            if (!name) {
                showNotification("❌ Vui lòng nhập tên danh mục!", 'error');
                return;
            }

            try {
                const response = await fetch(`http://localhost:5000/api/categories/${currentCategoryId}`, {
                    method: "PUT",
                    headers: { 
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({ name, description })
                });

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.message || "Lỗi khi cập nhật danh mục!");
                }

                showNotification("🎉 Cập nhật danh mục thành công!");
                closeEditCategoryPopup();
                loadCategories();
            } catch (error) {
                console.error("❌ Lỗi khi gửi request:", error);
                showNotification(error.message, 'error');
            }
        });
    }

    // Đóng popup sửa danh mục
    function closeEditCategoryPopup() {
        togglePopup(popupEditCategory, overlayEditCategory, false);
    }
    cancelEditCategoryBtn.addEventListener("click", closeEditCategoryPopup);

    // Mở popup xóa danh mục
    function openDeleteCategoryPopup(categoryId) {
        currentCategoryId = categoryId;
        togglePopup(popupDeleteCategory, overlayDeleteCategory, true);
    }

    // Xử lý xóa danh mục
    confirmDeleteCategory.addEventListener("click", async function () {
        try {
            const response = await fetch(`http://localhost:5000/api/categories/${currentCategoryId}`, {
                method: "DELETE",
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Lỗi khi xóa danh mục!");
            }

            showNotification("🎉 Đã xóa danh mục thành công!");
            closeDeleteCategoryPopup();
            loadCategories();
        } catch (error) {
            console.error("❌ Lỗi:", error);
            showNotification(error.message, 'error');
        }
    });

    // Đóng popup xóa danh mục
    function closeDeleteCategoryPopup() {
        togglePopup(popupDeleteCategory, overlayDeleteCategory, false);
    }
    cancelDeleteCategory.addEventListener("click", closeDeleteCategoryPopup);

    // Xử lý sự kiện trên bảng danh mục 
    categoryTable.addEventListener("click", function (event) {
        const button = event.target.closest("button");
        if (!button) return;

        const action = button.dataset.action;
        const categoryId = button.dataset.id;
        const categoryName = button.dataset.name;
        const categoryDescription = button.dataset.description;

        if (action === "edit") {
            openEditCategoryPopup(categoryId, categoryName, categoryDescription);
        } else if (action === "delete") {
            openDeleteCategoryPopup(categoryId);
        } else if (action === "view") {
            window.location.href = `admin-product.html?category=${categoryId}`;
        }
    });

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

    // Load danh mục khi trang được tải
    loadCategories();
});

// Format tiền tệ
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

// Đăng xuất
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}
