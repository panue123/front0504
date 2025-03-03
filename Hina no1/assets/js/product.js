document.addEventListener("DOMContentLoaded", function () {
    // Lấy phần tử popup và overlay
    const popup = document.getElementById("popup");
    const overlay = document.getElementById("overlay");

    // Lấy nút mở popup
    const openPopupBtn = document.querySelector(".actions button");
    if (openPopupBtn) {
        openPopupBtn.addEventListener("click", function () {
            overlay.style.display = "block";
            popup.style.display = "block";
        });
    }

    // Lấy nút Hủy và thêm sự kiện đóng popup
    const cancelBtn = document.querySelector(".cancel-btn");
    if (cancelBtn) {
        cancelBtn.addEventListener("click", function () {
            console.log("Nút Hủy được click! Đóng popup.");
            overlay.style.display = "none";
            popup.style.display = "none";
        });
    }
});