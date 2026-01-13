const API_URL = 'https://phone-specs-api.vercel.app/';

const dom = {
    input: document.getElementById('phoneQuery'),
    btn: document.getElementById('execSearch'),
    results: document.getElementById('resultContainer'),
    specs: document.getElementById('specsDisplay'),
    status: document.getElementById('statusMessage')
};

async function getPhoneSpecs() {
    const val = dom.input.value.trim();
    if(!val) return;

    // حالة التحميل
    dom.status.innerHTML = "🔍 جاري البحث في قاعدة البيانات...";
    dom.btn.disabled = true;
    dom.results.classList.add('content-hidden');

    try {
        const search = await fetch(`${API_URL}search?query=${val}`);
        const searchRes = await search.json();

        if(!searchRes.data.phones.length) throw "عذراً، لم نجد مواصفات لهذا الجهاز.";

        const detail = await fetch(`${API_URL}${searchRes.data.phones[0].slug}`);
        const detailRes = await detail.json();
        
        renderUI(detailRes.data);
    } catch (err) {
        dom.status.innerHTML = `⚠️ ${err}`;
    } finally {
        dom.btn.disabled = false;
    }
}

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
