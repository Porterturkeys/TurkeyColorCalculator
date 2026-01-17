// -----------------------------------------------------
// GLOBAL GUARDS (prevents default-name injection on load)
// -----------------------------------------------------
window.__VarietySyncState = window.__VarietySyncState || {
  allow: { sire: false, dam: false },     // only true after user action
  active: { sire: false, dam: false },    // true while user typing/focused
  last: { sire: "", dam: "" }
};

function __setAllow(prefix) {
  if (prefix === "sire" || prefix === "dam") {
    window.__VarietySyncState.allow[prefix] = true;
  }
}

function __isActive(prefix) {
  return !!window.__VarietySyncState.active[prefix];
}

function __readPhenotypeFromContainer(prefix) {
  const containerId = prefix === "sire" ? "sireImageContainer" : "damImageContainer";
  const container = document.getElementById(containerId);
  if (!container) return "";
  const span = container.querySelector("strong span");
  return (span && span.textContent) ? span.textContent.trim() : "";
}

function __clearSuggestionUI(prefix) {
  // Clear custom suggestion boxes if they exist
  const boxId = prefix === "sire" ? "sireSuggestionsBox" : "damSuggestionsBox";
  const box = document.getElementById(boxId);
  if (box) {
    box.innerHTML = "";
    box.style.display = "none";
  }

  // Clear datalist (prevents stale suggestions)
  const inputId = prefix === "sire" ? "sireVarietyInput" : "damVarietyInput";
  const input = document.getElementById(inputId);
  if (input) {
    const listId = input.getAttribute("list");
    if (listId) {
      const dl = document.getElementById(listId);
      if (dl) dl.innerHTML = "";
    }
  }
}

function __syncInputFromContainer(prefix) {
  // Only sync after a real user action (allele change / saved load / offspring continue)
  if (!window.__VarietySyncState.allow[prefix]) return;

  // Never overwrite while user is typing/focused in either input
  if (__isActive("sire") || __isActive("dam")) return;

  const pheno = __readPhenotypeFromContainer(prefix);
  if (!pheno) return;

  if (window.__VarietySyncState.last[prefix] === pheno) return;
  window.__VarietySyncState.last[prefix] = pheno;

  const inputId = prefix === "sire" ? "sireVarietyInput" : "damVarietyInput";
  const input = document.getElementById(inputId);
  if (!input) return;

  if ((input.value || "").trim() !== pheno) {
    input.value = pheno;
    __clearSuggestionUI(prefix);
  }
}


