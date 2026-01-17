// 1. Dữ liệu mẫu
const dataNCC = ["Chị An", "Anh Bình", "Chú Cường", "Cô Dung"];
const dataTenHang = ["Thịt heo", "Mỡ heo", "Rau củ", "Trứng cút"];
const dataDV = ["Kg", "Gam", "Lít", "Cái"];

// 2. Khởi tạo lần đầu khi load trang
document.addEventListener('DOMContentLoaded', () => {
    // Gợi ý cho Nhà cung cấp
    initAutocomplete(dataNCC, document.getElementById('ncc-input'), document.getElementById('ncc-box'));

    // Gợi ý cho mặt hàng đầu tiên (đã có sẵn trong HTML)
    const firstRow = document.querySelector('.product-item');
    if (firstRow) {
        setupRowAutocomplete(firstRow);
    }
});

// Hàm bổ trợ để gán gợi ý cho một dòng cụ thể
function setupRowAutocomplete(rowEl) {
    const inputTenHang = rowEl.querySelector('.p-name'); // Class của input tên hàng
    const boxTenHang = rowEl.querySelector('.tenHang-box'); // Container bao quanh input tên hàng

    const inputDV = rowEl.querySelector('.p-unit'); // Class của input đơn vị
    const boxDV = rowEl.querySelector('.dv-box'); // Container bao quanh input đơn vị

    if (inputTenHang && boxTenHang) initAutocomplete(dataTenHang, inputTenHang, boxTenHang);
    if (inputDV && boxDV) initAutocomplete(dataDV, inputDV, boxDV);
}

// 3. Hàm thêm mặt hàng mới
function addNewProduct() {
    const list = document.getElementById('product-list');
    const itemCount = list.children.length + 1;

    // Clone dòng đầu tiên
    const newCard = list.children[0].cloneNode(true);

    // DỌN DẸP dòng mới trước khi dùng
    newCard.querySelector('.card-header span').innerText = 'Mặt hàng ' + itemCount;

    // Xóa các danh sách gợi ý cũ (nếu bị clone nhầm sang) và reset input
    newCard.querySelectorAll('.suggestions-list, .selected-tag').forEach(el => el.remove());
    newCard.querySelectorAll('input').forEach(input => {
        input.style.display = 'block'; // Hiện lại input nếu Tag cũ làm ẩn
        input.value = input.classList.contains('p-qty') ? 1 : (input.classList.contains('p-subtotal') ? 0 : '');
    });

    // Xử lý nút xóa
    newCard.querySelector('.remove-btn').onclick = function() {
        if(list.children.length > 1) {
            newCard.remove();
            updateGrandTotal();
        }
    };

    // Thêm vào danh sách
    list.appendChild(newCard);

    // KÍCH HOẠT LẠI GỢI Ý CHO DÒNG MỚI VỪA THÊM
    setupRowAutocomplete(newCard);
}

// 4. Các hàm tính toán giữ nguyên
function calculateRow(input) {
    const row = input.closest('.product-item');
    const qty = parseFloat(row.querySelector('.p-qty').value) || 0;
    const price = parseFloat(row.querySelector('.p-price').value) || 0;
    const subtotalInput = row.querySelector('.p-subtotal');

    const subtotal = qty * price;
    subtotalInput.value = subtotal.toLocaleString('vi-VN');
    updateGrandTotal();
    }
function updateGrandTotal() {
    let total = 0;
    document.querySelectorAll('.p-subtotal').forEach(input => {
        total += parseInt(input.value.replace(/\D/g, '')) || 0;
    });
    document.getElementById('grand-total').innerText = total.toLocaleString('vi-VN') + ' VNĐ';
}

// ------------- Xử lý lấy dữ liệu và tạo JSON ----------------------------
document.addEventListener('DOMContentLoaded', () => {
    const btnSubmit = document.querySelector('.submit-btn');

    if (btnSubmit) {
        btnSubmit.onclick = function() {
            // 1. Lấy tên Nhà cung cấp từ Tag (đã chọn) hoặc từ input (nếu chưa chọn)
            const supplierTag = document.querySelector('#ncc-box .selected-tag span');
            const supplierName = supplierTag ? supplierTag.innerText : document.getElementById('ncc-input').value;

            if (!supplierName) {
                alert("Vui lòng nhập hoặc chọn Nhà cung cấp!");
                return;
            }

            // 2. Lấy danh sách mặt hàng
            const items = [];
            const productRows = document.querySelectorAll('.product-item');

            productRows.forEach((row, index) => {
                // Lấy tên hàng (từ Tag hoặc input)
                const pNameTag = row.querySelector('.tenHang-box .selected-tag span');
                const pName = pNameTag ? pNameTag.innerText : row.querySelector('.p-name').value;

                // Lấy đơn vị (từ Tag hoặc input)
                const pUnitTag = row.querySelector('.dv-box .selected-tag span');
                const pUnit = pUnitTag ? pUnitTag.innerText : row.querySelector('.p-unit').value;

                const pQty = parseFloat(row.querySelector('.p-qty').value) || 0;
                const pPrice = parseFloat(row.querySelector('.p-price').value) || 0;
                const pSubtotal = pQty * pPrice;

                // Chỉ thêm vào danh sách nếu có tên hàng
                if (pName) {
                    items.push({
                        stt: index + 1,
                        ten_hang: pName,
                        don_vi: pUnit,
                        so_luong: pQty,
                        don_gia: pPrice,
                        thanh_tien: pSubtotal
                    });
                }
            });

            if (items.length === 0) {
                alert("Vui lòng nhập ít nhất một mặt hàng!");
                return;
            }

            // 3. Tạo cấu trúc JSON hoàn chỉnh
            const receiptData = {
                ngay_nhap: new Date().toLocaleString('vi-VN'),
                timestamp: Date.now(),
                nha_cung_cap: supplierName,
                danh_sach_hang: items,
                tong_tien: items.reduce((sum, item) => sum + item.thanh_tien, 0)
            };

            // 4. Log ra console để kiểm tra (Đây là dữ liệu sẽ đẩy lên Realtime DB)
            console.log("Dữ liệu JSON sẵn sàng:");
            console.log(JSON.stringify(receiptData, null, 2));

            alert("Đã tạo dữ liệu JSON thành công! Kiểm tra Console log.");

            // Sau này lệnh đẩy lên Realtime sẽ viết ở đây:
            // database.ref('phieu_nhap/').push(receiptData);
        };
    }
});
