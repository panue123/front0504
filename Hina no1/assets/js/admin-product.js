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
            alert(error.message);
        }
    }

    // Thêm một hàng sản phẩm vào bảng
    function addProductRow(product, index) {
        const row = document.createElement("tr");
        console.log("Sản phẩm đang thêm vào bảng:", product);
        
        // Xử lý giá
        const price = product.price ? Number(product.price) : 0;
        const priceDiscount = product.pricediscount ? Number(product.pricediscount) : 0;
        
        // Hiển thị giá gốc và giá giảm khi có giá giảm
        const priceDisplay = priceDiscount > 0 && priceDiscount < price
            ? `<span style="text-decoration: line-through; color: #999; margin-right: 10px;">${price.toLocaleString('vi-VN')}đ</span>
               <span style="color: #f44336; font-weight: bold;">${priceDiscount.toLocaleString('vi-VN')}đ</span>`
            : `<span style="color: #f44336; font-weight: bold;">${price.toLocaleString('vi-VN')}đ</span>`;
        
        // Log dữ liệu danh mục để kiểm tra
        console.log("Danh mục sản phẩm:", product.category);

        // Hiển thị tên danh mục hoặc để trống nếu không có danh mục
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
            alert("⚠ Không thể tải ảnh lên!");
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
                select.innerHTML = data.map(category => 
                    `<option value="${category.id}">${category.name}</option>`
                ).join("");
            });
        } catch (error) {
            console.error("Lỗi khi tải danh sách danh mục:", error);
            alert("⚠ Lỗi tải danh sách danh mục!");
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
            
            // Lấy giá trị từ form
            const name = productNameInput.value.trim();
            const description = productDescriptionInput.value.trim();
            const category_id = productCategoryInput.value;
            const stock = parseInt(productQuantityInput.value);
            const price = parseInt(productPriceInput.value);
            const priceDiscountInput = productPriceDiscountInput.value.trim();
            
            // Xử lý giá giảm
            let pricediscount = 0; // Mặc định là 0
            if (priceDiscountInput !== '') {
                const discountValue = parseInt(priceDiscountInput);
                if (discountValue > 0 && discountValue < price) {
                    pricediscount = discountValue;
                }
            }

            console.log("Dữ liệu form:", {
                name,
                description,
                category_id,
                stock,
                price,
                pricediscount,
                imageFile: productImageInput.files[0]
            });

            // Kiểm tra các trường bắt buộc
            if (!name) {
                alert("❌ Vui lòng nhập tên sản phẩm!");
                return;
            }
            if (!category_id) {
                alert("❌ Vui lòng chọn danh mục!");
                return;
            }
            if (!stock || stock <= 0) {
                alert("❌ Vui lòng nhập số lượng hợp lệ!");
                return;
            }
            if (!price || price <= 0) {
                alert("❌ Vui lòng nhập giá hợp lệ!");
                return;
            }
            if (!productImageInput.files[0]) {
                alert("❌ Vui lòng chọn hình ảnh sản phẩm!");
                return;
            }

            try {
                const imageUrl = await uploadImage(productImageInput.files[0]);
                if (!imageUrl) {
                    alert("⚠ Không thể tải ảnh lên!");
                    return;
                }
                                    
                const formData = new FormData();
                formData.append('name', name);
                formData.append('description', description);
                formData.append('price', price);
                formData.append('pricediscount', pricediscount.toString()); // Chuyển sang string
                formData.append('stock', stock);
                formData.append('category_id', category_id);
                formData.append('image', productImageInput.files[0]);

                // Log từng giá trị trong formData
                for (let pair of formData.entries()) {
                    console.log(pair[0] + ': ' + pair[1]);
                }

                const response = await fetch("http://localhost:5000/api/products", {
                    method: "POST",
                    body: formData
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Lỗi từ server:", errorData);
                    if (errorData.missingFields) {
                        console.log("Các trường thiếu:", errorData.missingFields);
                        alert("❌ Vui lòng điền đầy đủ các trường: " + Object.keys(errorData.missingFields).join(", "));
                    } else {
                        alert(errorData.message || "Lỗi khi thêm sản phẩm!");
                    }
                    return;
                }

                const data = await response.json();
                console.log("Phản hồi từ server:", data);
                alert("🎉 Sản phẩm đã được thêm thành công!");
                closeAddProductPopup();
                loadProducts();
            } catch (error) {
                console.error("❌ Lỗi khi gửi dữ liệu:", error);
                if (error.message === "Failed to fetch") {
                    alert("⚠ Không thể kết nối đến server. Vui lòng kiểm tra lại kết nối và thử lại!");
                } else {
                    alert("⚠ Không thể thêm sản phẩm!");
                }
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
            // Lấy thông tin sản phẩm
            const response = await fetch(`http://localhost:5000/api/products/${productId}`);
            if (!response.ok) throw new Error("⚠ Không thể tải thông tin sản phẩm!");
            const product = await response.json();
            console.log("Thông tin sản phẩm:", product);

            // Lấy danh sách danh mục
            const categoriesResponse = await fetch("http://localhost:5000/api/categories");
            if (!categoriesResponse.ok) throw new Error("⚠ Không thể tải danh mục!");
            const categories = await categoriesResponse.json();

            // Điền thông tin vào form
            editProductNameInput.value = product.name;
            editProductDescriptionInput.value = product.description;
            editProductQuantityInput.value = product.stock || product.quantity || 0;
            editProductPriceInput.value = product.price || 0;
            
            // Xử lý giá giảm
            const price = Number(product.price) || 0;
            const priceDiscount = Number(product.pricediscount) || price;
            console.log("Giá gốc:", price);
            console.log("Giá giảm:", priceDiscount);
            
            // Set giá giảm nếu nó > 0 và < giá gốc
            editProductPriceDiscountInput.value = (priceDiscount > 0 && priceDiscount < price) ? priceDiscount : '';

            // Cập nhật danh sách danh mục
            editProductCategorySelect.innerHTML = categories.map(category => 
                `<option value="${category.id}" ${category.id === product.category_id ? 'selected' : ''}>${category.name}</option>`
            ).join('');

            // Lưu ID sản phẩm và ảnh hiện tại vào popup
            popupEditProduct.setAttribute("data-id", productId);
            popupEditProduct.setAttribute("data-current-image", product.image_url || product.image);

            // Hiển thị ảnh hiện tại
            const currentImagePreview = document.createElement('div');
            currentImagePreview.innerHTML = `
                <p>Ảnh hiện tại:</p>
                <img src="${product.image_url || product.image}" alt="Ảnh hiện tại" style="max-width: 200px; margin: 10px 0;">
                <p>Chỉ chọn ảnh mới nếu muốn thay đổi</p>
            `;
            editProductImageInput.parentNode.insertBefore(currentImagePreview, editProductImageInput);

            // Hiển thị popup
            togglePopup(popupEditProduct, overlayEditProduct, true);
        } catch (error) {
            console.error("❌ Lỗi:", error);
            alert(error.message);
        }
    }

    // Xử lý lưu thay đổi sản phẩm
    editProductForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const productId = popupEditProduct.getAttribute("data-id");
        const formData = new FormData();

        // Lấy giá trị từ form
        const name = editProductNameInput.value.trim();
        const description = editProductDescriptionInput.value.trim();
        const category_id = editProductCategorySelect.value;
        const stock = parseInt(editProductQuantityInput.value);
        const price = parseInt(editProductPriceInput.value);
        const priceDiscountInput = editProductPriceDiscountInput.value.trim();
        
        // Xử lý giá giảm
        let pricediscount = 0; // Mặc định là 0
        if (priceDiscountInput !== '') {
            const discountValue = parseInt(priceDiscountInput);
            if (discountValue > 0 && discountValue < price) {
                pricediscount = discountValue;
            }
        }

        console.log("Dữ liệu sửa sản phẩm:", {
            name,
            description,
            category_id,
            stock,
            price,
            pricediscount,
            productId
        });

        // Kiểm tra các trường bắt buộc
        if (!name) {
            alert("❌ Vui lòng nhập tên sản phẩm!");
            return;
        }
        if (!category_id) {
            alert("❌ Vui lòng chọn danh mục!");
            return;
        }
        if (!stock || stock <= 0) {
            alert("❌ Vui lòng nhập số lượng hợp lệ!");
            return;
        }
        if (!price || price <= 0) {
            alert("❌ Vui lòng nhập giá hợp lệ!");
            return;
        }

        // Thêm các trường thông tin vào formData
        formData.append("name", name);
        formData.append("description", description);
        formData.append("category_id", category_id);
        formData.append("stock", stock);
        formData.append("price", price);
        formData.append("pricediscount", pricediscount.toString()); // Chuyển sang string

        // Chỉ thêm ảnh mới nếu người dùng chọn ảnh mới
        if (editProductImageInput.files && editProductImageInput.files[0]) {
            formData.append("image", editProductImageInput.files[0]);
        }

        // Log từng giá trị trong formData
        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        try {
            const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
                method: "PUT",
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Lỗi từ server:", errorData);
                alert(errorData.message || "⚠ Lỗi khi cập nhật sản phẩm!");
                return;
            }

            const data = await response.json();
            console.log("Phản hồi từ server:", data);
            alert("🎉 Cập nhật sản phẩm thành công!");
            closeEditProductPopup();
            loadProducts();
        } catch (error) {
            console.error("❌ Lỗi:", error);
            alert(error.message);
        }
    });

    // Đóng popup sửa sản phẩm
    function closeEditProductPopup() {
        togglePopup(popupEditProduct, overlayEditProduct, false);
        editProductForm.reset();
        // Xóa preview ảnh hiện tại
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

            alert("🗑️ Sản phẩm đã được xóa thành công!");
            closeDeleteProductPopup();
            loadProducts();
        } catch (error) {
            console.error("❌ Lỗi:", error);
            alert(error.message);
        }
    });

    // Đóng popup xóa sản phẩm
    function closeDeleteProductPopup() {
        togglePopup(popupDeleteProduct, overlayDeleteProduct, false);
    }
    cancelDeleteProduct.addEventListener("click", closeDeleteProductPopup);

    // Xử lý khi chọn ảnh trong form thêm sản phẩm
    productImageInput.addEventListener("change", function(e) {
        const file = e.target.files[0];
        if (file) {
            imageCropper.onCropComplete = (croppedFile) => {
                // Tạo một FileList mới với file đã crop
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(croppedFile);
                productImageInput.files = dataTransfer.files;
            };
            imageCropper.openCropper(file);
        }
    });

    // Xử lý khi chọn ảnh trong form sửa sản phẩm
    editProductImageInput.addEventListener("change", function(e) {
        const file = e.target.files[0];
        if (file) {
            imageCropper.onCropComplete = (croppedFile) => {
                // Tạo một FileList mới với file đã crop
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(croppedFile);
                editProductImageInput.files = dataTransfer.files;
            };
            imageCropper.openCropper(file);
        }
    });

    async function deleteProduct(productId) {
        try {
            const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
                method: "DELETE"
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Lỗi từ server:", errorData);
                alert(errorData.message || "⚠ Lỗi khi xóa sản phẩm!");
                return;
            }
    
            alert("🎉 Xóa sản phẩm thành công!");
            loadProducts();
        } catch (error) {
            console.error("❌ Lỗi:", error);
            alert(error.message);
        }
    }

    // Load sản phẩm khi trang được tải
    loadProducts();

    // Hiển thị đánh giá sản phẩm
    function displayProductReviews(reviews) {
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

    // Xử lý đánh giá sản phẩm
    async function handleProductReview(event) {
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

    // Khởi tạo các event listener
    document.addEventListener('DOMContentLoaded', () => {
        // ... existing code ...
        
        // Form đánh giá sản phẩm
        const reviewForm = document.getElementById('reviewForm');
        if (reviewForm) {
            reviewForm.addEventListener('submit', handleProductReview);
        }
    });
});
// Tải danh sách sản phẩm
async function loadProducts(category = null, sort = null, search = null) {
    try {
        let url = `${API_URL}/products`;
        const params = new URLSearchParams();
        
        if (category) params.append('category', category);
        if (sort) params.append('sort', sort);
        if (search) params.append('search', search);
        
        if (params.toString()) {
            url += `?${params.toString()}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Không thể tải danh sách sản phẩm');
        }

        const products = await response.json();
        
        // Hiển thị sản phẩm
        const productsContainer = document.getElementById('productsContainer');
        if (productsContainer) {
            productsContainer.innerHTML = products.map(product => `
                <div class="col-3 product-item">
                    <div class="row product-sale">
                        ${product.discount ? `<span>${product.discount}%</span>` : ''}
                    </div>
                    <div class="row mb-1">
                        <div class="product_img">
                            <img src="${product.image}" alt="${product.name}" class="product-image">
                        </div>
                    </div>
                    <div class="row product-info mb-1">
                        <p onclick="goToProductDetail(${product.id})">
                            ${product.name}
                        </p>
                    </div>
                    <div class="row product-price">
                        ${product.discount ? 
                            `<span>${formatCurrency(product.price)} chỉ còn ${formatCurrency(product.price * (1 - product.discount/100))}</span>` :
                            `<span>${formatCurrency(product.price)}</span>`
                        }
                    </div>
                    <div class="row product-actions mt-2">
                        <button class="btn btn-primary btn-sm" onclick="addToCart(${product.id})">
                            Thêm vào giỏ
                        </button>
                    </div>
                </div>
            `).join('');
        }
        
        // Cập nhật phân trang
        updatePagination(products.length);
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

// Cập nhật phân trang
function updatePagination(totalProducts) {
    const itemsPerPage = 12;
    const totalPages = Math.ceil(totalProducts / itemsPerPage);
    
    const paginationContainer = document.getElementById('pagination');
    if (paginationContainer) {
        let paginationHTML = '';
        
        // Nút Previous
        paginationHTML += `
            <button class="btn btn-outline-primary me-2" onclick="changePage(currentPage - 1)" ${currentPage === 1 ? 'disabled' : ''}>
                Trước
            </button>
        `;
        
        // Các nút số trang
        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `
                <button class="btn ${currentPage === i ? 'btn-primary' : 'btn-outline-primary'} me-2" onclick="changePage(${i})">
                    ${i}
                </button>
            `;
        }
        
        // Nút Next
        paginationHTML += `
            <button class="btn btn-outline-primary" onclick="changePage(currentPage + 1)" ${currentPage === totalPages ? 'disabled' : ''}>
                Sau
            </button>
        `;
        
        paginationContainer.innerHTML = paginationHTML;
    }
}

// Xử lý tìm kiếm sản phẩm
function handleSearch(event) {
    event.preventDefault();
    const searchInput = document.getElementById('searchInput');
    const searchQuery = searchInput.value.trim();
    
    if (searchQuery) {
        loadProducts(null, null, searchQuery);
    }
}

// Xử lý sắp xếp sản phẩm
function handleSort(event) {
    const sortValue = event.target.value;
    loadProducts(currentCategory, sortValue);
}

// Xử lý lọc theo danh mục
function handleCategoryFilter(category) {
    currentCategory = category;
    loadProducts(category, currentSort);
}

// Khởi tạo các event listener
document.addEventListener('DOMContentLoaded', () => {
    // Lấy tham số từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const sort = urlParams.get('sort');
    const search = urlParams.get('search');
    
    // Tải danh sách sản phẩm
    loadProducts(category, sort, search);
    
    // Form tìm kiếm
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearch);
    }
    
    // Select sắp xếp
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', handleSort);
    }
    
    // Các nút danh mục
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            handleCategoryFilter(button.dataset.category);
        });
    });
}); 