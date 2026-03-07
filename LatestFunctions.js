// TURKEY COLOR CALCULATOR - FULL COMPLETE FILE
// Special named varieties drop to generic on allele change (fixed)
// All your original code merged + overlay fix - Kevin ready

// ==============================
// SEARCH & RESET
// ==============================
function searchResults() {
    const input = document.getElementById('searchInput').value.trim();
    const results = document.getElementById('results');
    const resultsHeader = document.getElementById('resultsHeader');
    const additionalText = document.getElementById('resultsAdditionalText');

    results.innerHTML = '';
    results.style.display = 'none';
    resultsHeader.style.display = 'none';
    additionalText.style.display = 'none';

    if (!input) {
        resultsHeader.style.display = 'block';
        results.style.display = 'block';
        results.innerHTML = '<li style="color: blue;">Please enter a valid search term.</li>';
        return;
    }

    const allMappings = getAllPhenotypeMappings();
    if (allMappings.length === 0) {
        console.error("Phenotype mappings are not loaded.");
        resultsHeader.style.display = 'block';
        results.style.display = 'block';
        results.innerHTML = '<li style="color: red;">Error: Data not loaded. Please refresh.</li>';
        return;
    }

    let normalizedInput = input.replace(/\s+/g, ' ').trim();

    const synonymMap = {
        "red bourbon": "bourbon red",
        "blue slate": "slate",
        "slate blue": "slate",
        "mottled blue slate": "mottled slate",
        "black spanish": "black",
        "spanish black": "black",
        "slate blue palm": "blue palm",
        "blue royal palm": "blue palm",
        "royal blue palm": "blue palm",
        "firefall": "fall fire",
        "fireball": "fall fire",
        "sweetwater": "sweet grass",
        "black norfolk": "black",
        "norfolk black": "black",
        "narri": "narragansett",
        "naganset": "narragansett",
        "nari": "narragansett"
    };
    const lowerInput = normalizedInput.toLowerCase();
    if (synonymMap[lowerInput]) normalizedInput = synonymMap[lowerInput];

    function normalizeWordOrder(str) {
        return str.split(" ").sort().join(" ");
    }

    function getEditDistance(a, b) {
        const matrix = Array.from({ length: a.length + 1 }, () => []);
        for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
        for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
        for (let i = 1; i <= a.length; i++) {
            for (let j = 1; j <= b.length; j++) {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
                );
            }
        }
        return matrix[a.length][b.length];
    }

    let bestMatch = null;
    let bestDistance = Infinity;
    const sortedInput = normalizeWordOrder(normalizedInput.toLowerCase());
    for (let mapping of allMappings) {
        for (let [, phenotype] of Object.entries(mapping)) {
            const normPheno = phenotype.toLowerCase().trim();
            const sortedPheno = normalizeWordOrder(normPheno);
            const distance = Math.min(
                getEditDistance(normalizedInput.toLowerCase(), normPheno),
                getEditDistance(sortedInput, sortedPheno)
            );
            if (distance < bestDistance && distance <= 3) {
                bestMatch = phenotype;
                bestDistance = distance;
            }
            if (distance === 0) {
                bestMatch = phenotype;
                bestDistance = 0;
                break;
            }
        }
        if (bestDistance === 0) break;
    }

    const finalSearchTerm = (bestDistance <= 2 && bestMatch) ? bestMatch.toLowerCase().trim() : normalizedInput.toLowerCase().trim();

    let maleMatch = null;
    let femaleMatch = null;
    let sharedMatch = null;
    for (let mapping of allMappings) {
        for (let [genotype, phenotype] of Object.entries(mapping)) {
            const normPheno = phenotype.toLowerCase().trim();
            const normGeno = genotype.replace(/\s+/g, ' ').trim();
            if (normPheno === finalSearchTerm || normGeno === normalizedInput) {
                if (genotype.includes('Ee') || genotype.includes('ee') || genotype.includes('Nn') || genotype.includes('nn')) {
                    if (!maleMatch) maleMatch = { genotype, phenotype };
                } else if (genotype.includes('e-') || genotype.includes('n-')) {
                    if (!femaleMatch) femaleMatch = { genotype, phenotype };
                } else {
                    if (!sharedMatch) sharedMatch = { genotype, phenotype };
                }
            }
        }
        if (maleMatch && femaleMatch && sharedMatch) break;
    }

    resultsHeader.style.display = 'block';
    results.style.display = 'block';
    if (sharedMatch || maleMatch || femaleMatch) {
        if (sharedMatch) {
            results.innerHTML += `<li><strong>Shared Results (Male & Female):</strong></li>`;
            results.innerHTML += `<li>Genotype: ${sharedMatch.genotype}, Phenotype: ${sharedMatch.phenotype}</li>`;
        } else {
            if (maleMatch) {
                results.innerHTML += `<li><strong>Male Results:</strong></li>`;
                results.innerHTML += `<li>Genotype: ${maleMatch.genotype}, Phenotype: ${maleMatch.phenotype}</li>`;
            }
            if (femaleMatch) {
                results.innerHTML += `<li><strong>Female Results:</strong></li>`;
                results.innerHTML += `<li>Genotype: ${femaleMatch.genotype}, Phenotype: ${femaleMatch.phenotype}</li>`;
            }
        }
    } else {
        if (bestMatch && bestDistance <= 3) {
            results.innerHTML = `<li style="color: blue;">No exact match found. Did you mean <strong>${bestMatch}</strong>?</li>`;
        } else {
            results.innerHTML = `<li style="color: blue;">No matches found. Please check your spelling and try again.</li>`;
        }
    }
    additionalText.style.display = 'block';
    additionalText.innerHTML = `<p style="font-size: 18px; color: blue;">Enter this genotype into the calculator.</p>`;
}

function resetSearch() {
    document.getElementById('searchInput').value = '';
    const results = document.getElementById('results');
    const header = document.getElementById('resultsHeader');
    const extra = document.getElementById('resultsAdditionalText');
    if (results) { results.innerHTML = ''; results.style.display = 'none'; }
    if (header) header.style.display = 'none';
    if (extra) extra.style.display = 'none';
}

