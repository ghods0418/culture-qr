// i18n.js - 다국어 자동 감지 및 수동 변경 엔진 (Placeholder & Element 확장 지원)

let currentTranslations = {};

// 1. 브라우저 언어 감지
function detectLanguage() {
    const savedLang = localStorage.getItem('user_lang');
    if (savedLang) return savedLang;

    const navLang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
    if (navLang.startsWith('ko')) return 'ko';
    if (navLang.startsWith('es')) return 'es';
    if (navLang.startsWith('vi')) return 'vi';
    if (navLang.startsWith('th')) return 'th';
    return 'en';
}

// 2. 화면 텍스트 및 속성 실시간 적용
function applyTranslations(langData, langCode) {
    const translations = langData[langCode] || langData['en'];
    
    // 일반 텍스트 변경
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const keys = element.getAttribute('data-i18n').split('.');
        let text = translations;
        
        keys.forEach(key => {
            if (text) text = text[key];
        });

        if (text) {
            element.textContent = text;
        }
    });

    // 입력창 placeholder 변경
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const keys = element.getAttribute('data-i18n-placeholder').split('.');
        let text = translations;
        
        keys.forEach(key => {
            if (text) text = text[key];
        });

        if (text) {
            element.setAttribute('placeholder', text);
        }
    });
}

// 3. 메인 실행 함수
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('lang.json');
        currentTranslations = await response.json();
        
        const initialLang = detectLanguage();
        applyTranslations(currentTranslations, initialLang);

        const langSelect = document.getElementById('lang-select');
        if (langSelect) {
            langSelect.value = initialLang;
            
            langSelect.addEventListener('change', (e) => {
                const selectedLang = e.target.value;
                localStorage.setItem('user_lang', selectedLang);
                applyTranslations(currentTranslations, selectedLang);
            });
        }
    } catch (error) {
        console.error('i18n initialization failed:', error);
    }
});