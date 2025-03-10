document.addEventListener("DOMContentLoaded", function () {
    const popup = document.getElementById("popup");
    const overlay = document.getElementById("overlay");

    // Lấy tất cả các nút mở popup
    const openPopupBtns = document.querySelectorAll(".detail-link");
    openPopupBtns.forEach(btn => {
        btn.addEventListener("click", function () {
            overlay.style.display = "block";
            popup.style.display = "block";
        });
    });

    // Đóng popup khi click overlay
    overlay.addEventListener("click", function () {
        closePopup();
    });

    function closePopup() {
        overlay.style.display = "none";
        popup.style.display = "none";
    }
});