// ==============================
// HELPERS
// ==============================
function getAllPhenotypeMappings() {
    return [
        phenotypeMapping1, phenotypeMapping1A, phenotypeMapping1B, phenotypeMapping1C,
        phenotypeMapping1D, phenotypeMapping1E, phenotypeMapping2, phenotypeMapping2A,
        phenotypeMapping3, phenotypeMapping3A, phenotypeMapping4, phenotypeMapping5,
        phenotypeMapping6, phenotypeMapping7, phenotypeMapping7A, phenotypeMapping7B,
        phenotypeMapping7C, phenotypeMapping8, phenotypeMapping9, phenotypeMapping10,
        phenotypeMapping11, phenotypeMapping12, phenotypeMapping13, phenotypeMapping14,
        phenotypeMapping15
    ].filter(m => m);
}

function normalizeVarietyInput(raw) {
    if (!raw) return "";
    let s = raw.replace(/\s+/g, " ").trim().toLowerCase();
    const synonymMap = {
        "red bourbon": "bourbon red",
        "red burbon": "bourbon red",
        "burbon red": "bourbon red",
        "blue slate": "slate",
        "slate blue": "slate",
        "black slate": "slate",
        "mottled blue slate": "mottled slate",
        "spanish black": "black",
        "black spanish": "black",
        "slate blue palm": "blue palm",
        "blue royal palm": "blue palm",
        "royal blue palm": "blue palm",
        "firefall": "fall fire",
        "fireball": "fall fire",
        "sweetwater": "sweetgrass",
        "black norfolk": "black",
        "norfolk black": "black",
        "ridley bronze": "bronze",
        "narri": "narragansett",
        "naganset": "narragansett",
        "narrie": "narragansett",
        "white downed red": "regal red"
    };
    if (synonymMap[s]) s = synonymMap[s];
    return s;
}

function normalizeWordOrder(str) {
    return str.split(" ").sort().join(" ");
}

function findFirstGenotypeForPhenotype(phenotypeInput) {
    const allMaps = getAllPhenotypeMappings();
    if (!phenotypeInput) return null;
    const normalized = normalizeVarietyInput(phenotypeInput);
    const sortedNorm = normalizeWordOrder(normalized);
    for (const map of allMaps) {
        for (const [genotype, pheno] of Object.entries(map)) {
            const phenoNorm = normalizeVarietyInput(pheno);
            const phenoSorted = normalizeWordOrder(phenoNorm);
            if (phenoNorm === normalized || phenoSorted === sortedNorm) {
                return genotype;
            }
        }
    }
    return null;
}

function applyGenotypeToDropdowns(genotype, prefix) {
    if (!genotype) return;
    const parts = genotype.split(" ").filter(x => x.trim());
    const isDam = prefix === "dam";
    parts.forEach(token => {
        if (/^[Bb]/.test(token)) document.getElementById(prefix + "Alleleb").value = token;
        else if (/^[Cc]/.test(token)) document.getElementById(prefix + "AlleleC").value = token;
        else if (/^[Dd]/.test(token)) document.getElementById(prefix + "Alleled").value = token;
        else if (/^[Ee]/.test(token)) {
            let val = token;
            if (isDam && (token === "Ee" || token === "ee")) val = token[0] + "-";
            document.getElementById(prefix + "AlleleE").value = val;
        }
        else if (/^[Nn]/.test(token)) {
            let val = token;
            if (isDam && (token === "Nn" || token === "nn")) val = token[0].toLowerCase() + "-";
            document.getElementById(prefix + "AlleleN").value = val;
        }
        else if (/^Pn|^pn/.test(token)) document.getElementById(prefix + "AllelePn").value = token;
        else if (/^[Rr]/.test(token)) document.getElementById(prefix + "AlleleR").value = token;
        else if (/^Sl|^sl/.test(token)) document.getElementById(prefix + "AlleleSl").value = token;
        else if (/^Sp|^sp/.test(token)) document.getElementById(prefix + "AlleleSp").value = token;
    });
    if (prefix === "sire" && typeof updateSireGenotype === "function") updateSireGenotype();
    if (prefix === "dam" && typeof updateDamGenotype === "function") updateDamGenotype();
}

function applyVarietyToSire() {
    const val = document.getElementById("sireVarietyInput")?.value.trim();
    if (!val) return;
    const g = findFirstGenotypeForPhenotype(val);
    if (g) applyGenotypeToDropdowns(g, "sire");
}

function applyVarietyToDam() {
    const val = document.getElementById("damVarietyInput")?.value.trim();
    if (!val) return;
    const g = findFirstGenotypeForPhenotype(val);
    if (g) applyGenotypeToDropdowns(g, "dam");
}

function resetVarietyAutocomplete() {
    const sire = document.getElementById("sireVarietyInput");
    const dam = document.getElementById("damVarietyInput");
    if (sire) sire.value = "";
    if (dam) dam.value = "";
}

// ==============================
// CLEANERS
// ==============================
function cleanParentPhenotypesOnce() {
    ["sireImageContainer", "damImageContainer"].forEach(id => {
        const container = document.getElementById(id);
        if (!container) return;
        const strong = container.querySelector("strong");
        if (!strong) return;
        const spans = strong.querySelectorAll("span");
        if (!spans.length) return;
        const phenoSpan = spans[0];
        if (!phenoSpan.textContent) return;
        phenoSpan.textContent = phenoSpan.textContent
            .replace(/\s*\(Split.*?\)/gi, "")
            .replace(/\s*\(Semi-?Pencilled.*?\)/gi, "")
            .trim();
    });
}

if (typeof updateSireGenotype === "function") {
    const orig = updateSireGenotype;
    updateSireGenotype = function () { orig(); setTimeout(cleanParentPhenotypesOnce, 0); };
}

if (typeof updateDamGenotype === "function") {
    const orig = updateDamGenotype;
    updateDamGenotype = function () { orig(); setTimeout(cleanParentPhenotypesOnce, 0); };
}

window.addEventListener("DOMContentLoaded", cleanParentPhenotypesOnce);

if (typeof setGenotypeImage === "function") {
    const orig = setGenotypeImage;
    setGenotypeImage = function (...args) {
        orig.apply(this, args);
        setTimeout(cleanParentPhenotypesOnce, 0);
    };
}

function cleanOffspringPhenotypesOnce() {
    const containers = [
        document.getElementById("maleOffspringResults"),
        document.getElementById("femaleOffspringResults")
    ];
    containers.forEach(container => {
        if (!container) return;
        container.querySelectorAll(".offspring-item").forEach(item => {
            const span = item.querySelector(".variety-name");
            if (!span || !span.textContent) return;
            span.textContent = span.textContent
                .replace(/\s*\(Split.*?\)/gi, "")
                .replace(/\s*\(Semi-?Pencilled.*?\)/gi, "")
                .trim();
        });
    });
}

