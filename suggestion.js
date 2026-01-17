/**
 * Hàm tạo gợi ý tự động tích hợp CSS
 * @param {Array} data - Mảng dữ liệu gợi ý
 * @param {HTMLElement} inputEl - Ô input nhập liệu
 * @param {HTMLElement} containerEl - Vùng bao quanh
 */
function initAutocomplete(data, inputEl, containerEl) {
    // 1. Tự động thêm CSS vào <head> nếu chưa có
    if (!document.getElementById('autocomplete-style')) {
        const style = document.createElement('style');
        style.id = 'autocomplete-style';
        style.innerHTML = `
            .suggestion-wrapper { position: relative; width: 100%; }
            .suggestions-list {
                position: absolute; top: 100%; left: 0; right: 0;
                background: white; border: 1px solid #ddd;
                border-radius: 8px; z-index: 9999; list-style: none;
                max-height: 200px; overflow-y: auto; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                padding: 0; margin: 4px 0 0 0;
            }
            .suggestions-list li {
                padding: 12px 15px; border-bottom: 1px solid #eee;
                cursor: pointer; color: #333; font-size: 14px;
            }
            .suggestions-list li:active { background-color: #f8f9fa; color: #e67e22; }
            .selected-tag {
                display: flex; justify-content: space-between; align-items: center;
                background: #fff5eb; color: #e67e22; border: 1px solid #e67e22;
                padding: 10px 15px; border-radius: 8px; font-weight: bold; animation: fadeIn 0.3s;
            }
            .remove-tag {
                background: #e67e22; border: none; color: white;
                width: 22px; height: 22px; border-radius: 50%;
                display: flex; align-items: center; justify-content: center; font-size: 14px;
            }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
        `;
        document.head.appendChild(style);
    }

    // 2. Thiết lập cấu trúc
    containerEl.classList.add('suggestion-wrapper');
    const listEl = document.createElement('ul');
    listEl.className = 'suggestions-list';
    containerEl.appendChild(listEl);

    // 3. Xử lý sự kiện gõ phím
    inputEl.addEventListener('input', function() {
        const val = this.value.trim().toLowerCase();
        listEl.innerHTML = '';
        if (!val) return;

        const matches = data.filter(item => item.toLowerCase().includes(val));
        matches.forEach(match => {
            const li = document.createElement('li');
            li.textContent = match;
            li.addEventListener('click', () => selectItem(match));
            listEl.appendChild(li);
        });
    });

    // 4. Hàm chọn item
    function selectItem(value) {
        inputEl.style.display = 'none';
        listEl.innerHTML = '';

        const tag = document.createElement('div');
        tag.className = 'selected-tag';
        tag.innerHTML = `
            <span>${value}</span>
            <button type="button" class="remove-tag">✕</button>
        `;

        tag.querySelector('.remove-tag').onclick = () => {
            tag.remove();
            inputEl.style.display = 'block';
            inputEl.value = '';
            inputEl.focus();
        };

        containerEl.insertBefore(tag, listEl);
    }

    // Đóng danh sách khi bấm ra ngoài
    document.addEventListener('click', (e) => {
        if (!containerEl.contains(e.target)) listEl.innerHTML = '';
    });
}