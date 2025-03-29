document.addEventListener("DOMContentLoaded", function () {
    const categoryTable = document.getElementById("category-list");
    
    //Các phần tử xử lý thêm mới danh mục
    const overlayAddCategory = document.getElementById("overlay-add-category");
    const popupAddCategory = document.getElementById("popup-add-category");
    const openPopupAddCategoryBtn = document.getElementById("openAddCategory");
    const cancelAddCategoryBtn = document.getElementById("cancelAddCategory");
    const addCategoryForm = document.getElementById("addCategoryForm");
    const categoryNameInput = document.getElementById("categoryName");

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
            if (!name) {
                alert("❌ Vui lòng nhập tên danh mục!");
                return;
            }

            try {
                const response = await fetch("http://localhost:5000/api/categories", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name })
                });

                if (!response.ok) {
                    const data = await response.json();
                    alert(data.message || "Lỗi khi thêm danh mục!");
                    return;
                }

                alert("🎉 Danh mục đã được thêm thành công!");
                closeAddCategoryPopup();
                categoryNameInput.value = "";
                loadCategories();
            } catch (error) {
                console.error("❌ Lỗi khi gửi request:", error);
                alert("⚠ Không thể thêm danh mục! Kiểm tra console để biết thêm chi tiết.");
            }
        });
    }

    // Đóng popup thêm danh mục
    function closeAddCategoryPopup() {
        togglePopup(popupAddCategory, overlayAddCategory, false);
    }
    cancelAddCategoryBtn.addEventListener("click", () => closeAddCategoryPopup());

    // Load danh mục khi trang được tải
    loadCategories();
});