if (typeof displayResults === "function") {
    const orig = displayResults;
    displayResults = function (...args) {
        orig.apply(this, args);
        setTimeout(cleanOffspringPhenotypesOnce, 0);
    };
}

function cleanSummaryPhenotypesOnce() {
    const summaryTable = document.getElementById("summaryChart");
    if (!summaryTable) return;
    summaryTable.querySelectorAll("td").forEach(td => {
        if (!td.textContent) return;
        td.textContent = td.textContent
            .replace(/\s*\(Split.*?\)/gi, "")
            .replace(/\s*\(Semi-?Pencilled.*?\)/gi, "")
            .trim();
    });
}

if (typeof displaySummaryChart === "function") {
    const orig = displaySummaryChart;
    displaySummaryChart = function (...args) {
        orig.apply(this, args);
        setTimeout(cleanSummaryPhenotypesOnce, 0);
    };
}

const KEEP_QUALIFIERS_IN_SUMMARY = true;
if (KEEP_QUALIFIERS_IN_SUMMARY && typeof cleanSummaryPhenotypesOnce === "function") {
    window.originalCleanSummaryPhenotypesOnce = cleanSummaryPhenotypesOnce;
    cleanSummaryPhenotypesOnce = function () {
        console.log("cleanSummaryPhenotypesOnce: SKIPPED — qualifiers kept in summary");
    };
    console.log("Summary qualifiers VISIBLE");
}

