let GEMINI_KEY = '';

const knownDrugs = [
  { generic: 'Aspirin', brands: ['Ecosprin', 'Disprin', 'Loprin'] },
  { generic: 'Paracetamol', brands: ['Crocin', 'Dolo 650', 'Calpol', 'Tylenol', 'Panadol'] },
  { generic: 'Ibuprofen', brands: ['Brufen', 'Advil', 'Nurofen', 'Combiflam'] },
  { generic: 'Warfarin', brands: ['Coumadin', 'Warf'] },
  { generic: 'Metformin', brands: ['Glycomet', 'Glucophage', 'Obimet'] },
  { generic: 'Lisinopril', brands: ['Listril', 'Zestril', 'Prinivil'] },
  { generic: 'Atorvastatin', brands: ['Lipitor', 'Atorva', 'Storvas'] },
  { generic: 'Metoprolol', brands: ['Betaloc', 'Toprol', 'Metolar'] },
  { generic: 'Omeprazole', brands: ['Prilosec', 'Omez', 'Losec'] },
  { generic: 'Amlodipine', brands: ['Amlokind', 'Norvasc', 'Stamlo'] },
  { generic: 'Losartan', brands: ['Cozaar', 'Losakind', 'Repace'] },
  { generic: 'Simvastatin', brands: ['Zocor', 'Simvotin'] },
  { generic: 'Pantoprazole', brands: ['Pantop', 'Protonix', 'Pan D'] },
  { generic: 'Ciprofloxacin', brands: ['Cifran', 'Ciplox', 'Cipro'] },
  { generic: 'Amoxicillin', brands: ['Mox', 'Amoxil', 'Novamox'] },
  { generic: 'Azithromycin', brands: ['Azithral', 'Zithromax', 'Azee'] },
  { generic: 'Cetirizine', brands: ['Zyrtec', 'Alerid', 'Cetzine'] },
  { generic: 'Sertraline', brands: ['Zoloft', 'Serta'] },
  { generic: 'Escitalopram', brands: ['Lexapro', 'Nexito'] },
  { generic: 'Gabapentin', brands: ['Neurontin', 'Gabapin'] },
  { generic: 'Clopidogrel', brands: ['Plavix', 'Clopilet', 'Deplatt'] },
  { generic: 'Furosemide', brands: ['Lasix', 'Frusenex'] },
  { generic: 'Levothyroxine', brands: ['Synthroid', 'Thyronorm', 'Eltroxin'] },
  { generic: 'Prednisone', brands: ['Deltasone', 'Omnacortil'] },
  { generic: 'Diclofenac', brands: ['Voveran', 'Voltaren', 'Movon'] },
  { generic: 'Sildenafil', brands: ['Viagra', 'Penegra', 'Manforce'] },
  { generic: 'Tramadol', brands: ['Ultram', 'Tramazac'] },
  { generic: 'Digoxin', brands: ['Lanoxin', 'Digicor'] },
  { generic: 'Rosuvastatin', brands: ['Crestor', 'Rozucor', 'Rosuvas'] },
  { generic: 'Hydroxychloroquine', brands: ['Plaquenil', 'HCQS'] },
];

let drugs = [];

const drugInput = document.getElementById('drugInput');
const addBtn = document.getElementById('addBtn');
const pillsArea = document.getElementById('pillsArea');
const pillsPlaceholder = document.getElementById('pillsPlaceholder');
const checkBtn = document.getElementById('checkBtn');
const loadingArea = document.getElementById('loadingArea');
const loadingText = document.getElementById('loadingText');
const resultsArea = document.getElementById('resultsArea');
const suggestions = document.getElementById('suggestions');
const resultsList = document.getElementById('resultsList');
const resultsBadge = document.getElementById('resultsBadge');
const drugInfoRow = document.getElementById('drugInfoRow');

const lookupInput = document.getElementById('lookupInput');
const lookupBtn = document.getElementById('lookupBtn');
const lookupLoadingArea = document.getElementById('lookupLoadingArea');
const lookupResults = document.getElementById('lookupResults');

const drugModal = document.getElementById('drugModal');
const modalContent = document.getElementById('modalContent');
const modalClose = document.getElementById('modalClose');

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
  });
});

function getMatches(val) {
  const q = val.toLowerCase();
  return knownDrugs.filter(d =>
    d.generic.toLowerCase().includes(q) ||
    d.brands.some(b => b.toLowerCase().includes(q))
  ).slice(0, 7);
}

