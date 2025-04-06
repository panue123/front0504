document.addEventListener("DOMContentLoaded", function () {
    const currentPage = window.location.pathname;
    
    if (currentPage.includes("statistic.html")) {
        document.querySelector(".dropdown").classList.add("active");
    }

    // Khai báo các phần tử DOM
    const totalRevenueElement = document.getElementById("totalRevenue");
    const totalOrdersElement = document.getElementById("totalOrders");
    const totalProductsElement = document.getElementById("totalProducts");
    const totalUsersElement = document.getElementById("totalUsers");
    const revenueChart = document.getElementById("revenueChart");
    const orderChart = document.getElementById("orderChart");
    const productChart = document.getElementById("productChart");

    // Khởi tạo biến
    let revenueChartInstance = null;
    let orderChartInstance = null;
    let productChartInstance = null;

    // Lấy thống kê tổng quan
    async function loadOverviewStats() {
        try {
            const response = await fetch("http://localhost:5000/api/statistics/overview", {
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error("⚠ Không thể tải thống kê!");
            }

            const stats = await response.json();
            
            totalRevenueElement.textContent = formatCurrency(stats.total_revenue);
            totalOrdersElement.textContent = stats.total_orders;
            totalProductsElement.textContent = stats.total_products;
            totalUsersElement.textContent = stats.total_users;
        } catch (error) {
            console.error("❌ Lỗi khi tải thống kê:", error);
            showNotification(error.message, 'error');
        }
    }

    // Lấy thống kê doanh thu theo tháng
    async function loadRevenueStats() {
        try {
            const response = await fetch("http://localhost:5000/api/statistics/revenue", {
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error("⚠ Không thể tải thống kê doanh thu!");
            }

            const data = await response.json();
            
            if (revenueChartInstance) {
                revenueChartInstance.destroy();
            }

            revenueChartInstance = new Chart(revenueChart, {
                type: 'line',
                data: {
                    labels: data.map(item => item.month),
                    datasets: [{
                        label: 'Doanh thu',
                        data: data.map(item => item.revenue),
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Doanh thu theo tháng'
                        }
                    }
                }
            });
        } catch (error) {
            console.error("❌ Lỗi khi tải thống kê doanh thu:", error);
            showNotification(error.message, 'error');
        }
    }

    // Lấy thống kê đơn hàng theo tháng
    async function loadOrderStats() {
        try {
            const response = await fetch("http://localhost:5000/api/statistics/orders", {
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error("⚠ Không thể tải thống kê đơn hàng!");
            }

            const data = await response.json();
            
            if (orderChartInstance) {
                orderChartInstance.destroy();
            }

            orderChartInstance = new Chart(orderChart, {
                type: 'bar',
                data: {
                    labels: data.map(item => item.month),
                    datasets: [{
                        label: 'Số đơn hàng',
                        data: data.map(item => item.count),
                        backgroundColor: 'rgba(54, 162, 235, 0.5)'
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Số đơn hàng theo tháng'
                        }
                    }
                }
            });
        } catch (error) {
            console.error("❌ Lỗi khi tải thống kê đơn hàng:", error);
            showNotification(error.message, 'error');
        }
    }

    // Lấy thống kê sản phẩm bán chạy
    async function loadProductStats() {
        try {
            const response = await fetch("http://localhost:5000/api/statistics/products", {
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error("⚠ Không thể tải thống kê sản phẩm!");
            }

            const data = await response.json();
            
            if (productChartInstance) {
                productChartInstance.destroy();
            }

            productChartInstance = new Chart(productChart, {
                type: 'pie',
                data: {
                    labels: data.map(item => item.name),
                    datasets: [{
                        data: data.map(item => item.quantity),
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.5)',
                            'rgba(54, 162, 235, 0.5)',
                            'rgba(255, 206, 86, 0.5)',
                            'rgba(75, 192, 192, 0.5)',
                            'rgba(153, 102, 255, 0.5)'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Top sản phẩm bán chạy'
                        }
                    }
                }
            });
        } catch (error) {
            console.error("❌ Lỗi khi tải thống kê sản phẩm:", error);
            showNotification(error.message, 'error');
        }
    }

    // Hiển thị thông báo
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Format tiền tệ
    function formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    }

    // Load dữ liệu khi trang được tải
    loadOverviewStats();
    loadRevenueStats();
    loadOrderStats();
    loadProductStats();
});

// Tải thống kê tổng quan
async function loadDashboardStats() {
    try {
        const response = await fetch(`${API_URL}/admin/dashboard/stats`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Không thể tải thống kê');
        }

        const stats = await response.json();
        
        // Cập nhật các chỉ số
        document.getElementById('totalOrders').textContent = stats.totalOrders;
        document.getElementById('totalRevenue').textContent = formatCurrency(stats.totalRevenue);
        document.getElementById('totalUsers').textContent = stats.totalUsers;
        document.getElementById('totalProducts').textContent = stats.totalProducts;
        
        // Cập nhật biểu đồ
        updateCharts(stats);
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

// Cập nhật các biểu đồ
function updateCharts(stats) {
    // Biểu đồ đơn hàng theo tháng
    const ordersChart = document.getElementById('ordersChart');
    if (ordersChart) {
        new Chart(ordersChart, {
            type: 'line',
            data: {
                labels: stats.ordersByMonth.map(item => item.month),
                datasets: [{
                    label: 'Số đơn hàng',
                    data: stats.ordersByMonth.map(item => item.count),
                    borderColor: '#4CAF50',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Đơn hàng theo tháng'
                    }
                }
            }
        });
    }

    // Biểu đồ doanh thu theo tháng
    const revenueChart = document.getElementById('revenueChart');
    if (revenueChart) {
        new Chart(revenueChart, {
            type: 'bar',
            data: {
                labels: stats.revenueByMonth.map(item => item.month),
                datasets: [{
                    label: 'Doanh thu',
                    data: stats.revenueByMonth.map(item => item.amount),
                    backgroundColor: '#2196F3'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Doanh thu theo tháng'
                    }
                }
            }
        });
    }

    // Biểu đồ sản phẩm bán chạy
    const topProductsChart = document.getElementById('topProductsChart');
    if (topProductsChart) {
        new Chart(topProductsChart, {
            type: 'doughnut',
            data: {
                labels: stats.topProducts.map(item => item.name),
                datasets: [{
                    data: stats.topProducts.map(item => item.sold),
                    backgroundColor: [
                        '#FFC107',
                        '#9C27B0',
                        '#FF5722',
                        '#795548',
                        '#607D8B'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Top 5 sản phẩm bán chạy'
                    }
                }
            }
        });
    }
}

// Tải báo cáo theo khoảng thời gian
async function loadReport(startDate, endDate) {
    try {
        const response = await fetch(`${API_URL}/admin/reports?startDate=${startDate}&endDate=${endDate}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Không thể tải báo cáo');
        }

        const report = await response.json();
        
        // Hiển thị báo cáo
        displayReport(report);
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

// Hiển thị báo cáo
function displayReport(report) {
    // Cập nhật tổng quan
    document.getElementById('reportTotalOrders').textContent = report.totalOrders;
    document.getElementById('reportTotalRevenue').textContent = formatCurrency(report.totalRevenue);
    document.getElementById('reportAverageOrderValue').textContent = formatCurrency(report.averageOrderValue);
    
    // Hiển thị bảng chi tiết
    const reportTable = document.getElementById('reportTable');
    if (reportTable) {
        reportTable.innerHTML = report.details.map(item => `
            <tr>
                <td>${formatDate(item.date)}</td>
                <td>${item.orders}</td>
                <td>${formatCurrency(item.revenue)}</td>
                <td>${formatCurrency(item.averageOrderValue)}</td>
            </tr>
        `).join('');
    }
}

// Xử lý tạo báo cáo
async function handleGenerateReport(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const startDate = formData.get('startDate');
    const endDate = formData.get('endDate');
    
    if (!startDate || !endDate) {
        showMessage('Vui lòng chọn khoảng thời gian', 'error');
        return;
    }
    
    await loadReport(startDate, endDate);
}

// Khởi tạo các biến toàn cục
let revenueChart = null;
let topProductsChart = null;
let currentPeriod = 'month'; // Mặc định hiển thị theo tháng

// Kiểm tra quyền admin và khởi tạo trang
document.addEventListener('DOMContentLoaded', function() {
    // Kiểm tra token
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    // Load dữ liệu ban đầu
    loadDashboardData();
    loadRevenueData(currentPeriod);

    // Xử lý sự kiện chọn khoảng thời gian
    document.querySelectorAll('[data-period]').forEach(element => {
        element.addEventListener('click', function(e) {
            e.preventDefault();
            currentPeriod = this.dataset.period;
            loadRevenueData(currentPeriod);
            
            // Cập nhật trạng thái active
            document.querySelectorAll('[data-period]').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
});

// Hàm load dữ liệu tổng quan
async function loadDashboardData() {
    try {
        const response = await fetch('http://localhost:5000/api/dashboard', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) throw new Error('Không thể tải dữ liệu dashboard');

        const data = await response.json();
        
        // Cập nhật số liệu tổng quan
        updateDashboardStats(data);
        
        // Vẽ biểu đồ top sản phẩm
        drawTopProductsChart(data.topProducts);
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu dashboard:', error);
        showError('Không thể tải dữ liệu dashboard. Vui lòng thử lại sau.');
    }
}

// Hàm cập nhật thống kê tổng quan
function updateDashboardStats(data) {
    document.getElementById('total-users').textContent = data.totalUsers;
    document.getElementById('total-products').textContent = data.totalProducts;
    document.getElementById('total-orders').textContent = data.totalOrders;
    document.getElementById('total-revenue').textContent = formatCurrency(data.totalRevenue);
}

// Hàm load dữ liệu thống kê doanh thu
async function loadRevenueData(period) {
    try {
        const response = await fetch(`http://localhost:5000/api/statistics/revenue?period=${period}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) throw new Error('Không thể tải dữ liệu thống kê');

        const data = await response.json();
        
        // Cập nhật bảng thống kê
        updateRevenueTable(data.products);
        
        // Vẽ biểu đồ doanh thu
        drawRevenueChart(data.revenueData);
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu thống kê:', error);
        showError('Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.');
    }
}

// Hàm cập nhật bảng thống kê doanh thu
function updateRevenueTable(products) {
    const tbody = document.getElementById('revenue-table');
    tbody.innerHTML = '';

    products.forEach((product, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${product.name}</td>
            <td>${product.quantity}</td>
            <td>${formatCurrency(product.revenue)}</td>
            <td>${getRankBadge(index + 1)}</td>
        `;
        tbody.appendChild(row);
    });
}

// Hàm vẽ biểu đồ doanh thu
function drawRevenueChart(data) {
    const ctx = document.getElementById('revenue-chart').getContext('2d');
    
    if (revenueChart) {
        revenueChart.destroy();
    }

    revenueChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Doanh thu',
                data: data.values,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
                fill: true,
                backgroundColor: 'rgba(75, 192, 192, 0.1)'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Biểu đồ doanh thu theo thời gian'
                },
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            }
        }
    });
}

// Hàm vẽ biểu đồ top sản phẩm
function drawTopProductsChart(products) {
    const ctx = document.getElementById('top-products-chart').getContext('2d');
    
    if (topProductsChart) {
        topProductsChart.destroy();
    }

    topProductsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: products.map(p => p.name),
            datasets: [{
                label: 'Số lượng bán',
                data: products.map(p => p.quantity),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgb(75, 192, 192)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Top sản phẩm bán chạy'
                },
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Hàm format tiền tệ
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

// Hàm tạo badge xếp hạng
function getRankBadge(rank) {
    const badges = {
        1: '<span class="badge bg-warning">🥇 Top 1</span>',
        2: '<span class="badge bg-secondary">🥈 Top 2</span>',
        3: '<span class="badge bg-danger">🥉 Top 3</span>'
    };
    return badges[rank] || `<span class="badge bg-info">Top ${rank}</span>`;
}

// Hàm hiển thị lỗi
function showError(message) {
    alert(message);
}

// Tải thống kê tổng quan
loadDashboardStats();

// Form tạo báo cáo
const reportForm = document.getElementById('reportForm');
if (reportForm) {
    reportForm.addEventListener('submit', handleGenerateReport);
}
