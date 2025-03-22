document.addEventListener("DOMContentLoaded", function () {
    const popup = document.getElementById("popup");
    const overlay = document.getElementById("overlay");
    const openPopupBtns = document.querySelectorAll(".actions button");
    const saveBtn = document.querySelector(".save-btn");
    const cancelBtn = document.querySelector(".cancel-btn");
    const productForm = document.getElementById("customProductForm");
    const productList = document.getElementById("product-list");

    /** 🏷 Hiển thị popup thêm sản phẩm */
    openPopupBtns.forEach(button => {
        button.addEventListener("click", () => {
            overlay.style.display = "block";
            popup.style.display = "block";
        });
    });

    /** 🏷 Đóng popup */
    function closePopup() {
        overlay.style.display = "none";
        popup.style.display = "none";
        productForm.reset();
    }
    cancelBtn.addEventListener("click", closePopup);
    overlay.addEventListener("click", event => {
        if (event.target === overlay) closePopup();
    });

    /** 🏷 Lấy danh sách sản phẩm từ API */
    async function loadProducts() {
        try {
            const response = await fetch("http://localhost:5000/api/products");
            const products = await response.json();

            productList.innerHTML = "";
            if (!Array.isArray(products) || products.length === 0) {
                productList.innerHTML = `<tr><td colspan="6">Không có sản phẩm nào.</td></tr>`;
                return;
            }

            products.forEach((product, index) => addProductRow(product, index));
        } catch (error) {
            console.error("❌ Lỗi khi lấy dữ liệu:", error);
            alert("⚠ Lỗi tải danh sách sản phẩm!");
        }
    }

    /** 🏷 Thêm 1 hàng sản phẩm vào bảng */
    function addProductRow(product, index) {
        const row = `
            <tr id="product-${product.id}">
                <td>${index + 1}</td>
                <td><img src="${product.image_url}" width="50" height="50" alt="Hình ảnh sản phẩm"></td>
                <td>${product.name}</td>
                <td>${Number(product.price).toLocaleString()} VNĐ</td>
                <td>${product.stock}</td>
                <td>
                    <button class="btn edit-btn" onclick="editProduct(${product.id})">✏ Sửa</button>
                    <button class="btn delete-btn" onclick="deleteProduct(${product.id})">🗑 Xóa</button>
                </td>
            </tr>
        `;
        productList.innerHTML += row;
    }

    /** 🏷 Upload ảnh lên server */
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

    /** 🏷 Xử lý thêm sản phẩm */
    productForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const name = document.getElementById("customProductName").value.trim();
        const description = document.getElementById("customProductDescription").value.trim();
        const category_id = document.getElementById("customProductCategory").value;
        const stock = document.getElementById("customProductQuantity").value;
        const price = document.getElementById("customProductPrice").value;
        const pricediscount = document.getElementById("customProductPriceDiscount").value;
        const imageFile = document.getElementById("customProductImage").files[0];

        if (!name || !description || !category_id || !stock || !price || !pricediscount || !imageFile) {
            alert("❌ Vui lòng nhập đầy đủ thông tin sản phẩm!");
            return;
        }
        if (price <= 0 || stock <= 0 || pricediscount <= 0) {
            alert("❌ Giá và số lượng phải lớn hơn 0!");
            return;
        }

        try {
            const imageUrl = await uploadImage(imageFile);
            if (!imageUrl) return;

            const productData = { name, description, category_id, stock, price, pricediscount, image_url: imageUrl };
            const response = await fetch("http://localhost:5000/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(productData),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Lỗi thêm sản phẩm");

            alert("🎉 Sản phẩm đã được thêm thành công!");
            closePopup();
            addProductRow(data.product, productList.children.length); // Chèn sản phẩm mới vào bảng
        } catch (error) {
            console.error("❌ Lỗi khi gửi dữ liệu:", error);
            alert("⚠ Không thể thêm sản phẩm!");
        }
    });

    loadProducts();
});