// =====================================================
// YOUR ORIGINAL WORKING FUNCTION (FULL) + SAFE ADDITIONS
// =====================================================
function transferOffspringToParent(genotype, parent) {
const genotypeParts = genotype.split(' ');

const alleleMapping = {
B: parent === 'sire' ? 'sireAlleleb' : 'damAlleleb',
b: parent === 'sire' ? 'sireAlleleb' : 'damAlleleb',
C: parent === 'sire' ? 'sireAlleleC' : 'damAlleleC',
cg: parent === 'sire' ? 'sireAlleleC' : 'damAlleleC',
cm: parent === 'sire' ? 'sireAlleleC' : 'damAlleleC',
c: parent === 'sire' ? 'sireAlleleC' : 'damAlleleC',
D: parent === 'sire' ? 'sireAlleled' : 'damAlleled',
d: parent === 'sire' ? 'sireAlleled' : 'damAlleled',
E: parent === 'sire' ? 'sireAlleleE' : 'damAlleleE',
e: parent === 'sire' ? 'sireAlleleE' : 'damAlleleE',
N: parent === 'sire' ? 'sireAlleleN' : 'damAlleleN',
n: parent === 'sire' ? 'sireAlleleN' : 'damAlleleN',
Pn: parent === 'sire' ? 'sireAllelePn' : 'damAllelePn',
pn: parent === 'sire' ? 'sireAllelePn' : 'damAllelePn',
R: parent === 'sire' ? 'sireAlleleR' : 'damAlleleR',
r: parent === 'sire' ? 'sireAlleleR' : 'damAlleleR',
Sl: parent === 'sire' ? 'sireAlleleSl' : 'damAlleleSl',
sl: parent === 'sire' ? 'sireAlleleSl' : 'damAlleleSl',
Sp: parent === 'sire' ? 'sireAlleleSp' : 'damAlleleSp',
sp: parent === 'sire' ? 'sireAlleleSp' : 'damAlleleSp'
};

console.log("Transferring to " + parent);
console.log("Genotype parts: ", genotypeParts);

genotypeParts.forEach(part => {
const key = Object.keys(alleleMapping).find(k => part.startsWith(k));
if (key) {
console.log("Mapping ", part, " to ", alleleMapping[key]);
document.getElementById(alleleMapping[key]).value = part;
} else {
console.log("No mapping found for ", part);
}
});

// Explicitly handle cg, cm, c, D, pn, r, sl, sp to their defaults
if (!genotype.includes('cg') && !genotype.includes('cm') && !genotype.includes('c') && parent === 'sire') {
document.getElementById('sireAlleleC').value = 'CC';
} else if (!genotype.includes('cg') && !genotype.includes('cm') && !genotype.includes('c') && parent === 'dam') {
document.getElementById('damAlleleC').value = 'CC';
}
if (!genotype.includes('D') && parent === 'sire') {
document.getElementById('sireAlleled').value = 'dd';
} else if (!genotype.includes('D') && parent === 'dam') {
document.getElementById('damAlleled').value = 'dd';
}
if (!genotype.includes('Pn') && !genotype.includes('pn') && parent === 'sire') {
document.getElementById('sireAllelePn').value = 'PnPn';
} else if (!genotype.includes('Pn') && !genotype.includes('pn') && parent === 'dam') {
document.getElementById('damAllelePn').value = 'PnPn';
}

if (!genotype.includes('R') && !genotype.includes('r') && parent === 'sire') {
document.getElementById('sireAlleleR').value = 'RR';
} else if (!genotype.includes('R') && !genotype.includes('r') && parent === 'dam') {
document.getElementById('damAlleleR').value = 'RR';
}
if (!genotype.includes('Sl') && !genotype.includes('sl') && parent === 'sire') {
document.getElementById('sireAlleleSl').value = 'SlSl';
} else if (!genotype.includes('Sl') && !genotype.includes('sl') && parent === 'dam') {
document.getElementById('damAlleleSl').value = 'SlSl';
}
if (!genotype.includes('Sp') && !genotype.includes('sp') && parent === 'sire') {
document.getElementById('sireAlleleSp').value = 'SpSp';
} else if (!genotype.includes('Sp') && !genotype.includes('sp') && parent === 'dam') {
document.getElementById('damAlleleSp').value = 'SpSp';
}

// Handle the E locus specifically
if (parent === 'sire') {
if (!genotype.includes('E') && !genotype.includes('e')) {
document.getElementById('sireAlleleE').value = 'EE';
} else if (genotype.includes('ee')) {
document.getElementById('sireAlleleE').value = 'ee';
} else {
document.getElementById('sireAlleleE').value = 'Ee';
}
} else {
if (!genotype.includes('E') && !genotype.includes('e') && !genotype.includes('e-')) {
document.getElementById('damAlleleE').value = 'E-';
} else if (genotype.includes('e-')) {
document.getElementById('damAlleleE').value = 'e-';
} else {
document.getElementById('damAlleleE').value = 'E-';
}
}

// Handle the N locus specifically
if (parent === 'sire') {
if (!genotype.includes('N') && !genotype.includes('n')) {
document.getElementById('sireAlleleN').value = 'NN';
} else if (genotype.includes('nn')) {
document.getElementById('sireAlleleN').value = 'nn';
} else {
document.getElementById('sireAlleleN').value = 'Nn';
}
} else {
if (!genotype.includes('N') && !genotype.includes('n') && !genotype.includes('n-')) {
document.getElementById('damAlleleN').value = 'N-';
} else if (genotype.includes('n-')) {
document.getElementById('damAlleleN').value = 'n-';
} else {
document.getElementById('damAlleleN').value = 'N-';
}
}

if (parent === 'sire') {
updateSireGenotype();
} else {
updateDamGenotype();
}

///////////////////

// ---- Sync variety input to the newly transferred offspring  ----
// ALSO: enable observer syncing for this parent from now on
try {
    __setAllow(parent);

    const containerId = parent === 'sire' ? 'sireImageContainer' : 'damImageContainer';
    const inputId     = parent === 'sire' ? 'sireVarietyInput'  : 'damVarietyInput';

    const container = document.getElementById(containerId);
    const input     = document.getElementById(inputId);

    if (container && input) {
        const span = container.querySelector('strong span');
        if (span && span.textContent) {
            input.value = span.textContent.trim();
            __clearSuggestionUI(parent);
        }
    }
} catch (e) {
    console.warn('Variety input sync skipped:', e);
}

  //////////////////////////////////////

// Show acknowledgment popup
    showPopup(`The selected offspring has been transferred to the ${parent === 'sire' ? 'Sire' : 'Dam'} container for further calculations.`);
}


// =====================================================
// YOUR POPUP (FULL)
// =====================================================
function showPopup(message) {
    const popup = document.getElementById('ackModal');
    const messageContainer = document.getElementById('ackMessage');

    messageContainer.textContent = message;
    popup.style.display = 'block';

    setTimeout(() => {
        popup.style.display = 'none';
    }, 2000);
}


////////////////////////////////////////////


