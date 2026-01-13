const API_BASE = 'https://phone-specs-api.vercel.app/';

const elements = {
    input: document.getElementById('phoneSearchInput'),
    btn: document.getElementById('searchBtn'),
    results: document.getElementById('resultsView'),
    specs: document.getElementById('specsContainer'),
    status: document.getElementById('statusIndicator')
};

async function handleSearch() {
    const query = elements.input.value.trim();
    if (!query) return;

    // تهيئة الواجهة للبحث
    elements.status.innerHTML = "📡 جاري الاتصال بقاعدة البيانات...";
    elements.btn.disabled = true;
    elements.results.classList.add('hidden');

    try {
        const searchResponse = await fetch(`${API_BASE}search?query=${query}`);
        const searchData = await searchResponse.json();

        // الحماية من خطأ TypeError: فحص وجود البيانات أولاً
        if (searchData && searchData.status && searchData.data && searchData.data.phones && searchData.data.phones.length > 0) {
            
            const firstPhoneSlug = searchData.data.phones[0].slug;
            
            // طلب تفاصيل الهاتف المختار
            const detailResponse = await fetch(`${API_BASE}${firstPhoneSlug}`);
            const detailData = await detailResponse.json();

            if (detailData.status) {
                renderPhone(detailData.data);
            } else {
                throw "فشل في جلب تفاصيل الجهاز.";
            }

        } else {
            throw "لم يتم العثور على نتائج. حاول كتابة اسم الجهاز بشكل صحيح.";
        }

    } catch (error) {
        elements.status.innerHTML = `⚠️ خطأ: ${error}`;
        console.error("Technical details:", error);
    } finally {
        elements.btn.disabled = false;
    }
}

function renderPhone(phone) {
    elements.status.innerHTML = "";
    document.getElementById('fullPhoneName').innerText = phone.phone_name;
    document.getElementById('brandLabel').innerText = phone.brand;
    document.getElementById('mainPhoneImg').src = phone.thumbnail;

    // عرض المواصفات الأساسية (نختار أول 8 مواصفات مهمة)
    elements.specs.innerHTML = phone.specifications.slice(0, 10).map(s => `
        <div class="spec-card">
            <h4>${s.title}</h4>
            <p>${s.specs[0].val[0]}</p>
        </div>
    `).join('');

    elements.results.classList.remove('hidden');
}

// استماع للأحداث
elements.btn.addEventListener('click', handleSearch);
elements.input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});
function renderUI(data) {
    dom.status.innerHTML = "";
    document.getElementById('deviceName').innerText = data.phone_name;
    document.getElementById('deviceBrand').innerText = data.brand;
    document.getElementById('deviceImg').src = data.thumbnail;

    dom.specs.innerHTML = data.specifications.map(s => `
        <div class="spec-card">
            <h4>${s.title}</h4>
            <p>${s.specs[0].val[0]}</p>
        </div>
    `).join('');

    dom.results.classList.remove('content-hidden');
}

dom.btn.addEventListener('click', getPhoneSpecs);
dom.input.addEventListener('keypress', (e) => e.key === 'Enter' && getPhoneSpecs());