// ==============================
// IMAGE SIZE & ENLARGEMENT
// ==============================
function updateImageSize(value) {
    const sireImg = document.querySelector('#sireImageContainer img');
    const damImg = document.querySelector('#damImageContainer img');
    if (sireImg) {
        sireImg.style.width = value + 'px';
        if (value < 200) sireImg.style.maxWidth = value + 'px';
        else {
            sireImg.style.removeProperty('max-width');
            sireImg.style.removeProperty('max-height');
        }
    }
    if (damImg) {
        damImg.style.width = value + 'px';
        if (value < 200) damImg.style.maxWidth = value + 'px';
        else {
            damImg.style.removeProperty('max-width');
            damImg.style.removeProperty('max-height');
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('imageSizeSlider');
    if (slider) {
        slider.value = 200;
        updateImageSize(200);
    }
});

document.addEventListener('click', function(e) {
    const img = e.target.closest('#sireImageContainer img, #damImageContainer img');
    if (img && img.classList.contains('enlarged')) {
        img.style.removeProperty('max-width');
        img.style.removeProperty('max-height');
        img.style.removeProperty('width');
    }
});

document.addEventListener('click', function (event) {
    if (event.target.closest('.offspring-container') && event.target.tagName === 'IMG') {
        event.target.classList.toggle('enlarged');
        event.target.classList.toggle('enlarged-offspring');
        playSound('imageToggleSound');
    }
});

// ==============================
// UNIFIED SPECIAL OVERLAY (FIXED - DROPS ON ALLELE CHANGE)
// All special varieties (wild, white, bronze) drop to generic when alleles change
// ==============================
(function () {
    'use strict';

    const VARIANTS = {
        wild: {
            eastern: { name: "Eastern Wild", male: "MEasternWild.jpg", female: "FEasternWild.jpg", poult: "PEasternWild.jpg", force: { Alleleb: "bb" } },
            goulds: { name: "Gould's Wild", male: "MGouldsWild.jpg", female: "FGouldsWild.jpg", poult: "PGouldsWild.jpg", force: { Alleleb: "bb" } },
            merriams: { name: "Merriam's Wild", male: "MMerriamsWild.jpg", female: "FMerriamsWild.jpg", poult: "PMerriamsWild.jpg", force: { Alleleb: "bb" } },
            osceola: { name: "Osceola Wild", male: "MOsceolaWild.jpg", female: "FOsceolaWild.jpg", poult: "POsceolaWild.jpg", force: { Alleleb: "bb" } },
            rio: { name: "Rio Grande Wild", male: "MRioGrandeWild.jpg", female: "FRioGrandeWild.jpg", poult: "PRioGrandeWild.jpg", force: { Alleleb: "bb" } },
            hybrid: { name: "Hybrid Wild", male: "MHybridWild.jpg", female: "FHybridWild.jpg", poult: "PHybridWild.jpg", force: { Alleleb: "bb" } }
        },
        white: {
            beltsville: { name: "Beltsville Small White", male: "MBeltsvilleSmallWhite.jpg", female: "FBeltsvilleSmallWhite.jpg", poult: "PBeltsvilleSmallWhite.jpg", force: { Alleleb: "bb", AlleleC: "cc" } },
            midget: { name: "Midget White", male: "MMidgetWhite.jpg", female: "FMidgetWhite.jpg", poult: "PMidgetWhite.jpg", force: { Alleleb: "bb", AlleleC: "cc" } },
            holland: { name: "White Holland", male: "MWhiteHolland.jpg", female: "FWhiteHolland.jpg", poult: "PWhiteHolland.jpg", force: { Alleleb: "bb", AlleleC: "cc" } },
            broad: { name: "Broad Breasted White", male: "MBroadBreastedWhite.jpg", female: "FBroadBreastedWhite.jpg", poult: "PBroadBreastedWhite.jpg", force: { Alleleb: "bb", AlleleC: "cc" } }
        },
        bronze: {
            broad: { name: "Broad Breasted Bronze", male: "MBroadBreastedBronze.jpg", female: "FBroadBreastedBronze.jpg", poult: "PBroadBreastedBronze.jpg", force: { Alleleb: "bb" } }
        }
    };

    const ALIASES = {
        wild: {
            "eastern wild": "eastern", "eastern": "eastern", "wild eastern": "eastern",
            "goulds wild": "goulds", "gould's wild": "goulds", "goulds wild turkey": "goulds", "gould's wild turkey": "goulds",
            "goulds": "goulds", "gould's": "goulds", "gould": "goulds",
            "merriams wild": "merriams", "merriam wild": "merriams", "merriam's wild": "merriams",
            "merriams": "merriams", "merriam's": "merriams", "merriam": "merriams",
            "osceola wild": "osceola", "osceola wild turkey": "osceola",
            "rio grande wild": "rio", "rio grande wild turkey": "rio", "rio grand wild": "rio",
            "hybrid wild": "hybrid", "hybrid": "hybrid"
        },
        white: {
            "beltsville small white": "beltsville", "beltsville white": "beltsville", "white beltsville": "beltsville",
            "midget white": "midget", "midget": "midget", "white midget": "midget",
            "white holland": "holland", "holland white": "holland", "holland": "holland",
            "broad breasted white": "broad", "broad-breasted white": "broad", "large white": "broad",
            "commercial white": "broad", "giant white": "broad", "broad white": "broad", "breasted white": "broad"
        },
        bronze: {
            "broad breasted bronze": "broad", "broad-breasted bronze": "broad", "mammoth bronze": "broad",
            "orlopp bronze": "broad", "breasted bronze": "broad", "bronze breasted": "broad", "large bronze": "broad"
        }
    };

    const state = { sire: null, dam: null }; // {type, key}

    function norm(s) { return (s || "").trim().toLowerCase(); }

    function detectSpecial(prefix) {
        const input = norm(document.getElementById(prefix + "VarietyInput")?.value);
        if (!input) {
            state[prefix] = null;
            return null;
        }
        for (const type in ALIASES) {
            for (const alias in ALIASES[type]) {
                if (input === alias || input.includes(ALIASES[type][alias])) {
                    state[prefix] = { type, key: ALIASES[type][alias] };
                    return state[prefix];
                }
            }
        }
        state[prefix] = null;
        return null;
    }

    function applySpecialToParent(prefix) {
        const container = document.getElementById(prefix + "ImageContainer");
        if (!container) return;

        const spec = state[prefix] || detectSpecial(prefix);
        if (!spec) {
            delete container.dataset.special;
            if (typeof setGenotypeImage === "function") setGenotypeImage(prefix);
            return;
        }

        const data = VARIANTS[spec.type]?.[spec.key];
        if (!data) return;

        // Input still matches?
        const inputVal = norm(document.getElementById(prefix + "VarietyInput")?.value);
        const nameVal = norm(data.name);
        const inputOk = inputVal === nameVal || Object.keys(ALIASES[spec.type]).some(a => inputVal.includes(a));

        // Alleles still forced?
        const allelesOk = Object.entries(data.force || {}).every(([locus, req]) => {
            const sel = document.getElementById(prefix + locus);
            return sel && sel.value === req;
        });

        if (!inputOk || !allelesOk) {
            state[prefix] = null;
            delete container.dataset.special;
            if (typeof setGenotypeImage === "function") setGenotypeImage(prefix);
            return;
        }

        // Apply special
        const img = container.querySelector("img");
        if (img) img.src = `https://portersturkeys.github.io/Pictures/${prefix === "dam" ? data.female : data.male}`;

        const strong = container.querySelector("strong");
        if (strong) {
            const span = strong.querySelector("span") || strong;
            span.textContent = data.name;
        }

        const info = document.getElementById(prefix + "InfoContainer");
        if (info) {
            info.querySelectorAll("span,div,strong").forEach(el => {
                if (/to be defined|bronze|wild|white.*eyes/i.test(el.textContent)) el.textContent = data.name;
            });
        }
    }

    // Watch alleles & variety input
    window.addEventListener('load', () => {
        ['sire', 'dam'].forEach(prefix => {
            // Allele dropdowns
            ['Alleleb','AlleleC','Alleled','AlleleE','AlleleN','AllelePn','AlleleR','AlleleSl','AlleleSp'].forEach(suf => {
                const el = document.getElementById(prefix + suf);
                if (el) el.addEventListener('change', () => applySpecialToParent(prefix));
            });

            // Variety input
            const vEl = document.getElementById(prefix + "VarietyInput");
            if (vEl) {
                vEl.addEventListener('input', () => applySpecialToParent(prefix));
                vEl.addEventListener('blur', () => applySpecialToParent(prefix));
            }
        });

        // Hook variety apply
        if (typeof applyVarietyToSire === "function") {
            const orig = applyVarietyToSire;
            applyVarietyToSire = function() {
                orig.apply(this, arguments);
                setTimeout(() => applySpecialToParent('sire'), 50);
            };
        }
        if (typeof applyVarietyToDam === "function") {
            const orig = applyVarietyToDam;
            applyVarietyToDam = function() {
                orig.apply(this, arguments);
                setTimeout(() => applySpecialToParent('dam'), 50);
            };
        }

        // Hook reset
        if (typeof resetCalculator === "function") {
            const orig = resetCalculator;
            resetCalculator = function() {
                const res = orig.apply(this, arguments);
                state.sire = state.dam = null;
                return res;
            };
        }

        // Initial apply
        ['sire', 'dam'].forEach(applySpecialToParent);
    });
})();

// ==============================
// SUMMARY BREEDING LABEL
// ==============================
window.addEventListener("load", () => {
  if (window._summaryBreedingObserverInstalled) return;
  window._summaryBreedingObserverInstalled = true;
  const summaryContainer = document.getElementById("summaryChartContainer");
  const summaryTable = document.getElementById("summaryChart");
  const sireInfo = document.getElementById("sireInfoContainer");
  const damInfo = document.getElementById("damInfoContainer");
  if (!summaryContainer || !summaryTable || !sireInfo || !damInfo) return;
  const titleH2 = Array.from(summaryContainer.querySelectorAll("h2"))
    .find(h => /summary\s*chart/i.test(h.textContent || ""));
  if (!titleH2) return;
  let label = document.getElementById("summaryBreedingLabel");
  if (!label) {
    label = document.createElement("div");
    label.id = "summaryBreedingLabel";
    titleH2.insertAdjacentElement("afterend", label);
  }
  label.style.display = "none";
  label.innerHTML = "";
  function clean(t){ return String(t || "").replace(/\s+/g, " ").trim(); }
  function shortGeno(el){ return clean(el.getAttribute("data-short-genotype") || ""); }
  function inferVarietyFromShortGeno(g) {
    g = clean(g);
    if (/^bb(\s|$)/i.test(g)) return "Bronze";
    return "";
  }
  function getVarietyName(role) {
    const roleRx = new RegExp(role, "i");
    const goodRx = /(variety|phenotype|name|display|selected|choice|result)/i;
    const badRx = /(genotype|allele|image|male|female|poult|pictures|photo|slider|size|favorite|save)/i;
    const els = document.querySelectorAll("input,select,textarea,span,div,p,strong,b,label,h1,h2,h3,h4");
    let best = {score:-1e9, text:""};
    els.forEach(el => {
      const hay = ((el.id||"")+" "+(el.className||"")+" "+(el.getAttribute("name")||"")).toLowerCase();
      if (!roleRx.test(hay) || badRx.test(hay)) return;
      const raw = /input|select|textarea/i.test(el.tagName) ? el.value : el.textContent;
      const t = clean(raw);
      if (!t || /^(sire|dam)$/i.test(t)) return;
      if (/\b(bb1|b1b1|bb|Bb|BB|Ee|EE|NN|Nn|cgcg|cmc|Slsl|slsl|PnPn|Rr|rr|SlSl|SpSp)\b/i.test(t)) return;
      let s = 0;
      if (goodRx.test(hay)) s += 10;
      if (/variety|phenotype/i.test(el.id)) s += 12;
      if (/name|display/i.test(el.id)) s += 8;
      if (/input|select|textarea/i.test(el.tagName)) s += 6;
      const st = getComputedStyle(el);
      if (st.display === "none" || st.visibility === "hidden") s -= 50;
      if (s > best.score) best = {score:s, text:t};
    });
    return best.text;
  }
  function summaryHasResults() {
    const tbody = summaryTable.querySelector("tbody");
    return !!(tbody && tbody.querySelectorAll("tr").length > 0);
  }
  function updateLabel() {
    if (!summaryHasResults()) {
      label.style.display = "none";
      label.innerHTML = "";
      return;
    }
    const sireG = shortGeno(sireInfo);
    const damG = shortGeno(damInfo);
    const sireName = getVarietyName("sire") || inferVarietyFromShortGeno(sireG) || "Sire";
    const damName = getVarietyName("dam") || inferVarietyFromShortGeno(damG) || "Dam";
    label.innerHTML = `
      <div class="breed-line">
        <span class="breed-role sire">Sire:</span>
        <strong class="breed-name">${sireName}</strong>
        (<span class="breed-geno">${sireG}</span>)
      </div>
      <div class="breed-x">&times;</div>
      <div class="breed-line">
        <span class="breed-role dam">Dam:</span>
        <strong class="breed-name">${damName}</strong>
        (<span class="breed-geno">${damG}</span>)
      </div>
    `;
    label.style.display = "block";
  }
  const tbody = summaryTable.querySelector("tbody");
  if (tbody) {
    const obs = new MutationObserver(() => updateLabel());
    obs.observe(tbody, { childList: true, subtree: true });
  }
  if (typeof window.resetCalculator === "function") {
    const originalReset = window.resetCalculator;
    window.resetCalculator = function () {
      const r = originalReset.apply(this, arguments);
      label.style.display = "none";
      label.innerHTML = "";
      return r;
    };
  }
});

// ==============================
// OFFSPRING RESULTS TITLE
// ==============================
window.addEventListener("load", () => {
  if (window._offspringResultsTitleControlled) return;
  window._offspringResultsTitleControlled = true;
  const container = document.getElementById("summaryChartContainer");
  const table = document.getElementById("summaryChart");
  if (!container || !table) return;
  let wrap = document.getElementById("offspringResultsTitle");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.id = "offspringResultsTitle";
    wrap.style.textAlign = "center";
    wrap.style.margin = "5px 0";
    wrap.style.display = "none";
    const title = document.createElement("h2");
    title.textContent = "Offspring Results";
    title.style.display = "inline-block";
    title.style.width = "fit-content";
    title.style.background = "white";
    title.style.border = "2px solid blue";
    title.style.borderRadius = "8px";
    title.style.padding = "4px 4px";
    title.style.margin = "0";
    wrap.appendChild(title);
    table.parentNode.insertBefore(wrap, table);
  }
  function summaryHasResults() {
    const tbody = table.querySelector("tbody");
    return !!(tbody && tbody.querySelectorAll("tr").length > 0);
  }
  function updateTitleVisibility() {
    wrap.style.display = summaryHasResults() ? "block" : "none";
  }
  const tbody = table.querySelector("tbody");
  if (tbody) {
    const obs = new MutationObserver(() => updateTitleVisibility());
    obs.observe(tbody, { childList: true, subtree: true });
  }
  if (typeof window.resetCalculator === "function") {
    const originalReset = window.resetCalculator;
    window.resetCalculator = function () {
      const r = originalReset.apply(this, arguments);
      wrap.style.display = "none";
      return r;
    };
  }
});

