document.addEventListener("DOMContentLoaded", function () {
    const currentPage = window.location.pathname;
    
    if (currentPage.includes("statistic.html")) {
        document.querySelector(".dropdown").classList.add("active");
    }
});