drugInput.addEventListener('input', () => {
  const val = drugInput.value.trim();
  if (val.length < 2) { suggestions.classList.remove('open'); return; }
  const hits = getMatches(val).filter(d => !drugs.includes(d.generic));
  if (!hits.length) { suggestions.classList.remove('open'); return; }
  suggestions.innerHTML = hits.map(h => `
    <div class="sug-item" data-name="${h.generic}">
      <span>${h.generic}</span>
      <span class="sug-brand">${h.brands.slice(0,2).join(', ')}</span>
    </div>
  `).join('');
  suggestions.classList.add('open');
});

suggestions.addEventListener('click', e => {
  const item = e.target.closest('.sug-item');
  if (!item) return;
  drugInput.value = item.dataset.name;
  suggestions.classList.remove('open');
  drugInput.focus();
});

document.addEventListener('click', e => {
  if (!e.target.closest('.input-wrap')) suggestions.classList.remove('open');
});

drugInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') addDrug();
});

addBtn.addEventListener('click', addDrug);

function addDrug() {
  const raw = drugInput.value.trim();
  if (!raw) return;

  const match = knownDrugs.find(d =>
    d.generic.toLowerCase() === raw.toLowerCase() ||
    d.brands.some(b => b.toLowerCase() === raw.toLowerCase())
  );

  const name = match ? match.generic : raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
  if (drugs.includes(name)) { drugInput.value = ''; return; }

  drugs.push(name);
  drugInput.value = '';
  suggestions.classList.remove('open');
  renderPills();
  updateBtn();
}

function removeDrug(name) {
  drugs = drugs.filter(d => d !== name);
  renderPills();
  updateBtn();
}

function renderPills() {
  if (drugs.length === 0) {
    pillsArea.innerHTML = '';
    pillsArea.appendChild(pillsPlaceholder);
    pillsPlaceholder.style.display = 'inline';
    return;
  }
  pillsPlaceholder.style.display = 'none';
  pillsArea.innerHTML = drugs.map(d => `
    <div class="pill">
      <span onclick="openDrugModal('${d}')" style="cursor:pointer">${d}</span>
      <span class="pill-info" onclick="openDrugModal('${d}')">ℹ️</span>
      <button class="pill-x" onclick="removeDrug('${d}')">×</button>
    </div>
  `).join('');
}

function updateBtn() {
  checkBtn.disabled = drugs.length < 2;
}

checkBtn.addEventListener('click', runCheck);

async function runCheck() {
  checkBtn.disabled = true;
  loadingArea.classList.add('show');
  resultsArea.classList.remove('show');

  try {
    loadingText.textContent = 'Looking up medications...';
    const rxcuis = await Promise.all(drugs.map(fetchRxCUI));
    const valid = rxcuis.filter(r => r.rxcui);

    if (valid.length < 2) {
      showError("Couldn't find some medications in the database. Please check spelling.");
      return;
    }

    loadingText.textContent = 'Fetching drug information...';
    const drugInfos = await Promise.all(drugs.map(fetchDrugInfo));

    loadingText.textContent = 'Scanning for interactions...';
    const cuiStr = valid.map(r => r.rxcui).join('+');
    const rawData = await fetchRxInteractions(cuiStr);

    loadingText.textContent = 'AI is explaining results...';
    const enhanced = await callGemini(rawData, drugs);

    if (enhanced === null) return;
    showResults(enhanced, drugInfos);
  } catch (err) {
    showError("Something went wrong. Please try again.");
    console.error(err);
  } finally {
    loadingArea.classList.remove('show');
    checkBtn.disabled = drugs.length < 2;
  }
}

async function fetchRxCUI(drugName) {
  try {
    const res = await fetch(`https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${encodeURIComponent(drugName)}&search=1`);
    const data = await res.json();
    const rxcui = data?.idGroup?.rxnormId?.[0];
    return { drug: drugName, rxcui };
  } catch {
    return { drug: drugName, rxcui: null };
  }
}

