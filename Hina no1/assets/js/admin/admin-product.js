// Định nghĩa API_URL cho backend
const API_URL = 'http://localhost:5000/api';

// Hàm hiển thị thông báo
function showMessage(message, type) {
    const msgContainer = document.createElement('div');
    msgContainer.className = `alert alert-${type === 'error' ? 'danger' : 'success'} popup-message`;
    msgContainer.textContent = message;
    document.body.appendChild(msgContainer);
    setTimeout(() => msgContainer.remove(), 3000);
}

document.addEventListener("DOMContentLoaded", function () {
    // Khởi tạo ImageCropper
    const imageCropper = new ImageCropper();
    
    // Các phần tử xử lý thêm sản phẩm mới
    const overlayAddProduct = document.getElementById("overlay-add-product");
    const popupAddProduct = document.getElementById("popup-add-product");
    const openPopupAddProductBtn = document.getElementById("openAddProduct");
    const cancelAddProductBtn = document.getElementById("cancelAddProduct");
    const addProductForm = document.getElementById("addProductForm");
    const productList = document.getElementById("product-list");
    
    const productNameInput = document.getElementById("customProductName");
    const productDescriptionInput = document.getElementById("customProductDescription");
    const productCategoryInput = document.getElementById("customProductCategory");
    const productPriceInput = document.getElementById("customProductPrice");
    const productPriceDiscountInput = document.getElementById("customProductPriceDiscount");
    const productQuantityInput = document.getElementById("customProductQuantity");
    const productImageInput = document.getElementById("customProductImage");

    // Các phần tử sửa sản phẩm
    const overlayEditProduct = document.getElementById("overlay-edit-product");
    const popupEditProduct = document.getElementById("popup-edit-product");
    const cancelEditProductBtn = document.getElementById("cancelEditProduct");
    const editProductForm = document.getElementById("editProductForm");
    const editProductNameInput = document.getElementById("editProductName");
    const editProductDescriptionInput = document.getElementById("editProductDescription");
    const editProductCategorySelect = document.getElementById("editProductCategory");
    const editProductQuantityInput = document.getElementById("editProductQuantity");
    const editProductPriceInput = document.getElementById("editProductPrice");
    const editProductPriceDiscountInput = document.getElementById("editProductPriceDiscount");
    const editProductImageInput = document.getElementById("editProductImage");

    // Các phần tử xóa sản phẩm
    const overlayDeleteProduct = document.getElementById("overlay-delete-product");
    const popupDeleteProduct = document.getElementById("confirm-delete-popup");
    const confirmDeleteProduct = document.getElementById("confirmDeleteProduct");
    const cancelDeleteProduct = document.getElementById("cancelDeleteProduct");

    // Hàm đóng/mở popup chung
    function togglePopup(popup, overlay, isOpen) {
        overlay.style.display = isOpen ? "block" : "none";
        popup.style.display = isOpen ? "block" : "none";
    }

    // Hàm tải danh sách sản phẩm
    async function loadProducts() {
        try {
            const response = await fetch("http://localhost:5000/api/products");
            if (!response.ok) throw new Error("⚠ Không thể tải danh sách sản phẩm!");
            const products = await response.json();
            console.log("Danh sách sản phẩm từ API:", products);
            
            productList.innerHTML = "";
            products.forEach((product, index) => {
                console.log("Sản phẩm thứ", index + 1, ":", {
                    name: product.name,
                    price: product.price,
                    pricediscount: product.pricediscount,
                    stock: product.stock
                });
                addProductRow(product, index);
            });
        } catch (error) {
            console.error("❌ Lỗi:", error);
            showMessage(error.message, 'error');
        }
    }

    // Thêm một hàng sản phẩm vào bảng
    function addProductRow(product, index) {
        const row = document.createElement("tr");
        console.log("Sản phẩm đang thêm vào bảng:", product);
        
        const price = product.price ? Number(product.price) : 0;
        const priceDiscount = product.pricediscount ? Number(product.pricediscount) : 0;
        const priceDisplay = priceDiscount > 0 && priceDiscount < price
            ? `<span style="text-decoration: line-through; color: #999; margin-right: 10px;">${price.toLocaleString('vi-VN')}đ</span>
               <span style="color: #f44336; font-weight: bold;">${priceDiscount.toLocaleString('vi-VN')}đ</span>`
            : `<span style="color: #f44336; font-weight: bold;">${price.toLocaleString('vi-VN')}đ</span>`;
        
        const categoryName = product.category && product.category.name
            ? product.category.name
            : (product.category || 'Chưa có danh mục');

        row.innerHTML = `
            <td>${index + 1}</td>
            <td><img src="${product.image_url || product.image || ''}" width="50" height="50" alt="Hình ảnh sản phẩm"></td>
            <td>${product.name || ''}</td>
            <td>${categoryName}</td>
            <td>${priceDisplay}</td>
            <td>${product.stock || 0}</td>
            <td>
                <button class="btn edit" data-id="${product.id}" data-action="edit">✏️ Sửa</button>
                <button class="btn delete" data-id="${product.id}" data-action="delete">🗑️ Xóa</button>
            </td>
        `;
        productList.appendChild(row);
    }

    // Upload ảnh lên server 
    async function uploadImage(imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        try {
            const response = await fetch("http://localhost:5000/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Lỗi upload ảnh");
            return data.imageUrl;
        } catch (error) {
            console.error("❌ Lỗi upload ảnh:", error);
            showMessage("⚠ Không thể tải ảnh lên!", 'error');
            return null;
        }
    }

    // Hàm tải danh sách danh mục
    async function loadCategories() {
        try {
            const response = await fetch("http://localhost:5000/api/categories", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log("Dữ liệu danh mục từ API:", data);
            const categorySelects = document.querySelectorAll("#customProductCategory, #editProductCategory");
            categorySelects.forEach(select => {
                select.innerHTML = '<option value="">Chọn danh mục</option>' + 
                    data.map(category => 
                        `<option value="${category.id}">${category.name}</option>`
                    ).join("");
            });
        } catch (error) {
            console.error("Lỗi khi tải danh sách danh mục:", error);
            showMessage("⚠ Lỗi tải danh sách danh mục!", 'error');
        }
    }

    // Mở popup thêm sản phẩm
    function openAddProductPopup() {
        togglePopup(popupAddProduct, overlayAddProduct, true);
    }
    openPopupAddProductBtn.addEventListener("click", () => {
        openAddProductPopup();
        loadCategories();
    });
    
    // Xử lý thêm sản phẩm mới
    if (addProductForm) {
        addProductForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            
            const name = productNameInput.value.trim();
            const description = productDescriptionInput.value.trim();
            const category_id = productCategoryInput.value;
            const stock = parseInt(productQuantityInput.value);
            const price = parseInt(productPriceInput.value);
            const priceDiscountInput = productPriceDiscountInput.value.trim();
            
            let pricediscount = 0;
            if (priceDiscountInput !== '') {
                const discountValue = parseInt(priceDiscountInput);
                if (discountValue > 0 && discountValue < price) {
                    pricediscount = discountValue;
                }
            }

            if (!name) {
                showMessage("❌ Vui lòng nhập tên sản phẩm!", 'error');
                return;
            }
            if (!category_id) {
                showMessage("❌ Vui lòng chọn danh mục!", 'error');
                return;
            }
            if (!stock || stock <= 0) {
                showMessage("❌ Vui lòng nhập số lượng hợp lệ!", 'error');
                return;
            }
            if (!price || price <= 0) {
                showMessage("❌ Vui lòng nhập giá hợp lệ!", 'error');
                return;
            }
            if (!productImageInput.files[0]) {
                showMessage("❌ Vui lòng chọn hình ảnh sản phẩm!", 'error');
                return;
            }

            try {
                const imageUrl = await uploadImage(productImageInput.files[0]);
                if (!imageUrl) return;
                                    
                const formData = new FormData();
                formData.append('name', name);
                formData.append('description', description);
                formData.append('price', price);
                formData.append('pricediscount', pricediscount.toString());
                formData.append('stock', stock);
                formData.append('category_id', category_id);
                formData.append('image', productImageInput.files[0]);

                const response = await fetch("http://localhost:5000/api/products", {
                    method: "POST", 
                    body: formData
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Lỗi từ server:", errorData);
                    showMessage(errorData.message || "Lỗi khi thêm sản phẩm!", 'error');
                    return;
                }

                const data = await response.json();
                console.log("Phản hồi từ server:", data);
                showMessage("🎉 Sản phẩm đã được thêm thành công!", 'success');
                closeAddProductPopup();
                loadProducts();
            } catch (error) {
                console.error("❌ Lỗi khi gửi dữ liệu:", error);
                showMessage("⚠ Không thể thêm sản phẩm!", 'error');
            }
        });
    }

    // Đóng popup thêm sản phẩm
    function closeAddProductPopup() {
        togglePopup(popupAddProduct, overlayAddProduct, false);
    }
    cancelAddProductBtn.addEventListener("click", closeAddProductPopup);

    // Xử lý sự kiện trên bảng sản phẩm
    productList.addEventListener("click", function (event) {
        const button = event.target.closest("button");
        if (!button) return;

        const action = button.dataset.action;
        const productId = button.dataset.id;

        if (action === "edit") {
            openEditProductPopup(productId);
        } else if (action === "delete") {
            openDeleteProductPopup(productId);
        }
    });

    // Mở popup sửa sản phẩm
    async function openEditProductPopup(productId) {
        try {
            const response = await fetch(`http://localhost:5000/api/products/${productId}`);
            if (!response.ok) throw new Error("⚠ Không thể tải thông tin sản phẩm!");
            const product = await response.json();
            console.log("Thông tin sản phẩm:", product);

            const categoriesResponse = await fetch("http://localhost:5000/api/categories");
            if (!categoriesResponse.ok) throw new Error("⚠ Không thể tải danh mục!");
            const categories = await categoriesResponse.json();

            editProductNameInput.value = product.name;
            editProductDescriptionInput.value = product.description;
            editProductQuantityInput.value = product.stock || 0;
            editProductPriceInput.value = product.price || 0;
            
            const price = Number(product.price) || 0;
            const priceDiscount = Number(product.pricediscount) || price;
            editProductPriceDiscountInput.value = (priceDiscount > 0 && priceDiscount < price) ? priceDiscount : '';

            editProductCategorySelect.innerHTML = categories.map(category => 
                `<option value="${category.id}" ${category.id === product.category_id ? 'selected' : ''}>${category.name}</option>`
            ).join('');

            popupEditProduct.setAttribute("data-id", productId);
            popupEditProduct.setAttribute("data-current-image", product.image_url || product.image);

            const currentImagePreview = document.createElement('div');
            currentImagePreview.innerHTML = `
                <p>Ảnh hiện tại:</p>
                <img src="${product.image_url || product.image}" alt="Ảnh hiện tại" style="max-width: 200px; margin: 10px 0;">
                <p>Chỉ chọn ảnh mới nếu muốn thay đổi</p>
            `;
            editProductImageInput.parentNode.insertBefore(currentImagePreview, editProductImageInput);

            togglePopup(popupEditProduct, overlayEditProduct, true);
        } catch (error) {
            console.error("❌ Lỗi:", error);
            showMessage(error.message, 'error');
        }
    }

    // Xử lý lưu thay đổi sản phẩm
    editProductForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const productId = popupEditProduct.getAttribute("data-id");
        const formData = new FormData();

        const name = editProductNameInput.value.trim();
        const description = editProductDescriptionInput.value.trim();
        const category_id = editProductCategorySelect.value;
        const stock = parseInt(editProductQuantityInput.value);
        const price = parseInt(editProductPriceInput.value);
        const priceDiscountInput = editProductPriceDiscountInput.value.trim();
        
        let pricediscount = 0;
        if (priceDiscountInput !== '') {
            const discountValue = parseInt(priceDiscountInput);
            if (discountValue > 0 && discountValue < price) {
                pricediscount = discountValue;
            }
        }

        if (!name) {
            showMessage("❌ Vui lòng nhập tên sản phẩm!", 'error');
            return;
        }
        if (!category_id) {
            showMessage("❌ Vui lòng chọn danh mục!", 'error');
            return;
        }
        if (!stock || stock <= 0) {
            showMessage("❌ Vui lòng nhập số lượng hợp lệ!", 'error');
            return;
        }
        if (!price || price <= 0) {
            showMessage("❌ Vui lòng nhập giá hợp lệ!", 'error');
            return;
        }

        formData.append("name", name);
        formData.append("description", description);
        formData.append("category_id", category_id);
        formData.append("stock", stock);
        formData.append("price", price);
        formData.append("pricediscount", pricediscount.toString());

        if (editProductImageInput.files && editProductImageInput.files[0]) {
            formData.append("image", editProductImageInput.files[0]);
        }

        try {
            const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
                method: "PUT",
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Lỗi từ server:", errorData);
                showMessage(errorData.message || "⚠ Lỗi khi cập nhật sản phẩm!", 'error');
                return;
            }

            const data = await response.json();
            console.log("Phản hồi từ server:", data);
            showMessage("🎉 Cập nhật sản phẩm thành công!", 'success');
            closeEditProductPopup();
            loadProducts();
        } catch (error) {
            console.error("❌ Lỗi:", error);
            showMessage(error.message, 'error');
        }
    });

    // Đóng popup sửa sản phẩm
    function closeEditProductPopup() {
        togglePopup(popupEditProduct, overlayEditProduct, false);
        editProductForm.reset();
        const imagePreview = editProductImageInput.previousElementSibling;
        if (imagePreview && imagePreview.tagName === 'DIV') {
            imagePreview.remove();
        }
    }
    cancelEditProductBtn.addEventListener("click", closeEditProductPopup);

    // Mở popup xóa sản phẩm
    function openDeleteProductPopup(productId) {
        popupDeleteProduct.setAttribute("data-id", productId);
        togglePopup(popupDeleteProduct, overlayDeleteProduct, true);
    }

    // Xử lý xóa sản phẩm (soft delete)
    confirmDeleteProduct.addEventListener("click", async function () {
        const productId = popupDeleteProduct.getAttribute("data-id");

        try {
            const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                throw new Error("⚠ Lỗi khi xóa sản phẩm!");
            }

            showMessage("🗑️ Sản phẩm đã được xóa thành công!", 'success');
            closeDeleteProductPopup();
            loadProducts();
        } catch (error) {
            console.error("❌ Lỗi:", error);
            showMessage(error.message, 'error');
        }
    });

    // Đóng popup xóa sản phẩm
    function closeDeleteProductPopup() {
        togglePopup(popupDeleteProduct, overlayDeleteProduct, false);
    }
    cancelDeleteProduct.addEventListener("click", closeDeleteProductPopup);

    // Xử lý khi chọn ảnh trong form thêm/sửa sản phẩm
    [productImageInput, editProductImageInput].forEach(input => {
        input.addEventListener("change", function(e) {
            const file = e.target.files[0];
            if (file) {
                imageCropper.onCropComplete = (croppedFile) => {
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(croppedFile);
                    input.files = dataTransfer.files;
                };
                imageCropper.openCropper(file);
            }
        });
    });

    // Load sản phẩm khi trang được tải
    loadProducts();
});