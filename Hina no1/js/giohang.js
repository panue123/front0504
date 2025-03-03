document.addEventListener("DOMContentLoaded", function() {
    const selectAllCheckbox = document.querySelector('.order-bg input[type="checkbox"]');
    const productCheckboxes = document.querySelectorAll('tbody input[type="checkbox"]');
    const productRows = document.querySelectorAll('tbody tr');

    const productCountElement = document.querySelector('.order-bg .col-3.order-width:nth-child(3)');
    const totalPriceElement = document.querySelector('.order-bg .col-1.price');

    // Hàm tính lại tổng số lượng sản phẩm và tổng tiền
    function updateTotal() {
        let totalProducts = 0;
        let totalPrice = 0;

        productRows.forEach(row => {
            const checkbox = row.querySelector('input[type="checkbox"]');
            const priceText = row.querySelector('.price').innerText.replace(/[^\d]/g, ''); // Lấy số tiền
            const price = parseInt(priceText);

            if (checkbox.checked) {
                totalProducts += 1;
                totalPrice += price;
            }
        });

        productCountElement.innerText = `${totalProducts} sản phẩm`;
        totalPriceElement.innerText = `₫${totalPrice.toLocaleString()}`;
    }

    // Xử lý chọn tất cả
    selectAllCheckbox.addEventListener('change', function() {
        productCheckboxes.forEach(checkbox => {
            checkbox.checked = selectAllCheckbox.checked;
        });
        updateTotal();
    });

    // Xử lý chọn từng sản phẩm
    productCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (!checkbox.checked) {
                selectAllCheckbox.checked = false;
            } else {
                const allChecked = [...productCheckboxes].every(cb => cb.checked);
                selectAllCheckbox.checked = allChecked;
            }
            updateTotal();
        });
    });

    // Xử lý xóa từng sản phẩm
    const deleteButtons = document.querySelectorAll('tbody .btn-color');

    deleteButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            const row = button.closest('tr');
            if (row) {
                row.remove();
                updateTotal();
            }
        });
    });

    // Khởi động tính tổng lúc mới tải trang
    updateTotal();
});