// =====================================================
// SYNC VARIETY INPUT WHEN SAVED SIRE/DAM IS LOADED
// (MutationObserver is REQUIRED for your workflow)
// Now guarded so it DOES NOT inject defaults on initial load.
// =====================================================
(function syncVarietyOnSavedLoad() {

  function syncFromContainer(prefix) {
    // Only sync after user action (saved load / allele change / offspring continue)
    __syncInputFromContainer(prefix);
  }

  ["sire", "dam"].forEach(prefix => {
    const containerId = prefix === "sire" ? "sireImageContainer" : "damImageContainer";
    const container = document.getElementById(containerId);
    if (!container) return;

    const observer = new MutationObserver(() => {
      syncFromContainer(prefix);
    });

    observer.observe(container, {
      childList: true,
      subtree: true,
      characterData: true
    });
  });

})();


// =====================================================
// VARIETY INPUT UI SYNC (Public function you already used)
// Keeps your call sites working.
// Also flips allowSync ON for that parent.
// =====================================================
function syncVarietyInput(prefix, phenotype) {
  const inputId =
    prefix === "sire" ? "sireVarietyInput" :
    prefix === "dam"  ? "damVarietyInput"  :
    null;

  if (!inputId) return;

  __setAllow(prefix);

  const input = document.getElementById(inputId);
  if (input) {
    input.value = (phenotype || "").trim();
    __clearSuggestionUI(prefix);
  }
}


// =====================================================
// Clear both variety inputs (also clears suggestion UI)
// =====================================================
function clearVarietyInputs() {
  const sireInput = document.getElementById("sireVarietyInput");
  const damInput  = document.getElementById("damVarietyInput");

  if (sireInput) sireInput.value = "";
  if (damInput)  damInput.value = "";

  __clearSuggestionUI("sire");
  __clearSuggestionUI("dam");

  window.__VarietySyncState.last.sire = "";
  window.__VarietySyncState.last.dam  = "";
}


// =====================================================
// ACTIVE TYPING GUARD (prevents cross-field overwrite)
// =====================================================
["sire", "dam"].forEach(prefix => {
  const id = prefix === "sire" ? "sireVarietyInput" : "damVarietyInput";
  const el = document.getElementById(id);
  if (!el) return;

  el.addEventListener("focus", () => {
    window.__VarietySyncState.active[prefix] = true;
  });

  el.addEventListener("input", () => {
    window.__VarietySyncState.active[prefix] = true;
  });

  el.addEventListener("blur", () => {
    setTimeout(() => {
      window.__VarietySyncState.active[prefix] = false;
    }, 120);
  });
});


// =====================================================
// TURN ON SYNC ONLY AFTER REAL USER ACTIONS
// 1) allele dropdown changes
// 2) favorites dropdown changes (saved parent recall)
// =====================================================
document.addEventListener("change", (e) => {
  const t = e.target;
  if (!t || !t.id) return;

  if (t.id.startsWith("sireAllele")) __setAllow("sire");
  if (t.id.startsWith("damAllele"))  __setAllow("dam");

  // If you have saved dropdowns, this makes saved recall immediately sync
  if (t.id === "sireFavoritesDropdown") __setAllow("sire");
  if (t.id === "damFavoritesDropdown")  __setAllow("dam");

  // After allowing, sync immediately (no wait for another mutation)
  if (t.id.startsWith("sireAllele")) setTimeout(() => __syncInputFromContainer("sire"), 0);
  if (t.id.startsWith("damAllele"))  setTimeout(() => __syncInputFromContainer("dam"), 0);
  if (t.id === "sireFavoritesDropdown") setTimeout(() => __syncInputFromContainer("sire"), 0);
  if (t.id === "damFavoritesDropdown")  setTimeout(() => __syncInputFromContainer("dam"), 0);
});


// =====================================================
// HARD CLEAR on load/refresh WITHOUT allowing sync
// (This prevents default name from appearing in inputs.)
// =====================================================
function __hardClearVarietyOnStart() {
  // Do NOT enable allow here. We want EMPTY inputs on load.
  clearVarietyInputs();

  // Chrome/Edge sometimes restore old values late
  requestAnimationFrame(() => requestAnimationFrame(clearVarietyInputs));
  setTimeout(clearVarietyInputs, 50);
  setTimeout(clearVarietyInputs, 250);
}

window.addEventListener("DOMContentLoaded", __hardClearVarietyOnStart);
window.addEventListener("load", __hardClearVarietyOnStart);
window.addEventListener("pageshow", __hardClearVarietyOnStart);


// =====================================================
// Clear AFTER reset button click (keeps your behavior)
// =====================================================
document.addEventListener("click", function (e) {
  const btn = e.target.closest("button");
  if (!btn) return;

  if (/reset/i.test(btn.textContent)) {
    setTimeout(() => {
      clearVarietyInputs();
      // still do NOT allow sync just because reset happened
      // user must interact again (alleles/saved/offspring)
    }, 0);
  }
});
