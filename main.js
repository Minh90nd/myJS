// Hàm chuyển trang đơn giản
function showPage(pageId) {
    // Ẩn tất cả các trang
    document.querySelectorAll('.page-section').forEach(sec => {
        sec.classList.remove('active');
    });
    // Hiện trang được chọn
    document.getElementById(pageId).classList.add('active');

    // Cuộn lên đầu trang
    window.scrollTo(0, 0);
}