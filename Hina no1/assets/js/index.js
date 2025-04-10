document.addEventListener('DOMContentLoaded', () => {
	const cartIconWrapper = document.querySelector('.cart-icon-wrapper');
	const cartCount = document.querySelector('.cart-count');
	const notLoggedInUserIcon = document.querySelector('.user-icon.not-logged-in');
	const loggedInUserDropdown = document.querySelector('.dropdown.logged-in');
	const logoutBtn = document.getElementById('logoutBtn');

	// Kiểm tra đăng nhập (dựa vào localStorage token)
	function isLoggedIn() {
		return !!localStorage.getItem('token');
	}

	// Lấy số lượng sản phẩm trong giỏ
	function getCartItemCount() {
		const cart = JSON.parse(localStorage.getItem('cart') || '[]');
		return cart.length;
	}

	// Cập nhật giao diện
	function updateHeaderUI() {
		const loggedIn = isLoggedIn();
		
		// User icon
		if (notLoggedInUserIcon) {
			notLoggedInUserIcon.style.display = loggedIn ? 'none' : 'inline-block';
		}
		if (loggedInUserDropdown) {
			loggedInUserDropdown.style.display = loggedIn ? 'inline-block' : 'none';
		}

		// Cart
		if (cartCount) {
			if (loggedIn) {
				const count = getCartItemCount();
				cartCount.textContent = count;
				cartCount.style.display = count > 0 ? 'inline-block' : 'none';
			} else {
				cartCount.style.display = 'none';
			}
		}
	}

	// Xử lý click vào giỏ hàng
	if (cartIconWrapper) {
		cartIconWrapper.addEventListener('click', (e) => {
			e.preventDefault();
			if (!isLoggedIn()) {
				window.location.href = 'login.html';
			} else {
				window.location.href = 'cart.html';
			}
		});
	}

	// Xử lý logout
	if (logoutBtn) {
		logoutBtn.addEventListener('click', (e) => {
			e.preventDefault();
			localStorage.removeItem('token');
			updateHeaderUI();
			window.location.href = 'index.html';
		});
	}

	updateHeaderUI();
});