// ==============================
// LIVE TYPE-TO-APPLY
// ==============================
(function LiveApplyVarietyWithReset_STRICT() {
  if (window._LiveApplyVarietyWithReset_STRICT_installed) return;
  window._LiveApplyVarietyWithReset_STRICT_installed = true;
  const defaultAlleles = { sire: {}, dam: {} };
  const alleleIds = ["Alleleb","AlleleC","Alleled","AlleleE","AlleleN","AllelePn","AlleleR","AlleleSl","AlleleSp"];
  function captureDefaults(prefix) {
    alleleIds.forEach(suffix => {
      const id = prefix + suffix;
      const el = document.getElementById(id);
      if (el) defaultAlleles[prefix][id] = el.value;
    });
  }
  function restoreDefaults(prefix) {
    alleleIds.forEach(suffix => {
      const id = prefix + suffix;
      const el = document.getElementById(id);
      if (el && defaultAlleles[prefix][id] !== undefined) el.value = defaultAlleles[prefix][id];
    });
    if (prefix === "sire" && typeof updateSireGenotype === "function") updateSireGenotype();
    if (prefix === "dam" && typeof updateDamGenotype === "function") updateDamGenotype();
  }
  let EXACT = new Set();
  function rebuildExactSet() {
    EXACT = new Set();
    const maps = getAllPhenotypeMappings();
    maps.forEach(map => {
      if (!map) return;
      Object.values(map).forEach(p => {
        if (p) EXACT.add(String(p).trim().toLowerCase());
      });
    });
  }
  function normalizeMaybe(s) {
    const raw = String(s || "").trim();
    if (!raw) return "";
    return normalizeVarietyInput(raw).trim().toLowerCase();
  }
  function isExactMatch(rawInput) {
    const raw = String(rawInput || "").trim().toLowerCase();
    if (!raw) return false;
    if (EXACT.has(raw)) return true;
    const norm = normalizeMaybe(rawInput);
    if (norm && EXACT.has(norm)) return true;
    return false;
  }
  const state = { sire: { applied: false }, dam: { applied: false } };
  function handleLive(prefix) {
    const input = document.getElementById(prefix === "sire" ? "sireVarietyInput" : "damVarietyInput");
    if (!input) return;
    const raw = (input.value || "").trim();
    const st = state[prefix];
    if (raw && isExactMatch(raw) && typeof findFirstGenotypeForPhenotype === "function") {
      const g = findFirstGenotypeForPhenotype(raw);
      if (g && typeof applyGenotypeToDropdowns === "function") {
        applyGenotypeToDropdowns(g, prefix);
        st.applied = true;
        return;
      }
    }
    if (st.applied && !isExactMatch(raw)) {
      st.applied = false;
      restoreDefaults(prefix);
    }
    if (!raw && st.applied) {
      st.applied = false;
      restoreDefaults(prefix);
    }
  }
  function bind(prefix) {
    const input = document.getElementById(prefix === "sire" ? "sireVarietyInput" : "damVarietyInput");
    if (!input) return;
    input.addEventListener("input", () => handleLive(prefix), { passive: true });
  }
  document.addEventListener("DOMContentLoaded", () => {
    captureDefaults("sire");
    captureDefaults("dam");
    rebuildExactSet();
    setTimeout(rebuildExactSet, 2500);
    setTimeout(rebuildExactSet, 9000);
    bind("sire");
    bind("dam");
  });
})();