async function fetchRxInteractions(cuiStr) {
  try {
    const res = await fetch(`https://rxnav.nlm.nih.gov/REST/interaction/list.json?rxcuis=${cuiStr}`);
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchDrugInfo(drugName) {
  try {
    const res = await fetch(`https://api.fda.gov/drug/label.json?search=openfda.generic_name:"${encodeURIComponent(drugName)}"+OR+openfda.brand_name:"${encodeURIComponent(drugName)}"&limit=1`);
    const data = await res.json();
    const result = data?.results?.[0];
    if (!result) return { name: drugName, found: false };

    const brandNames = result?.openfda?.brand_name || [];
    const genericNames = result?.openfda?.generic_name || [];

    const cleanText = (str) => {
      if (!str) return '';
      return str
        .replace(/<[^>]+>/g, '')
        .replace(/^\d+\s+[A-Z][A-Z ]+\s+/g, '')
        .replace(/^[A-Z][A-Z ]{4,}\s+/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    };

    const purpose = cleanText(result?.purpose?.[0] || result?.indications_and_usage?.[0] || '');
    const warnings = cleanText(result?.warnings?.[0] || result?.boxed_warning?.[0] || '');
    const sideEffects = cleanText(result?.adverse_reactions?.[0] || '');

    return {
      name: drugName,
      found: true,
      brandNames: [...new Set(brandNames)].slice(0, 6),
      genericName: genericNames[0] || drugName,
      purpose: purpose.substring(0, 350),
      warnings: warnings.substring(0, 450),
      sideEffects: sideEffects.substring(0, 450),
    };
  } catch {
    return { name: drugName, found: false };
  }
}

async function callGemini(rxData, drugNames) {
  const raw = [];

  if (rxData?.fullInteractionTypeGroup) {
    for (const group of rxData.fullInteractionTypeGroup) {
      for (const type of group.fullInteractionType || []) {
        for (const pair of type.interactionPair || []) {
          const names = pair.interactionConcept?.map(c => c.minConceptItem?.name) || [];
          raw.push({ drug1: names[0] || '', drug2: names[1] || '', description: pair.description || '', severity: pair.severity || '' });
        }
      }
    }
  }

  const prompt = `You are a clinical pharmacist AI checking drug interactions.
Drugs to check: ${drugNames.join(', ')}.
NIH RxNorm data found: ${JSON.stringify(raw)}

IMPORTANT: Even if the NIH data is empty, USE YOUR OWN MEDICAL KNOWLEDGE to identify any known interactions between these drugs. Do not just return NONE if you know interactions exist.

For every pair of drugs, check if there is a known clinical interaction. Common ones to always check: CNS depressants together, blood thinners + NSAIDs, serotonin syndrome combinations, QT prolongation combinations, etc.

Return ONLY a JSON array, no other text. Each object must have:
- drug1: string (first drug name)
- drug2: string (second drug name)
- severity: "MAJOR" | "MODERATE" | "MINOR" | "NONE"
- plainEnglish: 1-2 sentences explaining the risk in simple everyday language a non-doctor can understand
- advice: 1 sentence telling the patient what to do
- emoji: 🔴 for MAJOR, 🟠 for MODERATE, 🟢 for MINOR or NONE

Only return one object with severity "NONE" if you are truly certain there are NO interactions at all.`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 4096 }
        })
      }
    );

    if (!res.ok) {
      const errBody = await res.json();
      const errMsg = errBody?.error?.message || res.statusText;
      showGeminiError(errMsg);
      return null;
    }

    const data = await res.json();

    if (data?.promptFeedback?.blockReason) {
      showGeminiError('Request blocked: ' + data.promptFeedback.blockReason);
      return null;
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    if (!text) {
      showGeminiError('Empty response from Gemini.');
      return null;
    }

    const cleaned = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);

  } catch (err) {
    showGeminiError('Network error: ' + err.message);
    return null;
  }
}

