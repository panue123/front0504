document.addEventListener("DOMContentLoaded", function () {
    const userTableBody = document.getElementById("userTableBody");
    const overlay = document.getElementById("overlay");
    const popup = document.getElementById("popup");
    const resetPasswordForm = document.getElementById("resetPasswordForm");
    const userIdInput = document.getElementById("userId");
    const newPasswordInput = document.getElementById("newPassword");
    const confirmPasswordInput = document.getElementById("confirmPassword");

    // Danh sách người dùng giả lập (sẽ lấy từ backend)
    let users = [
        { id: 1, name: "Nguyễn Văn A", email: "nguyenvana@example.com", phone: "0918759123", role: "Khách hàng" },
        { id: 2, name: "Trần Thị B", email: "tranthib@example.com", phone: "0981121235", role: "Quản trị viên" }
    ];

    function renderUsers() {
        userTableBody.innerHTML = "";
        users.forEach((user, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td>${user.role}</td>
                <td>
                    <button class="btn edit-btn" data-id="${user.id}">✏️ Sửa</button>
                    <button class="btn delete-btn" data-id="${user.id}">🗑️ Xóa</button>
                    <button class="btn reset-password-btn" data-id="${user.id}">🔑 Đặt lại mật khẩu</button>
                </td>
            `;
            userTableBody.appendChild(row);
        });
    }

    renderUsers();

    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("reset-password-btn")) {
            const userId = event.target.getAttribute("data-id");
            userIdInput.value = userId;
            overlay.style.display = "block";
            popup.style.display = "block";
        }

        if (event.target.classList.contains("delete-btn")) {
            const userId = event.target.getAttribute("data-id");
            if (confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
                users = users.filter(user => user.id != userId);
                renderUsers();
                console.log(`Đã gửi request xóa user với ID: ${userId}`);
            }
        }
    });

    resetPasswordForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const userId = userIdInput.value;
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (newPassword !== confirmPassword) {
            alert("Mật khẩu xác nhận không khớp!");
            return;
        }

        console.log(`Gửi request đặt lại mật khẩu cho user ID: ${userId}`);
    });

    document.querySelector(".cancel-btn").addEventListener("click", function () {
        overlay.style.display = "none";
        popup.style.display = "none";
    });
});