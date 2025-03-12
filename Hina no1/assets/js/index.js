document.addEventListener("DOMContentLoaded", function () {
    let navItems = document.querySelectorAll(".second-nav-text");

    navItems.forEach(item => {
        item.addEventListener("click", function () {
            // Xóa class 'active' của tất cả các mục
            navItems.forEach(nav => nav.classList.remove("active"));

            // Thêm class 'active' vào mục được chọn
            this.classList.add("active");
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".dropdown-item").forEach(item => {
        item.addEventListener("click", function (event) {
            event.preventDefault(); // Ngăn chặn hành vi mặc định
            let targetElement = document.getElementById('products'); // Phần cần cuộn tới
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("products-hot").addEventListener("click", function (event) {
        event.preventDefault(); // Ngăn chặn hành vi mặc định
        
        let targetElement = document.getElementById('products-highlight'); // ID của phần Sản phẩm nổi bật
        
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("news").addEventListener("click", function (event) {
        event.preventDefault(); // Ngăn chặn hành vi mặc định
        
        let targetElement = document.getElementById('article'); // ID của phần Sản phẩm nổi bật
        
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });
});



document.addEventListener("DOMContentLoaded", function () {
    let dots = document.querySelectorAll(".dot");
    let productsContainer = document.querySelector(".product-container");
    let totalProducts = document.querySelectorAll(".product-container > .col-3").length;
    let productsPerPage = 4; // Số sản phẩm hiển thị mỗi lần
    let currentPage = 0;

    dots.forEach((dot, index) => {
        dot.addEventListener("click", function () {
            // Xóa class 'active' của tất cả các dots
            dots.forEach(d => d.classList.remove("active"));

            // Thêm class 'active' vào nút được bấm
            this.classList.add("active");

            // Cập nhật vị trí sản phẩm
            currentPage = index;
            let scrollPosition = index * productsContainer.clientWidth;

            // Cuộn danh sách sản phẩm theo trang
            productsContainer.scrollTo({
                left: scrollPosition,
                behavior: "smooth"
            });
        });
    });

    // Tự động cập nhật số trang nếu có nhiều sản phẩm hơn
    let totalPages = Math.ceil(totalProducts / productsPerPage);
    dots.forEach((dot, index) => {
        if (index >= totalPages) {
            dot.style.display = "none";
        }
    });
});

function goToProductDetail() {
    window.location.href = `sanphamchitiet.html`;
}
function goToHomePage() {
    window.location.href = "index.html"; // Thay bằng trang chủ của bạn
}