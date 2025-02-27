document.addEventListener("DOMContentLoaded", function () {
    // Xử lý sự kiện khi nhấn nút "Thêm danh mục"
    document.querySelector(".actions button").addEventListener("click", function () {
        alert("Chức năng thêm danh mục chưa được triển khai!");
    });

    // Xử lý sự kiện các nút trong bảng
    document.querySelectorAll(".btn").forEach(button => {
        button.addEventListener("click", function () {
            let action = this.textContent.trim();
            let row = this.closest("tr");
            let categoryName = row.querySelector("td:nth-child(2)").textContent;

            switch (action) {
                case "👁 Xem sản phẩm":
                    alert("Xem sản phẩm của: " + categoryName);
                    break;
                case "🗑️ Xóa":
                    if (confirm("Bạn có chắc chắn muốn xóa danh mục: " + categoryName + "?") ) {
                        row.remove();
                    }
                    break;
                case "✏️ Sửa":
                    let newName = prompt("Nhập tên mới cho danh mục:", categoryName);
                    if (newName) row.querySelector("td:nth-child(2)").textContent = newName;
                    break;
                case "➕ Thêm sản phẩm":
                    alert("Thêm sản phẩm vào danh mục: " + categoryName);
                    break;
                default:
                    alert("Chức năng chưa được triển khai!");
            }
        });
    });
});
