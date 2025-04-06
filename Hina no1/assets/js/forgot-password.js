document.addEventListener('DOMContentLoaded', function() {
    const showForgotPasswordBtn = document.getElementById('showForgotPassword');
    const backToLoginBtn = document.getElementById('backToLogin');
    const loginForm = document.getElementById('loginForm');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');

    if (showForgotPasswordBtn && backToLoginBtn && loginForm && forgotPasswordForm) {
        showForgotPasswordBtn.addEventListener('click', function(e) {
            e.preventDefault();
            loginForm.style.display = 'none';
            forgotPasswordForm.style.display = 'block';
        });

        backToLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            forgotPasswordForm.style.display = 'none';
            loginForm.style.display = 'block';
        });
    }
}); 