function showResults(interactions, drugInfos) {
  resultsArea.classList.add('show');

  drugInfoRow.innerHTML = drugInfos.filter(d => d.found).map(d => `
    <div class="drug-mini-card" onclick="openDrugModalFromInfo(${JSON.stringify(d).replace(/"/g, '&quot;')})">
      <div class="dmc-name">${d.name}</div>
      <div class="dmc-brand">${d.brandNames?.slice(0,2).join(', ') || ''}</div>
      <div class="dmc-use">${d.purpose || 'Tap to view details'}</div>
      <div class="dmc-tap">Tap for full info →</div>
    </div>
  `).join('');

  if (interactions[0]?.severity === 'NONE') {
    resultsBadge.textContent = 'No interactions found';
    resultsList.innerHTML = `
      <div class="r-card none">
        <span class="safe-emoji">✅</span>
        <div class="safe-title">Looks Safe!</div>
        <p class="safe-desc">${interactions[0].plainEnglish}<br><br>${interactions[0].advice}</p>
      </div>`;
    return;
  }

  resultsBadge.textContent = `${interactions.length} interaction${interactions.length > 1 ? 's' : ''} found`;
  resultsList.innerHTML = interactions.map((item, i) => {
    const cls = item.severity === 'MAJOR' ? 'major' : item.severity === 'MODERATE' ? 'moderate' : 'minor';
    return `
      <div class="r-card ${cls}" style="animation-delay:${i * 0.07}s">
        <div class="r-top">
          <div class="drug-pair">
            <span class="dtag">${item.drug1 || drugs[0]}</span>
            <span class="plus">+</span>
            <span class="dtag">${item.drug2 || drugs[1]}</span>
          </div>
          <span class="sev-badge sev-${cls}">${item.emoji} ${item.severity}</span>
        </div>
        <p class="r-desc">${item.plainEnglish}</p>
        <div class="r-advice"><span>💬</span><span>${item.advice}</span></div>
      </div>`;
  }).join('');
}

function showError(msg) {
  resultsArea.classList.add('show');
  resultsBadge.textContent = 'Error';
  drugInfoRow.innerHTML = '';
  resultsList.innerHTML = `<div class="r-card major"><p class="r-desc">⚠️ ${msg}</p></div>`;
}

function showGeminiError(msg) {
  resultsArea.classList.add('show');
  resultsBadge.textContent = 'API Error';
  resultsList.innerHTML = `
    <div class="r-card major">
      <p class="r-desc" style="font-weight:600;margin-bottom:8px">🔴 Gemini API Error</p>
      <p class="r-desc">${msg}</p>
      <div class="r-advice"><span>💡</span><span>Check your API key is correct and has the Gemini API enabled at <strong>aistudio.google.com</strong>. Also make sure you're not on a VPN.</span></div>
    </div>`;
}

async function openDrugModal(name) {
  drugModal.classList.add('open');
  modalContent.innerHTML = `<div class="modal-spinner"><div class="spinner"></div><p>Loading info...</p></div>`;
  const info = await fetchDrugInfo(name);
  renderModal(info, name);
}

function openDrugModalFromInfo(info) {
  drugModal.classList.add('open');
  renderModal(info, info.name);
}

function renderModal(info, name) {
  if (!info.found) {
    modalContent.innerHTML = `
      <div class="modal-drug-name">${name}</div>
      <p class="modal-generic">No detailed info found in the FDA database for this drug.</p>`;
    return;
  }

  modalContent.innerHTML = `
    <div class="modal-drug-name">${name}</div>
    <div class="modal-generic">${info.genericName !== name ? 'Generic: ' + info.genericName : ''}</div>
    ${info.brandNames?.length ? `
      <div class="modal-brands">
        ${info.brandNames.map(b => `<span class="brand-tag">${b}</span>`).join('')}
      </div>` : ''}
    ${info.purpose ? `
      <div class="modal-section">
        <div class="modal-section-title">What it's used for</div>
        <div class="modal-section-body">${info.purpose}</div>
      </div>` : ''}
    ${info.sideEffects ? `
      <div class="modal-section">
        <div class="modal-section-title">Common side effects</div>
        <div class="modal-section-body">${info.sideEffects}</div>
      </div>` : ''}
    ${info.warnings ? `
      <div class="modal-section">
        <div class="modal-section-title">⚠️ Warnings</div>
        <div class="modal-section-body">${info.warnings}</div>
      </div>` : ''}
  `;
}

modalClose.addEventListener('click', () => drugModal.classList.remove('open'));
drugModal.addEventListener('click', e => { if (e.target === drugModal) drugModal.classList.remove('open'); });

lookupBtn.addEventListener('click', () => doLookup(lookupInput.value.trim()));
lookupInput.addEventListener('keydown', e => { if (e.key === 'Enter') doLookup(lookupInput.value.trim()); });

