// i18n translations
const translations = {
    en: {
        'home.title': 'Travel Packing',
        'home.subtitle': 'Pack Smart, Travel Light ✈️',
        'home.create': '＋ Create New List',
        'home.packed': 'Packed',
        'home.completed': 'Completed ✓',
        'detail.documents': 'Documents',
        'detail.clothing': 'Clothing',
        'detail.electronics': 'Electronics',
        'detail.ready': 'Ready',
        'detail.progress': 'Packing Progress',
        'detail.weight': 'Luggage Weight'
    },
    zh: {
        'home.title': '旅行清单',
        'home.subtitle': '智能打包，轻松出行 ✈️',
        'home.create': '＋ 创建新清单',
        'home.packed': '已打包',
        'home.completed': '已完成 ✓',
        'detail.documents': '证件类',
        'detail.clothing': '衣物类',
        'detail.electronics': '电子产品类',
        'detail.ready': '已准备',
        'detail.progress': '打包进度',
        'detail.weight': '行李重量'
    }
};

let currentLanguage = 'en';

function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'zh' : 'en';
    document.getElementById('currentLang').textContent = currentLanguage.toUpperCase();
    updatePageText();
}

function updatePageText() {
    const t = translations[currentLanguage];
    document.querySelectorAll('[data-i18n]').forEach(elem => {
        const key = elem.getAttribute('data-i18n');
        if (t[key]) {
            elem.textContent = t[key];
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updatePageText();
});