// ==============================
// FIREFOX/SAFARI DROPDOWN FIX
// ==============================
(function VarietyDropdown_FFSafariFix(){
  if (window._varietyDropdownFFSafariFixInstalled) return;
  window._varietyDropdownFFSafariFixInstalled = true;
  var MAX_RESULTS = 50;
  var cachedVarieties = [];
  var lastBuild = 0;
  function safeGetAllMaps() {
    try {
      if (typeof window.getAllPhenotypeMappings === "function") {
        var maps = window.getAllPhenotypeMappings();
        return Array.isArray(maps) ? maps.filter(Boolean) : [];
      }
    } catch(e) {}
    return [];
  }
  function buildVarietyCache(force) {
    var now = Date.now();
    if (!force && now - lastBuild < 300) return;
    lastBuild = now;
    var maps = safeGetAllMaps();
    if (!maps.length) {
      cachedVarieties = [];
      return;
    }
    var names = Object.create(null);
    for (var i = 0; i < maps.length; i++) {
      var map = maps[i];
      if (!map) continue;
      for (var k in map) {
        if (!Object.prototype.hasOwnProperty.call(map, k)) continue;
        var p = map[k];
        if (!p) continue;
        var s = String(p).trim();
        if (s) names[s] = true;
      }
    }
    cachedVarieties = Object.keys(names).sort(function(a,b){
      return a.localeCompare(b, undefined, { sensitivity: "base" });
    });
  }
  function normInput(s) {
    var raw = String(s || "").trim();
    if (!raw) return "";
    try {
      if (typeof window.normalizeVarietyInput === "function") {
        return String(window.normalizeVarietyInput(raw) || "").trim().toLowerCase();
      }
    } catch(e) {}
    return raw.toLowerCase();
  }
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
  function highlight(label, query) {
    var safeLabel = escapeHtml(label);
    var q = String(query || "").trim();
    if (!q) return safeLabel;
    var esc = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    var rx = new RegExp("(" + esc + ")", "ig");
    return safeLabel.replace(rx, "<mark>$1</mark>");
  }
  function getMatches(queryRaw) {
    var q = normInput(queryRaw);
    if (!q) return [];
    var starts = [];
    var wordStarts = [];
    var contains = [];
    for (var i = 0; i < cachedVarieties.length; i++) {
      var v = cachedVarieties[i];
      var low = v.toLowerCase();
      if (low.indexOf(q) === 0) starts.push(v);
      else {
        var words = low.split(/\s+/);
        var foundWordStart = false;
        for (var w = 0; w < words.length; w++) {
          if (words[w].indexOf(q) === 0) { foundWordStart = true; break; }
        }
        if (foundWordStart) wordStarts.push(v);
        else if (low.indexOf(q) !== -1) contains.push(v);
      }
    }
    return starts.concat(wordStarts, contains).slice(0, MAX_RESULTS);
  }
  function makeDropdown(inputEl, role) {
    var dd = document.createElement("div");
    dd.className = "variety-dd";
    dd.style.display = "none";
    dd.setAttribute("role", "listbox");
    document.body.appendChild(dd);
    var state = { open:false, items:[], active:-1, last:"" };
    function position() {
      var r = inputEl.getBoundingClientRect();
      dd.style.left = (window.scrollX + r.left) + "px";
      dd.style.top = (window.scrollY + r.bottom + 2) + "px";
      dd.style.width = r.width + "px";
    }
    function close() {
      state.open = false;
      state.items = [];
      state.active = -1;
      dd.style.display = "none";
      dd.innerHTML = "";
    }
    function setActive(idx) {
      var rows = dd.querySelectorAll(".variety-dd-item");
      for (var i = 0; i < rows.length; i++) rows[i].classList.remove("active");
      if (idx >= 0 && idx < rows.length) {
        rows[idx].classList.add("active");
        state.active = idx;
        var elTop = rows[idx].offsetTop;
        var elBottom = elTop + rows[idx].offsetHeight;
        var viewTop = dd.scrollTop;
        var viewBottom = viewTop + dd.clientHeight;
        if (elTop < viewTop) dd.scrollTop = elTop;
        else if (elBottom > viewBottom) dd.scrollTop = elBottom - dd.clientHeight;
      } else {
        state.active = -1;
      }
    }
    function applySelection(label) {
      inputEl.value = label;
      try { if (typeof playVarietySound === "function") playVarietySound(); } catch(e){}
      if (role === "sire" && typeof applyVarietyToSire === "function") applyVarietyToSire();
      if (role === "dam" && typeof applyVarietyToDam === "function") applyVarietyToDam();
      close();
    }
    function render(queryRaw) {
      dd.innerHTML = "";
      state.active = -1;
      for (var idx = 0; idx < state.items.length; idx++) {
        (function(label, idx2){
          var row = document.createElement("div");
          row.className = "variety-dd-item";
          row.setAttribute("role", "option");
          row.innerHTML = highlight(label, normInput(queryRaw));
          row.addEventListener("touchstart", function(e){
            e.preventDefault();
            applySelection(label);
          }, { passive:false });
          row.addEventListener("mousedown", function(e){
            e.preventDefault();
            applySelection(label);
          });
          dd.appendChild(row);
        })(state.items[idx], idx);
      }
      position();
      dd.style.display = state.items.length ? "block" : "none";
      state.open = dd.style.display === "block";
    }
    function update() {
      if (!cachedVarieties.length) buildVarietyCache(true);
      var qRaw = inputEl.value || "";
      var qNorm = normInput(qRaw);
      if (!qNorm) return close();
      if (state.open && qNorm === state.last) return;
      state.last = qNorm;
      state.items = getMatches(qRaw);
      if (!state.items.length) return close();
      render(qRaw);
    }
    inputEl.setAttribute("autocomplete", "off");
    inputEl.addEventListener("focus", function(){
      buildVarietyCache(true);
      update();
    });
    inputEl.addEventListener("input", update);
    inputEl.addEventListener("keydown", function(e){
      if (!state.open && (e.key === "ArrowDown" || e.key === "ArrowUp")) update();
      if (!state.open) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive(Math.min(state.active + 1, state.items.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive(Math.max(state.active - 1, 0));
      } else if (e.key === "Enter") {
        if (state.active >= 0) {
          e.preventDefault();
          applySelection(state.items[state.active]);
        } else {
          close();
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    });
    inputEl.addEventListener("blur", function(){ setTimeout(close, 200); });
    window.addEventListener("scroll", function(){ if (state.open) position(); }, true);
    window.addEventListener("resize", function(){ if (state.open) position(); });
    return { update:update };
  }
  function waitForMappingsThenInit() {
    var tries = 0;
    var maxTries = 120;
    var timer = setInterval(function(){
      tries++;
      buildVarietyCache(true);
      var sire = document.getElementById("sireVarietyInput");
      var dam = document.getElementById("damVarietyInput");
      if (cachedVarieties.length && (sire || dam)) {
        clearInterval(timer);
        if (sire) makeDropdown(sire, "sire");
        if (dam) makeDropdown(dam, "dam");
      }
      if (tries >= maxTries) {
        clearInterval(timer);
        var s2 = document.getElementById("sireVarietyInput");
        var d2 = document.getElementById("damVarietyInput");
        if (s2) makeDropdown(s2, "sire");
        if (d2) makeDropdown(d2, "dam");
      }
    }, 100);
  }
  window.addEventListener("load", waitForMappingsThenInit);
})();

// ==============================
// SOUND GATE
// ==============================
(function VarietySelectionSoundGate(){
  if (window._varietySelectionSoundGateInstalled) return;
  window._varietySelectionSoundGateInstalled = true;
  let allowUntil = 0;
  function arm(ms = 800) { allowUntil = Date.now() + ms; }
  window.playVarietySound = function () {
    if (Date.now() > allowUntil) return;
    if (typeof window.playSound === "function") window.playSound("alleleClickSound");
  };
  document.addEventListener("pointerdown", function(e){
    if (e.target && e.target.closest && e.target.closest(".variety-dd-item")) arm();
  }, true);
  document.addEventListener("pointerdown", function(e){
    if (e.target && e.target.closest && e.target.closest(".varSuggestionItem")) arm();
  }, true);
  document.addEventListener("click", function(e){
    const btn = e.target && e.target.closest && e.target.closest('button[onclick="calculateOffspringWrapper()"]');
    if (btn) allowUntil = 0;
  }, true);
})();

// ==============================
// FIREFOX PARENT ENFORCER
// ==============================
(function FirefoxParentOverlayEnforcer(){
  const ua = navigator.userAgent || "";
  const IS_FIREFOX = /Firefox\//i.test(ua);
  if (!IS_FIREFOX) return;
  if (window._ffParentOverlayEnforcerInstalled) return;
  window._ffParentOverlayEnforcerInstalled = true;
  const WILD_VARIANTS = {
    eastern: { name:"Eastern Wild", male:"MEasternWild.jpg", female:"FEasternWild.jpg" },
    goulds: { name:"Gould's Wild", male:"MGouldsWild.jpg", female:"FGouldsWild.jpg" },
    merriams: { name:"Merriam's Wild", male:"MMerriamsWild.jpg", female:"FMerriamsWild.jpg" },
    osceola: { name:"Osceola Wild", male:"MOsceolaWild.jpg", female:"FOsceolaWild.jpg" },
    rio: { name:"Rio Grande Wild", male:"MRioGrandeWild.jpg", female:"FRioGrandeWild.jpg" },
    hybrid: { name:"Hybrid Wild", male:"MHybridWild.jpg", female:"FHybridWild.jpg" }
  };
  const WILD_VARIETY_MAP = {
    "eastern wild":"eastern", "eastern":"eastern", "wild eastern":"eastern",
    "goulds wild":"goulds", "gould's wild":"goulds", "goulds wild turkey":"goulds", "gould's wild turkey":"goulds",
    "goulds":"goulds", "gould's":"goulds", "gould":"goulds",
    "merriams wild":"merriams", "merriam wild":"merriams", "merriam's wild":"merriams",
    "merriams":"merriams", "merriam's":"merriams", "merriam":"merriams",
    "osceola wild":"osceola", "osceola wild turkey":"osceola",
    "rio grande wild":"rio", "rio grande wild turkey":"rio", "rio grand wild":"rio"
  };
  const WHITE_VARIANTS = {
    beltsville:{ name:"Beltsville Small White", male:"MBeltsvilleSmallWhite.jpg", female:"FBeltsvilleSmallWhite.jpg" },
    midget: { name:"Midget White", male:"MMidgetWhite.jpg", female:"FMidgetWhite.jpg" },
    holland: { name:"White Holland", male:"MWhiteHolland.jpg", female:"FWhiteHolland.jpg" },
    broad: { name:"Broad Breasted White", male:"MBroadBreastedWhite.jpg", female:"FBroadBreastedWhite.jpg" }
  };
  const WHITE_VARIETY_MAP = {
    "beltsville small white":"beltsville","beltsville white":"beltsville","white beltsville":"beltsville",
    "midget white":"midget","midget":"midget","white midget":"midget",
    "white holland":"holland","holland white":"holland","holland":"holland",
    "broad breasted white":"broad","broad-breasted white":"broad","large white":"broad","commercial white":"broad",
    "giant white":"broad","broad white":"broad","breasted white":"broad"
  };
  const BB_BRONZE = { name:"Broad Breasted Bronze", male:"MBroadBreastedBronze.jpg", female:"FBroadBreastedBronze.jpg" };
  const BB_BRONZE_MAP = {
    "broad breasted bronze":true,
    "broad-breasted bronze":true,
    "mammoth bronze":true,
    "orlopp bronze":true,
    "breasted bronze":true,
    "bronze breasted":true,
    "large bronze":true
  };
  function norm(s){ return String(s || "").trim().toLowerCase(); }
  function setParentImageAndName(prefix, displayName, maleFile, femaleFile){
    const container = document.getElementById(prefix + "ImageContainer");
    if (!container) return;
    const img = container.querySelector("img");
    const wantSrc = "https://portersturkeys.github.io/Pictures/" + (prefix === "dam" ? femaleFile : maleFile);
    if (img) {
      const cur = img.getAttribute("src") || "";
      if (!cur || cur.indexOf(wantSrc) === -1) img.src = wantSrc;
    }
    const strong = container.querySelector("strong");
    if (strong) {
      const spans = strong.querySelectorAll("span");
      if (spans && spans[0]) {
        if ((spans[0].textContent || "").trim() !== displayName) spans[0].textContent = displayName;
      } else {
        if ((strong.textContent || "").trim() !== displayName) strong.textContent = displayName;
      }
    }
  }
  function enforceOnce(prefix){
    const input = document.getElementById(prefix + "VarietyInput");
    const val = norm(input && input.value);
    const wildKey = WILD_VARIETY_MAP[val] || null;
    if (wildKey && WILD_VARIANTS[wildKey]) {
      const d = WILD_VARIANTS[wildKey];
      setParentImageAndName(prefix, d.name, d.male, d.female);
      return;
    }
    const whiteKey = WHITE_VARIETY_MAP[val] || null;
    if (whiteKey && WHITE_VARIANTS[whiteKey]) {
      const d = WHITE_VARIANTS[whiteKey];
      setParentImageAndName(prefix, d.name, d.male, d.female);
      return;
    }
    if (BB_BRONZE_MAP[val]) {
      setParentImageAndName(prefix, BB_BRONZE.name, BB_BRONZE.male, BB_BRONZE.female);
      return;
    }
  }
  function enforceBoth(){
    enforceOnce("sire");
    enforceOnce("dam");
  }
  function scheduleEnforce(){
    enforceBoth();
    setTimeout(enforceBoth, 0);
    setTimeout(enforceBoth, 50);
    setTimeout(enforceBoth, 150);
    setTimeout(enforceBoth, 300);
  }
  function wrap(fnName){
    const orig = window[fnName];
    if (typeof orig !== "function") return;
    if (orig && orig._ffOverlayEnforced) return;
    function wrapped(){
      const res = orig.apply(this, arguments);
      scheduleEnforce();
      return res;
    }
    wrapped._ffOverlayEnforced = true;
    window[fnName] = wrapped;
  }
  window.addEventListener("load", () => {
    wrap("applyVarietyToSire");
    wrap("applyVarietyToDam");
    ["sireVarietyInput","damVarietyInput"].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener("change", scheduleEnforce, true);
      el.addEventListener("blur", scheduleEnforce, true);
    });
    scheduleEnforce();
  });
})();

// ==============================
// MOBILE ZOOM FIX
// ==============================
(function () {
  function isPortraitMobile() {
    return window.matchMedia && window.matchMedia("(max-width: 700px) and (orientation: portrait)").matches;
  }
  function getViewportMeta() {
    let m = document.querySelector('meta[name="viewport"]');
    if (!m) {
      m = document.createElement("meta");
      m.name = "viewport";
      document.head.appendChild(m);
    }
    return m;
  }
  const vp = getViewportMeta();
  const originalContent = vp.getAttribute("content") || "";
  function lockViewport() {
    if (!isPortraitMobile()) return;
    let c = originalContent || "width=device-width, initial-scale=1";
    c = c.replace(/,\s*(maximum-scale|minimum-scale|user-scalable)\s*=\s*[^,]+/gi, "");
    c += ", maximum-scale=1, user-scalable=no";
    vp.setAttribute("content", c);
    const styleId = "noFocusZoomStyle";
    if (!document.getElementById(styleId)) {
      const st = document.createElement("style");
      st.id = styleId;
      st.textContent = `
        @media (max-width:700px) and (orientation: portrait) {
          #sireVarietyInput, #damVarietyInput, input, select, textarea {
            font-size:16px !important;
          }
        }
      `;
      document.head.appendChild(st);
    }
  }
  function unlockViewport() {
    vp.setAttribute("content", originalContent || "width=device-width, initial-scale=1");
  }
  function hook() {
    const sire = document.getElementById("sireVarietyInput");
    const dam = document.getElementById("damVarietyInput");
    [sire, dam].forEach(el => {
      if (!el || el._noZoomHooked) return;
      el._noZoomHooked = true;
      el.addEventListener("focus", lockViewport, true);
      el.addEventListener("blur", unlockViewport, true);
      el.addEventListener("pointerdown", lockViewport, true);
      el.addEventListener("touchstart", lockViewport, { passive:true, capture:true });
    });
  }
  window.addEventListener("load", () => {
    hook();
    setTimeout(hook, 250);
    setTimeout(hook, 1000);
    setTimeout(hook, 2500);
  });
})();

// ==============================
// AUTO-RESET SIRE/DAM VARIETY
// ==============================
(function autoResetSireDamVariety() {
    const sireInput = document.getElementById('sireVarietyInput');
    const damInput = document.getElementById('damVarietyInput');
    if (!sireInput && !damInput) return;
    function resetParent(prefix) {
        const alleles = ['Alleleb', 'AlleleC', 'Alleled', 'AlleleE', 'AlleleN', 'AllelePn', 'AlleleR', 'AlleleSl', 'AlleleSp'];
        alleles.forEach(suffix => {
            const id = prefix + suffix;
            const select = document.getElementById(id);
            if (select) select.selectedIndex = 0;
        });
        if (prefix === 'sire' && typeof updateSireGenotype === 'function') updateSireGenotype();
        if (prefix === 'dam' && typeof updateDamGenotype === 'function') updateDamGenotype();
        const container = document.getElementById(prefix + 'ImageContainer');
        if (container) {
            const img = container.querySelector('img');
            if (img) img.src = '';
            const strong = container.querySelector('strong');
            if (strong) strong.innerHTML = '';
        }
    }
    function shouldKeepApplied(val) {
        val = (val || '').trim().toLowerCase();
        if (!val) return false;
        return val.length > 2;
    }
    function handleInputChange(prefix, inputEl) {
        const val = inputEl.value.trim();
        if (!shouldKeepApplied(val)) resetParent(prefix);
    }
    [ {el: sireInput, prefix: 'sire'}, {el: damInput, prefix: 'dam'} ]
        .filter(item => item.el)
        .forEach(({el, prefix}) => {
            el.addEventListener('input', () => handleInputChange(prefix, el));
            el.addEventListener('blur', () => handleInputChange(prefix, el));
            el.addEventListener('paste', () => setTimeout(() => handleInputChange(prefix, el), 50));
        });
    console.log("[Auto-Reset] Active");
})();

// End of complete file
console.log("Full calculator loaded - special varieties drop to generic on allele change");








