document.addEventListener('DOMContentLoaded', () => {
    // Khởi tạo carousel
    initCarousel();

    // Tải dữ liệu
    loadFeaturedCategories();
});

// Khởi tạo carousel
function initCarousel() {
    const carousel = document.querySelector('#carouselExampleDark');
    if (carousel) {
        // Khởi tạo carousel với các tùy chọn
        const carouselInstance = new bootstrap.Carousel(carousel, {
            interval: 3000,
            wrap: true,
            touch: true
        });

        // Tắt pause mặc định của Bootstrap
        carousel.setAttribute('data-bs-pause', 'false');
        
        // Tắt pause trên tất cả các phần tử con
        const carouselItems = carousel.querySelectorAll('.carousel-item');
        carouselItems.forEach(item => {
            item.setAttribute('data-bs-pause', 'false');
        });
    }
} 