async function doLookup(query) {
  if (!query) return;
  lookupInput.value = query;

  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelector('[data-tab="lookup"]').classList.add('active');
  document.getElementById('tab-lookup').classList.add('active');

  lookupLoadingArea.classList.add('show');
  lookupResults.innerHTML = '';

  try {
    const res = await fetch(`https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${encodeURIComponent(query)}"+OR+openfda.generic_name:"${encodeURIComponent(query)}"&limit=4`);
    const data = await res.json();

    if (!data?.results?.length) {
      lookupResults.innerHTML = `<div class="no-results">😕 No results found for "<strong>${query}</strong>".<br>Try a different spelling or the generic name.</div>`;
      return;
    }

    lookupResults.innerHTML = data.results.map((r, i) => {
      const brands = [...new Set(r?.openfda?.brand_name || [])].slice(0, 6);
      const generic = r?.openfda?.generic_name?.[0] || '';
      const cleanFda = (str) => {
        if (!str) return '';
        return str.replace(/<[^>]+>/g, '').replace(/^\d+\s+[A-Z][A-Z ]+\s+/g, '').replace(/^[A-Z][A-Z ]{4,}\s+/g, '').replace(/\s+/g, ' ').trim();
      };
      const purpose = cleanFda(r?.purpose?.[0] || r?.indications_and_usage?.[0] || 'No description available.').substring(0, 350);
      const sideEffects = cleanFda(r?.adverse_reactions?.[0] || '').substring(0, 300);
      const warnings = cleanFda(r?.warnings?.[0] || r?.boxed_warning?.[0] || '').substring(0, 350);
      const displayName = brands[0] || generic || query;

      return `
        <div class="lookup-card" style="animation-delay:${i * 0.08}s">
          <div class="lc-header">
            <div class="lc-names">
              <h3>${displayName}</h3>
              ${generic && generic !== displayName ? `<div class="lc-generic">Generic: ${generic}</div>` : ''}
            </div>
          </div>
          ${brands.length ? `<div class="lc-brands">${brands.map(b => `<span class="brand-tag">${b}</span>`).join('')}</div>` : ''}
          ${purpose ? `
            <div class="lc-section">
              <div class="lc-section-title">What it's used for</div>
              <div class="lc-section-body">${purpose}</div>
            </div>` : ''}
          ${sideEffects ? `
            <div class="lc-section">
              <div class="lc-section-title">Common side effects</div>
              <div class="lc-section-body">${sideEffects}</div>
            </div>` : ''}
          ${warnings ? `
            <div class="lc-section">
              <div class="lc-section-title">⚠️ Warnings</div>
              <div class="lc-section-body">${warnings}</div>
            </div>` : ''}
          <button class="lc-add-btn" onclick="addFromLookup('${generic || displayName}')">+ Add to Interaction Checker</button>
        </div>`;
    }).join('');
  } catch {
    lookupResults.innerHTML = `<div class="no-results">⚠️ Something went wrong fetching data. Please try again.</div>`;
  } finally {
    lookupLoadingArea.classList.remove('show');
  }
}

function addFromLookup(name) {
  if (!drugs.includes(name)) {
    drugs.push(name);
    renderPills();
    updateBtn();
  }
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelector('[data-tab="checker"]').classList.add('active');
  document.getElementById('tab-checker').classList.add('active');
}

const keyOverlay = document.getElementById('keyOverlay');
const keyInput = document.getElementById('keyInput');
const keySubmit = document.getElementById('keySubmit');
const keyError = document.getElementById('keyError');
const keyToggle = document.getElementById('keyToggle');
const changeKeyBtn = document.getElementById('changeKeyBtn');

keyToggle.addEventListener('click', () => {
  keyInput.type = keyInput.type === 'password' ? 'text' : 'password';
  keyToggle.textContent = keyInput.type === 'password' ? '👁' : '🙈';
});

keyInput.addEventListener('keydown', e => { if (e.key === 'Enter') submitKey(); });
keySubmit.addEventListener('click', submitKey);

function submitKey() {
  const val = keyInput.value.trim();
  if (!val) { keyError.textContent = 'Please enter your API key.'; return; }
  GEMINI_KEY = val;
  keyOverlay.classList.add('hide');
  setTimeout(() => { keyOverlay.style.display = 'none'; }, 400);
}

changeKeyBtn.addEventListener('click', () => {
  keyInput.value = GEMINI_KEY;
  keyError.textContent = '';
  keyOverlay.style.display = 'flex';
  keyOverlay.classList.remove('hide');
  keySubmit.textContent = 'Update Key →';
});
