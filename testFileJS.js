/**
 * Hàm nạp file JS/CSS linh hoạt, tự động phá cache
 * @param {string} url - Đường dẫn file (.js hoặc .css)
 * @param {boolean} useCacheBuster - Có thêm ?v=... hay không (mặc định có)
 */
function loadModule(url, useCacheBuster = true) {
    const isCSS = url.endsWith('.css');
    const finalUrl = useCacheBuster ? (url + "?v=" + Date.now()) : url;

    if (isCSS) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = finalUrl;
        document.head.appendChild(link);
    } else {
        const script = document.createElement('script');
        script.src = finalUrl;
        script.async = true;
        document.head.appendChild(script);

        // Trả về promise để có thể xử lý sau khi load xong (tùy chọn)
        return new Promise((resolve) => {
            script.onload = () => {
                console.log(`Loaded: ${url}`);
                resolve();
            };
        });
    }
}