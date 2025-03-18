document.addEventListener("DOMContentLoaded", function () {
    const overlay = document.getElementById("overlay");
    const popup = document.getElementById("popup");
    const resetPasswordForm = document.getElementById("resetPasswordForm");
    const userIdInput = document.getElementById("userId");
    const newPasswordInput = document.getElementById("newPassword");
    const confirmPasswordInput = document.getElementById("confirmPassword");

    // Mở popup khi nhấn nút "🔑 Đặt lại mật khẩu"
    document.querySelectorAll(".reset-password-btn").forEach(button => {
        button.addEventListener("click", function () {
            userIdInput.value = this.dataset.userId; // Lấy ID người dùng từ nút
            newPasswordInput.value = "";
            confirmPasswordInput.value = "";
            popup.style.display = "block";
            overlay.style.display = "block";
        });
    });

    // Đóng popup khi nhấn nút "Hủy"
    document.querySelector(".cancel-btn").addEventListener("click", function () {
        popup.style.display = "none";
        overlay.style.display = "none";
    });

    // Xử lý đặt lại mật khẩu
    resetPasswordForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const userId = userIdInput.value;
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (newPassword !== confirmPassword) {
            alert("Mật khẩu xác nhận không khớp!");
            return;
        }

        const response = await fetch("/api/users/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, newPassword })
        });

        const result = await response.json();
        alert(result.message);

        if (response.ok) {
            popup.style.display = "none";
            overlay.style.display = "none";
        }
    });
});
