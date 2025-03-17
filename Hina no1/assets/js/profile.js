document.getElementById("image-upload").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById("avatar-preview").src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

document.querySelector("form").addEventListener("submit", function(event) {
    let newPassword = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;
    let errorText = document.getElementById("passwordError");

    if (newPassword && newPassword !== confirmPassword) {
        event.preventDefault();
        errorText.textContent = "Mật khẩu xác nhận không khớp!";
    } else {
        errorText.textContent = "";
    }
});
