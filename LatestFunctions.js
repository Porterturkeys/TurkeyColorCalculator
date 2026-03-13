function searchResults() {
    const input = document.getElementById('searchInput').value.trim();
    const results = document.getElementById('results');
    const resultsHeader = document.getElementById('resultsHeader');
    const additionalText = document.getElementById('resultsAdditionalText');

    // Clear previous results
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

    const allMappings = [
        phenotypeMapping1, phenotypeMapping1A, phenotypeMapping1B, phenotypeMapping1C,
        phenotypeMapping1D, phenotypeMapping1E, phenotypeMapping2, phenotypeMapping2A,
        phenotypeMapping3, phenotypeMapping3A, phenotypeMapping4, phenotypeMapping5,
        phenotypeMapping6, phenotypeMapping7, phenotypeMapping7A, phenotypeMapping7B,
        phenotypeMapping7C, phenotypeMapping8, phenotypeMapping9, phenotypeMapping10,
         phenotypeMapping11, phenotypeMapping12, phenotypeMapping13, phenotypeMapping14,
         phenotypeMapping15
    ].filter(mapping => typeof mapping !== 'undefined');

    if (allMappings.length === 0) {
        console.error("Phenotype mappings are not loaded.");
        resultsHeader.style.display = 'block';
        results.style.display = 'block';
        results.innerHTML = '<li style="color: red;">Error: Data not loaded. Please refresh.</li>';
        return;
    }

    let maleMatch = null;
    let femaleMatch = null;
    let sharedMatch = null;

    // Normalize input
    let normalizedInput = input.replace(/\s+/g, ' ').trim();

    // Apply synonyms
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
    if (synonymMap[lowerInput]) {
        normalizedInput = synonymMap[lowerInput];
    }

    // Run fuzzy on the synonym-applied input
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

    // Use fuzzy bestMatch ONLY if it's reasonably close (distance <=2), otherwise stick with synonym term
    const finalSearchTerm = (bestDistance <= 2 && bestMatch) ? bestMatch.toLowerCase().trim() : normalizedInput.toLowerCase().trim();

    // Main search using the final term
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

    // Display
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

// function to reset search input and results
function resetSearch() {
    const results = document.getElementById('results');
    const resultsHeader = document.getElementById('resultsHeader');
    const additionalText = document.getElementById('resultsAdditionalText');

    document.getElementById('searchInput').value = ''; // Clear input
    results.innerHTML = ''; // Clear results
    results.style.display = 'none'; // Hide results
    resultsHeader.style.display = 'none'; // Hide header
    additionalText.style.display = 'none'; // Hide additional text
}
        
        ////////////////////////////////////////////////////////
        
  // ==============================
// Helper: safely gather all phenotype mappings (shared safely)
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
    ].filter(m => m); // keep only loaded mappings
}

// ==============================
// Normalization helpers 
// ==============================
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

// ==============================
// INDEPENDENT SEARCH FEATURE 
// ==============================
function searchResults() {
    const inputEl = document.getElementById('searchInput');
    if (!inputEl) return;

    const results = document.getElementById('results');
    const resultsHeader = document.getElementById('resultsHeader');
    const additionalText = document.getElementById('resultsAdditionalText');
    const rawInput = inputEl.value.trim();

    // Clear previous results
    results.innerHTML = '';
    results.style.display = 'none';
    resultsHeader.style.display = 'none';
    additionalText.style.display = 'none';

    if (!rawInput) {
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

    const normalizedInput = normalizeVarietyInput(rawInput);
    const rawLower = rawInput.toLowerCase().trim();
    const sortedRawLower = normalizeWordOrder(rawLower);

    // Levenshtein distance (local to this function)
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

    // Find best phenotype match
    let bestMatch = null;
    let bestDistance = Infinity;
    for (let mapping of allMappings) {
        for (let [, phenotype] of Object.entries(mapping)) {
            const phenoNorm = phenotype.toLowerCase().trim();
            const phenoSorted = normalizeWordOrder(phenoNorm);
            const distance = Math.min(
                getEditDistance(rawLower, phenoNorm),
                getEditDistance(sortedRawLower, phenoSorted)
            );
            if (distance === 0) {
                bestMatch = phenotype;
                bestDistance = 0;
                break;
            } else if (distance < bestDistance && distance <= 3) {
                bestMatch = phenotype;
                bestDistance = distance;
            }
        }
        if (bestDistance === 0) break;
    }

    const finalSearchInput = bestMatch ? bestMatch.toLowerCase().trim() : normalizedInput;

    let maleMatch = null;
    let femaleMatch = null;
    let sharedMatch = null;

    for (let mapping of allMappings) {
        for (let [genotype, phenotype] of Object.entries(mapping)) {
            const normalizedGenotype = genotype.replace(/\s+/g, ' ').trim();
            const normalizedPhenotype = phenotype.toLowerCase().trim();

            if (normalizedPhenotype === finalSearchInput || normalizedGenotype === normalizedInput) {
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

    // Display results
    resultsHeader.style.display = 'block';
    results.style.display = 'block';

    if (sharedMatch) {
        results.innerHTML += `<li><strong>Shared Results (Male & Female):</strong></li>`;
        results.innerHTML += `<li>Genotype: ${sharedMatch.genotype}, Phenotype: ${sharedMatch.phenotype}</li>`;
    } else if (maleMatch || femaleMatch) {
        if (maleMatch) {
            results.innerHTML += `<li><strong>Male Results:</strong></li>`;
            results.innerHTML += `<li>Genotype: ${maleMatch.genotype}, Phenotype: ${maleMatch.phenotype}</li>`;
        }
        if (femaleMatch) {
            results.innerHTML += `<li><strong>Female Results:</strong></li>`;
            results.innerHTML += `<li>Genotype: ${femaleMatch.genotype}, Phenotype: ${femaleMatch.phenotype}</li>`;
        }
    } else {
        if (bestMatch) {
            results.innerHTML = `<li style="color: blue;">No exact match found. Did you mean <strong>${bestMatch}</strong>?</li>`;
        } else {
            results.innerHTML = `<li style="color: blue;">No matches found. Please check your spelling and try again.</li>`;
        }
    }

    additionalText.style.display = 'block';
    additionalText.innerHTML = `<p style="font-size: 18px; color: blue;">Enter this genotype or name into the calculator.</p>`;
}

function resetSearch() {
    const inputEl = document.getElementById('searchInput');
    const results = document.getElementById('results');
    const resultsHeader = document.getElementById('resultsHeader');
    const additionalText = document.getElementById('resultsAdditionalText');

    if (inputEl) inputEl.value = '';
    if (results) { results.innerHTML = ''; results.style.display = 'none'; }
    if (resultsHeader) resultsHeader.style.display = 'none';
    if (additionalText) additionalText.style.display = 'none';
}


// ==============================
// Phenotype - Genotype helpers (unchanged, safe)
// ==============================
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
              
        
   ////////////////////////////////////////////////////////     
        
// =====================================================
// SAFE PARENT PHENOTYPE CLEANER (NO OBSERVERS, NO LOOPS)
// Works for BOTH variety entry and allele dropdowns
// =====================================================

function cleanParentPhenotypesOnce() {
  ["sireImageContainer", "damImageContainer"].forEach(id => {
    const container = document.getElementById(id);
    if (!container) return;

    const strong = container.querySelector("strong");
    if (!strong) return;

    const spans = strong.querySelectorAll("span");
    if (!spans.length) return;

    const phenoSpan = spans[0]; // Phenotype/Variety line
    if (!phenoSpan.textContent) return;

    phenoSpan.textContent = phenoSpan.textContent
      .replace(/\s*\(Split.*?\)/gi, "")
      .trim();
  });
}

// Hook into Allele Dropdown Flow (SAFE)
if (typeof updateSireGenotype === "function") {
  const _updateSireGenotypeSafe = updateSireGenotype;
  updateSireGenotype = function () {
    _updateSireGenotypeSafe();
    setTimeout(cleanParentPhenotypesOnce, 0);
  };
}

if (typeof updateDamGenotype === "function") {
  const _updateDamGenotypeSafe = updateDamGenotype;
  updateDamGenotype = function () {
    _updateDamGenotypeSafe();
    setTimeout(cleanParentPhenotypesOnce, 0);
  };
}

// Run once on page load
window.addEventListener("DOMContentLoaded", cleanParentPhenotypesOnce);


// =====================================================
// HARD HOOK: CLEAN AFTER setGenotypeImage() (ALLELE FLOW)
// Guarantees cleaning on EVERY allele change
// =====================================================

if (typeof setGenotypeImage === "function") {
  const _setGenotypeImageSafe = setGenotypeImage;

  setGenotypeImage = function (...args) {
    // Run the original image + phenotype builder
    _setGenotypeImageSafe.apply(this, args);

    // Immediately clean the displayed parent phenotype
    setTimeout(cleanParentPhenotypesOnce, 0);
  };
}



// =====================================================
// OFFSPRING PHENOTYPE CLEANER (MALE + FEMALE RESULTS)
// =====================================================

function cleanOffspringPhenotypesOnce() {
  const offspringContainers = [
    document.getElementById("maleOffspringResults"),
    document.getElementById("femaleOffspringResults")
  ];

  offspringContainers.forEach(container => {
    if (!container) return;

    container.querySelectorAll(".offspring-item").forEach(item => {
      // Your offspring phenotype lives here:
      // <span class="variety-name">PHENOTYPE</span>
      const span = item.querySelector(".variety-name");
      if (!span || !span.textContent) return;

      span.textContent = span.textContent
        .replace(/\s*\(Split.*?\)/gi, "")
        .trim();
    });
  });
}

// HARD HOOK: ANY time offspring are rendered
if (typeof displayResults === "function") {
  const _displayResultsFinal = displayResults;

  displayResults = function (...args) {
    _displayResultsFinal.apply(this, args);
    setTimeout(cleanOffspringPhenotypesOnce, 0);
  };
}


// =====================================================
// SUMMARY CHART PHENOTYPE CLEANER (DISPLAY-ONLY, SAFE)
// =====================================================

function cleanSummaryPhenotypesOnce() {
  const summaryTable = document.getElementById("summaryChart");
  if (!summaryTable) return;

  summaryTable.querySelectorAll("td").forEach(td => {
    if (!td.textContent) return;

    if (/\(Split.*?\)/i.test(td.textContent)) {
      td.textContent = td.textContent
        .replace(/\s*\(Split.*?\)/gi, "")
        .trim();
    }
  });
}

// HARD HOOK: AFTER SUMMARY IS RENDERED
if (typeof displaySummaryChart === "function") {
  const _displaySummaryChartSafe = displaySummaryChart;

  displaySummaryChart = function (...args) {
    _displaySummaryChartSafe.apply(this, args);
    setTimeout(cleanSummaryPhenotypesOnce, 0);
  };
}


//  NO SOUND WHILE TYPING, ONLY when variety is actually selected/applied


function playVarietySound() {
  playSound('alleleClickSound');
}


document.addEventListener("mousedown", (e) => {
  const item = e.target.closest(".varSuggestionItem");
  if (!item) return;
  playVarietySound();
});


function updateImageSize(value) {
  const sireImg = document.querySelector('#sireImageContainer img');
  const damImg  = document.querySelector('#damImageContainer img');

  if (sireImg) {
    sireImg.style.width = value + 'px';
    // ONLY set max-width when shrinking - NEVER when at default
    if (value < 200) {
      sireImg.style.maxWidth = value + 'px';
    } else {
      sireImg.style.removeProperty('max-width');
      sireImg.style.removeProperty('max-height');
    }
  }
  if (damImg) {
    damImg.style.width = value + 'px';
    if (value < 200) {
      damImg.style.maxWidth = value + 'px';
    } else {
      damImg.style.removeProperty('max-width');
      damImg.style.removeProperty('max-height');
    }
  }
}

// Clean start on page load
window.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('imageSizeSlider');
  if (slider) {
    slider.value = 200;
    updateImageSize(200);
  }
});

// When user clicks to enlarge - removes any inline limits so CSS wins
document.addEventListener('click', function(e) {
  const img = e.target.closest('#sireImageContainer img, #damImageContainer img');
  if (img && img.classList.contains('enlarged')) {
    img.style.removeProperty('max-width');
    img.style.removeProperty('max-height');
    img.style.removeProperty('width');        
  }
});

/////////////////////////////////////////////////////

// =====================================================
// SAFE PARENT PHENOTYPE CLEANER (NO OBSERVERS, NO LOOPS)
// Works for BOTH variety entry and allele dropdowns
// =====================================================

function cleanParentPhenotypesOnce() {
  ["sireImageContainer", "damImageContainer"].forEach(id => {
    const container = document.getElementById(id);
    if (!container) return;
    const strong = container.querySelector("strong");
    if (!strong) return;
    const spans = strong.querySelectorAll("span");
    if (!spans.length) return;
    const phenoSpan = spans[0]; // Phenotype/Variety line
    if (!phenoSpan.textContent) return;

    phenoSpan.textContent = phenoSpan.textContent
      .replace(/\s*\(Split.*?\)/gi, "")           // existing
      .replace(/\s*\(Semi-?Pencilled.*?\)/gi, "") // new: covers (Semi-Pencilled), (semi-pencilled), (Semi Pencilled), etc.
      .trim();
  });
}


// Hook into Allele Dropdown Flow (SAFE)
if (typeof updateSireGenotype === "function") {
  const _updateSireGenotypeSafe = updateSireGenotype;
  updateSireGenotype = function () {
    _updateSireGenotypeSafe();
    setTimeout(cleanParentPhenotypesOnce, 0);
  };
}

if (typeof updateDamGenotype === "function") {
  const _updateDamGenotypeSafe = updateDamGenotype;
  updateDamGenotype = function () {
    _updateDamGenotypeSafe();
    setTimeout(cleanParentPhenotypesOnce, 0);
  };
}

// Run once on page load
window.addEventListener("DOMContentLoaded", cleanParentPhenotypesOnce);


// =====================================================
// HARD HOOK: CLEAN AFTER setGenotypeImage() (ALLELE FLOW)
// Guarantees cleaning on EVERY allele change
// =====================================================

if (typeof setGenotypeImage === "function") {
  const _setGenotypeImageSafe = setGenotypeImage;

  setGenotypeImage = function (...args) {
    // Run the original image + phenotype builder
    _setGenotypeImageSafe.apply(this, args);

    // Immediately clean the displayed parent phenotype
    setTimeout(cleanParentPhenotypesOnce, 0);
  };
}


// =====================================================
// OFFSPRING PHENOTYPE CLEANER (MALE + FEMALE RESULTS)
// =====================================================

function cleanOffspringPhenotypesOnce() {
  const offspringContainers = [
    document.getElementById("maleOffspringResults"),
    document.getElementById("femaleOffspringResults")
  ];
  offspringContainers.forEach(container => {
    if (!container) return;
    container.querySelectorAll(".offspring-item").forEach(item => {
      const span = item.querySelector(".variety-name");
      if (!span || !span.textContent) return;

      span.textContent = span.textContent
        .replace(/\s*\(Split.*?\)/gi, "")           // existing
        .replace(/\s*\(Semi-?Pencilled.*?\)/gi, "") // new
        .trim();
    });
  });
}

// HARD HOOK: ANY time offspring are rendered
if (typeof displayResults === "function") {
  const _displayResultsFinal = displayResults;

  displayResults = function (...args) {
    _displayResultsFinal.apply(this, args);
    setTimeout(cleanOffspringPhenotypesOnce, 0);
  };
}


// =====================================================
// SUMMARY CHART PHENOTYPE CLEANER (DISPLAY-ONLY, SAFE)
// =====================================================

function cleanSummaryPhenotypesOnce() {
  const summaryTable = document.getElementById("summaryChart");
  if (!summaryTable) return;
  summaryTable.querySelectorAll("td").forEach(td => {
    if (!td.textContent) return;
    if (/\(Split.*?\)/i.test(td.textContent) || /\(Semi-?Pencilled.*?\)/i.test(td.textContent)) {
      td.textContent = td.textContent
        .replace(/\s*\(Split.*?\)/gi, "")
        .replace(/\s*\(Semi-?Pencilled.*?\)/gi, "")
        .trim();
    }
  });
}


// HARD HOOK: AFTER SUMMARY IS RENDERED
if (typeof displaySummaryChart === "function") {
  const _displaySummaryChartSafe = displaySummaryChart;

  displaySummaryChart = function (...args) {
    _displaySummaryChartSafe.apply(this, args);
    setTimeout(cleanSummaryPhenotypesOnce, 0);
  };
}


function updateImageSize(value) {
  const sireImg = document.querySelector('#sireImageContainer img');
  const damImg  = document.querySelector('#damImageContainer img');

  if (sireImg) {
    sireImg.style.width = value + 'px';
    // ONLY set max-width when shrinking - NEVER when at default
    if (value < 200) {
      sireImg.style.maxWidth = value + 'px';
    } else {
      sireImg.style.removeProperty('max-width');
      sireImg.style.removeProperty('max-height');
    }
  }
  if (damImg) {
    damImg.style.width = value + 'px';
    if (value < 200) {
      damImg.style.maxWidth = value + 'px';
    } else {
      damImg.style.removeProperty('max-width');
      damImg.style.removeProperty('max-height');
    }
  }
}

// Clean start on page load
window.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('imageSizeSlider');
  if (slider) {
    slider.value = 200;
    updateImageSize(200);
  }
});


// When user clicks to enlarge - removes any inline limits so CSS wins
document.addEventListener('click', function(e) {
  const img = e.target.closest('#sireImageContainer img, #damImageContainer img');
  if (img && img.classList.contains('enlarged')) {
    img.style.removeProperty('max-width');
    img.style.removeProperty('max-height');
    img.style.removeProperty('width');        
  }
});

/////////////////////////

// =============================================================================
// TOGGLE: Keep (Split ...) and (Semi-Pencilled) visible in SUMMARY CHART
//        (but still clean them out of the offspring results)
// Paste at the BOTTOM of your file.
// To hide qualifiers again in summary chart: change true → false and reload
// =============================================================================

const KEEP_QUALIFIERS_IN_SUMMARY = true;  // ← change to false to revert to cleaning or true to leave

if (KEEP_QUALIFIERS_IN_SUMMARY && typeof cleanSummaryPhenotypesOnce === "function") {
  // Save original so we can restore it easily if needed
  window.originalCleanSummaryPhenotypesOnce = cleanSummaryPhenotypesOnce;

  // Replace with a no-op version (no cleaning happens in summary chart)
  cleanSummaryPhenotypesOnce = function () {
    const summaryTable = document.getElementById("summaryChart");
    if (!summaryTable) return;

    console.log(
      "cleanSummaryPhenotypesOnce: SKIPPED — (Split) and (Semi-Pencilled) kept visible in summary chart"
    );
    // No replaces performed → full text stays in the <td> cells
  };

  console.log(
    "Summary chart override ACTIVE: qualifiers will be VISIBLE (KEEP_QUALIFIERS_IN_SUMMARY = true)"
  );
} else if (!KEEP_QUALIFIERS_IN_SUMMARY && window.originalCleanSummaryPhenotypesOnce) {
  // Optional: auto-restore original when flag is false
  cleanSummaryPhenotypesOnce = window.originalCleanSummaryPhenotypesOnce;
  console.log(
    "Summary chart cleaning RESTORED (KEEP_QUALIFIERS_IN_SUMMARY = false)"
  );
}


//////////////////////////
// ===========================================
// Wild VARIANTS OVERLAY (parents + offspring) - TRANSFER FIX
// ===========================================
(function () {
  'use strict';

  const WILD_VARIANTS = {
    eastern:  { name: "Eastern Wild",  male: "MEasternWild.jpg", female: "FEasternWild.jpg", poult: "PEasternWild.jpg" },
    goulds:   { name: "Gould's Wild",   male: "MGouldsWild.jpg",  female: "FGouldsWild.jpg",  poult: "PGouldsWild.jpg" },
    merriams: { name: "Merriam's Wild", male: "MMerriamsWild.jpg", female: "FMerriamsWild.jpg", poult: "PMerriamsWild.jpg" },
    osceola:  { name: "Osceola Wild",   male: "MOsceolaWild.jpg",  female: "FOsceolaWild.jpg",  poult: "POsceolaWild.jpg" },
    rio:      { name: "Rio Grande Wild",male: "MRioGrandeWild.jpg",female: "FRioGrandeWild.jpg",poult: "PRioGrandeWild.jpg" },
    hybrid:   { name: "Hybrid Wild",    male: "MHybridWild.jpg",   female: "FHybridWild.jpg",   poult: "PHybridWild.jpg" }
  };

  const WILD_VARIETY_MAP = {
    "eastern wild": "eastern", "eastern": "eastern", "wild eastern": "eastern",
    "goulds wild": "goulds", "gould's wild": "goulds", "goulds wild turkey": "goulds", "gould's wild turkey": "goulds",
    "goulds": "goulds", "gould's": "goulds", "gould": "goulds",
    "merriams wild": "merriams", "merriam wild": "merriams", "merriam's wild": "merriams",
    "merriams": "merriams", "merriam's": "merriams", "merriam": "merriams",
    "osceola wild": "osceola", "osceola wild turkey": "osceola",
    "rio grande wild": "rio", "rio grande wild turkey": "rio", "rio grand wild": "rio",
    "hybrid wild": "hybrid", "hybrid": "hybrid"
  };

  const wildState = { sire: null, dam: null };

  function norm(str) {
    return (str || "").trim().toLowerCase();
  }

  function detectWildFromVariety(prefix) {
    const input = document.getElementById(prefix + "VarietyInput");
    const val = norm(input && input.value);
    const key = WILD_VARIETY_MAP[val] || null;
    wildState[prefix] = key;
    const container = document.getElementById(prefix + "ImageContainer");
    if (container) {
      if (key) container.dataset.wildKey = key;
      else delete container.dataset.wildKey;
    }
    return key;
  }

  function forceApplyWild(prefix) {
    const container = document.getElementById(prefix + "ImageContainer");
    if (!container) return;

    const key = container.dataset.wildKey || wildState[prefix];
    if (!key) return;

    const data = WILD_VARIANTS[key];
    if (!data) return;

    // Force bb if not already set
    const bronzeId = prefix === "sire" ? "sireAlleleb" : "damAlleleb";
    const bronzeSel = document.getElementById(bronzeId);
    if (bronzeSel && bronzeSel.value !== "bb" && !container._wildbbForced) {
      bronzeSel.value = "bb";
      if (prefix === "sire" && typeof updateSireGenotype === "function") updateSireGenotype();
      if (prefix === "dam" && typeof updateDamGenotype === "function") updateDamGenotype();
      container._wildbbForced = true;
    }

    // Force image
    const img = container.querySelector("img");
    if (img) {
      img.src = "https://portersturkeys.github.io/Pictures/" + (prefix === "dam" ? data.female : data.male);
    }

    // Force name
    const strong = container.querySelector("strong");
    if (strong) {
      let phenoSpan = strong.querySelector("span");
      if (!phenoSpan) {
        phenoSpan = document.createElement("span");
        strong.innerHTML = '';
        strong.appendChild(phenoSpan);
      }
      phenoSpan.textContent = data.name;
    }

    // Cleanup
    const info = document.getElementById(prefix + "InfoContainer");
    if (info) {
      info.querySelectorAll("span, div, strong").forEach(el => {
        if (/to be defined|bronze/i.test(el.textContent)) {
          el.textContent = data.name;
        }
      });
    }
  }

  function applyWildToParent(prefix) {
    const container = document.getElementById(prefix + "ImageContainer");
    if (!container) return;

    const key = container.dataset.wildKey || wildState[prefix];
    if (!key) return;

    const data = WILD_VARIANTS[key];
    if (!data) return;

    const strong = container.querySelector("strong");
    let currentText = "";
    if (strong) {
      const span = strong.querySelector("span");
      currentText = (span ? span.textContent : strong.textContent || "").trim().toLowerCase();
    }

    const isWildLike = /wild|bronze|to be defined|hybrid/i.test(currentText) || currentText === "";
    if (!isWildLike) return;

    forceApplyWild(prefix);
  }

  function applyWildToOffspring() {
    const sireKey = wildState.sire;
    const damKey = wildState.dam;
    if (!sireKey || !damKey) return;

    const variantKey = sireKey === damKey ? sireKey : "hybrid";
    const data = WILD_VARIANTS[variantKey];
    if (!data) return;
    const displayName = data.name;

    document.querySelectorAll("#maleOffspringResults li, #femaleOffspringResults li").forEach(li => {
      let html = li.innerHTML;
      if (html.includes(displayName)) return;
      html = html.replace(/\bWild\b(?=\s*\()/gi, displayName)
                 .replace(/\bBronze\b/gi, displayName)
                 .replace(/To Be Defined/gi, displayName);
      li.innerHTML = html;
    });

    const summaryBody = document.querySelector("#summaryChart tbody");
    if (summaryBody) {
      summaryBody.querySelectorAll("tr").forEach(tr => {
        const phenoCell = tr.cells?.[1];
        if (!phenoCell) return;
        let text = phenoCell.textContent || "";
        if (text.includes(displayName)) return;
        text = text.replace(/\bWild\b(?=\s*\()/gi, displayName)
                   .replace(/\bBronze\b/gi, displayName)
                   .replace(/to be defined/gi, displayName);
        phenoCell.textContent = text;
      });
    }

    function patchWildOffspringArray(arr) {
      if (!Array.isArray(arr)) return;
      arr.forEach(o => {
        if (!o) return;
        if (o.phenotype) {
          o.phenotype = o.phenotype
            .replace(/\bWild\b(?=\s*\()/gi, displayName)
            .replace(/\bBronze\b/gi, displayName)
            .replace(/to be defined/gi, displayName);
        }
        if (o.picturePath) {
          const file = o.picturePath.split("/").pop()?.toLowerCase();
          if (file === "mbronze.jpg") o.picturePath = "https://portersturkeys.github.io/Pictures/" + data.male;
          if (file === "fbronze.jpg") o.picturePath = "https://portersturkeys.github.io/Pictures/" + data.female;
          if (file === "pbronze.jpg") o.picturePath = "https://portersturkeys.github.io/Pictures/" + data.poult;
        }
        if (o.poultImagePath) {
          const file2 = o.poultImagePath.split("/").pop()?.toLowerCase();
          if (file2 === "pbronze.jpg") o.poultImagePath = "https://portersturkeys.github.io/Pictures/" + data.poult;
        }
      });
    }

    if (window.maleOffspring) patchWildOffspringArray(window.maleOffspring);
    if (window.femaleOffspring) patchWildOffspringArray(window.femaleOffspring);

    document.querySelectorAll("#maleOffspringResults img, #femaleOffspringResults img").forEach(img => {
      const file = img.src.split("/").pop()?.toLowerCase();
      if (file === "mbronze.jpg") img.src = "https://portersturkeys.github.io/Pictures/" + data.male;
      if (file === "fbronze.jpg") img.src = "https://portersturkeys.github.io/Pictures/" + data.female;
      if (file === "pbronze.jpg") img.src = "https://portersturkeys.github.io/Pictures/" + data.poult;
    });
  }

  function installWildOffspringObserver() {
    let patching = false;
    const targets = [
      document.getElementById("maleOffspringResults"),
      document.getElementById("femaleOffspringResults"),
      document.getElementById("summaryChart")
    ].filter(Boolean);
    if (!targets.length) return;
    targets.forEach(target => {
      const obs = new MutationObserver(() => {
        if (patching) return;
        patching = true;
        setTimeout(() => {
          applyWildToOffspring();
          patching = false;
        }, 0);
      });
      obs.observe(target, { childList: true, subtree: true });
    });
  }

  function wrapVarietyFn(fnName, prefix) {
    const original = window[fnName];
    if (typeof original !== "function") return;
    window[fnName] = function () {
      const res = original.apply(this, arguments);
      const key = detectWildFromVariety(prefix);
      if (key) {
        setTimeout(() => applyWildToParent(prefix), 0);
      } else {
        const container = document.getElementById(prefix + "ImageContainer");
        if (container) delete container.dataset.wildKey;
        wildState[prefix] = null;
      }
      return res;
    };
  }

  window.addEventListener("load", () => {
      
    wrapVarietyFn("applyVarietyToSire", "sire");
    wrapVarietyFn("applyVarietyToDam", "dam");

    if (typeof window.resetCalculator === "function") {
      const originalReset = window.resetCalculator;
      window.resetCalculator = function(initial) {
        const result = originalReset.apply(this, arguments);
        wildState.sire = null;
        wildState.dam = null;
        ["sire", "dam"].forEach(prefix => {
          const container = document.getElementById(prefix + "ImageContainer");
          if (container) {
            delete container.dataset.wildKey;
            delete container._wildbbForced;
          }
        });
        return result;
      };
    }

    installWildOffspringObserver();

    // TRANSFER FIX - keep state and force apply immediately after transfer
    if (typeof window.transferOffspringToParent === "function" && !window._wildTransferPatched) {
      window._wildTransferPatched = true;
      const originalTransfer = window.transferOffspringToParent;
      window.transferOffspringToParent = function(genotype, parent) {
        const res = originalTransfer.apply(this, arguments);
        if (parent === "sire" || parent === "dam") {
          if (wildState[parent]) {
            const container = document.getElementById(parent + "ImageContainer");
            if (container) {
              container.dataset.wildKey = wildState[parent];
              setTimeout(() => forceApplyWild(parent), 150);
              setTimeout(() => forceApplyWild(parent), 400);
            }
          }
        }
        return res;
      };
    }

    if (typeof window.handleDropdownChange === "function" && !window._wildFavoritesPatched) {
      window._wildFavoritesPatched = true;
      const originalHandle = window.handleDropdownChange;
      window.handleDropdownChange = function(type, dropdownId, alleleIds) {
        const res = originalHandle.apply(this, arguments);
        if (type === "sire" || type === "dam") {
          const dropdown = document.getElementById(dropdownId);
          const selectedName = dropdown?.value?.trim();
          if (selectedName) {
            const lower = selectedName.toLowerCase();
            const base = lower.replace(/\s*\(\d+\)\s*$/, "");
            let key = null;
            for (const [k, v] of Object.entries(WILD_VARIANTS)) {
              if (v.name.toLowerCase() === base) {
                key = k;
                break;
              }
            }
            const container = document.getElementById(type + "ImageContainer");
            if (key) {
              wildState[type] = key;
              if (container) container.dataset.wildKey = key;
              setTimeout(() => applyWildToParent(type), 0);
            } else {
              wildState[type] = null;
              if (container && container.dataset.wildKey) delete container.dataset.wildKey;
            }
          }
        }
        return res;
      };
    }

    if (typeof window.calculateOffspringWrapper === "function" && !window._wildCalcPatched) {
      window._wildCalcPatched = true;
      const origCalc = window.calculateOffspringWrapper;
      window.calculateOffspringWrapper = function() {
        const res = origCalc.apply(this, arguments);
        setTimeout(() => {
          ["sire", "dam"].forEach(prefix => {
            if (wildState[prefix]) applyWildToParent(prefix);
          });
          applyWildToOffspring();
        }, 100);
        return res;
      };
    }
  });
})();
//////////////////////////



// Toggle enlargement specifically for offspring images within offspring containers
document.addEventListener('click', function (event) {
    if (event.target.closest('.offspring-container') && event.target.tagName === 'IMG') {
        event.target.classList.toggle('enlarged');
        event.target.classList.toggle('enlarged-offspring');
        playSound('imageToggleSound');
    }
});
/////////////////////////////////

// ===========================================
// WHITE VARIANTS OVERLAY – FINAL FIX FOR GENERIC WHITE TRANSFER
// Forces "White (Dark Brown Eyes)" in input + display even if core transfer sets "Broad Breasted White"
// ===========================================
(function () {
  'use strict';

  const WHITE_VARIANTS = {
    beltsville: { name: "Beltsville Small White", male: "MBeltsvilleSmallWhite.jpg", female: "FBeltsvilleSmallWhite.jpg", poult: "PBeltsvilleSmallWhite.jpg" },
    midget:     { name: "Midget White",           male: "MMidgetWhite.jpg",           female: "FMidgetWhite.jpg",           poult: "PMidgetWhite.jpg" },
    holland:    { name: "White Holland",          male: "MWhiteHolland.jpg",          female: "FWhiteHolland.jpg",          poult: "PWhiteHolland.jpg" },
    broad:      { name: "Broad Breasted White",   male: "MBroadBreastedWhite.jpg",    female: "FBroadBreastedWhite.jpg",    poult: "PBroadBreastedWhite.jpg" }
  };

  const WHITE_VARIETY_MAP = {
    "beltsville small white": "beltsville", "beltsville white": "beltsville", "white beltsville": "beltsville",
    "midget white": "midget", "midget": "midget", "white midget": "midget",
    "white holland": "holland", "holland white": "holland", "holland": "holland",
    "broad breasted white": "broad", "broad-breasted white": "broad", "large white": "broad",
    "commercial white": "broad", "giant white": "broad", "broad white": "broad", "breasted white": "broad"
  };

  const whiteState = { sire: null, dam: null };

  function norm(str) {
    return (str || "").trim().toLowerCase();
  }

  function isWhiteGenotype(genotype) {
    const g = String(genotype || "");
    return /\bbb\b/.test(g) && /\bcc\b/.test(g);
  }

  function forceApplyWhite(prefix, forceGeneric = false) {
    const container = document.getElementById(prefix + "ImageContainer");
    if (!container) return;

    const key = container.dataset.whiteKey || whiteState[prefix];

    if (forceGeneric || !key) {
      // Force generic
      const img = container.querySelector("img");
      if (img) {
        const isDam = prefix === "dam";
        img.src = "https://portersturkeys.github.io/Pictures/" + (isDam ? "FBroadBreastedWhite.jpg" : "MBroadBreastedWhite.jpg");
      }
      const strong = container.querySelector("strong");
      if (strong) {
        let span = strong.querySelector("span");
        if (!span) {
          span = document.createElement("span");
          strong.innerHTML = '';
          strong.appendChild(span);
        }
        span.textContent = "White (Dark Brown Eyes)";
      }
      // Clean any Broad text in info
      const info = document.getElementById(prefix + "InfoContainer");
      if (info) {
        info.querySelectorAll("span, div, strong").forEach(el => {
          let t = el.textContent || "";
          if (t.toLowerCase().includes("broad breasted white") || t.includes("To Be Defined")) {
            el.textContent = "White (Dark Brown Eyes)";
          }
        });
      }
      return;
    }

    // Named variety forcing (unchanged from your original)
    const data = WHITE_VARIANTS[key];
    if (!data) return;
    const bId = prefix === "sire" ? "sireAlleleb" : "damAlleleb";
    const cId = prefix === "sire" ? "sireAlleleC" : "damAlleleC";
    const bSel = document.getElementById(bId);
    const cSel = document.getElementById(cId);
    let changed = false;
    if (bSel && bSel.value !== "bb") { bSel.value = "bb"; changed = true; }
    if (cSel && cSel.value !== "cc") { cSel.value = "cc"; changed = true; }
    if (changed) {
      (prefix === "sire" ? window.updateSireGenotype : window.updateDamGenotype)?.();
    }
    const img = container.querySelector("img");
    if (img) img.src = "https://portersturkeys.github.io/Pictures/" + (prefix === "dam" ? data.female : data.male);
    const strong = container.querySelector("strong");
    if (strong) {
      let span = strong.querySelector("span");
      if (!span) { span = document.createElement("span"); strong.innerHTML = ''; strong.appendChild(span); }
      span.textContent = data.name;
    }
    const info = document.getElementById(prefix + "InfoContainer");
    if (info) {
      info.querySelectorAll("span, div, strong").forEach(el => {
        if (/to be defined|white.*eyes/i.test(el.textContent || "")) {
          el.textContent = data.name;
        }
      });
    }
  }

  // TRANSFER HOOK – OVERRIDE INPUT VALUE AFTER ORIGINAL TRANSFER
  if (typeof window.transferOffspringToParent === "function" && !window._whiteTransferPatchedOverrideInput) {
    window._whiteTransferPatchedOverrideInput = true;
    const origTransfer = window.transferOffspringToParent;
    window.transferOffspringToParent = function(genotype, parent) {
      const res = origTransfer.apply(this, arguments);

      if (parent !== "sire" && parent !== "dam") return res;

      const varietyInput = document.getElementById(parent + "VarietyInput");
      const container = document.getElementById(parent + "ImageContainer");
      if (!varietyInput || !container) return res;

      const shouldBeWhite = isWhiteGenotype(genotype);
      if (!shouldBeWhite) {
        whiteState[parent] = null;
        delete container.dataset.whiteKey;
        return res;
      }

      // Wait briefly (original transfer may set "Broad Breasted White" async or in DOM update)
      setTimeout(() => {
        // Force generic white if not clearly a named variety from before
        const currentVal = norm(varietyInput.value || "");
        const isLikelyNamed = WHITE_VARIETY_MAP[currentVal] && !currentVal.includes("dark brown eyes");

        if (isLikelyNamed && whiteState[parent]) {
          // Rare case: preserve named if we had one stored
          const key = whiteState[parent];
          varietyInput.value = WHITE_VARIANTS[key]?.name || currentVal;
          forceApplyWhite(parent, false);
        } else {
          // Default to generic - this overrides the Broad Breasted White set by core transfer
          varietyInput.value = "White (Dark Brown Eyes)";
          whiteState[parent] = null;
          delete container.dataset.whiteKey;
          forceApplyWhite(parent, true);
        }

        // Force phenotype/image rebuild
        if (parent === "sire" && typeof window.updateSireGenotype === "function") {
          window.updateSireGenotype();
        }
        if (parent === "dam" && typeof window.updateDamGenotype === "function") {
          window.updateDamGenotype();
        }

        // Extra safety delay for any late UI updates
        setTimeout(() => forceApplyWhite(parent, true), 300);

      }, 150);  // Increased delay to beat core transfer's value set

      return res;
    };
  }

  

    

  function applyWhiteToParent(prefix) {
    const cSel = document.getElementById(prefix + "AlleleC");
    const inputVal = norm(document.getElementById(prefix + "VarietyInput")?.value || "");
    const key = whiteState[prefix] || WHITE_VARIETY_MAP[inputVal];
    if (cSel && cSel.value !== "cc" && key) {
      cSel.value = "cc";
      (prefix === "sire" ? window.updateSireGenotype : window.updateDamGenotype)?.();
    }
    const container = document.getElementById(prefix + "ImageContainer");
    if (!container) return;
    const activeKey = container.dataset.whiteKey || whiteState[prefix];
    forceApplyWhite(prefix, !activeKey);
  }

  function applyWhiteToOffspring() {
    const sireKey = whiteState.sire;
    const damKey = whiteState.dam;
    if (!sireKey || !damKey || sireKey !== damKey) return;
    const data = WHITE_VARIANTS[sireKey];
    if (!data) return;
    const displayName = data.name;

    function stripEyeNotes(str) {
      if (!str) return str;
      return str
        .replace(/\s*\(?\s*Dark\s*Brown\s*Eyes\s*\)?/gi, '')
        .replace(/\s*Dark\s*Brown\s*Eyes/gi, '')
        .replace(/\s*\([^)]*Eyes[^)]*\)/gi, '')
        .replace(/\s*eyes/gi, '')
        .replace(/\s*,\s*$/, '')
        .trim();
    }

    document.querySelectorAll("#maleOffspringResults li, #femaleOffspringResults li").forEach(li => {
      let html = li.innerHTML || '';
      html = html.replace(/\bWhite\b(?=\s*\()/gi, displayName)
                 .replace(/\bBronze\b/gi, displayName)
                 .replace(/To Be Defined/gi, displayName);
      html = stripEyeNotes(html);
      li.innerHTML = html;
    });

    const summaryBody = document.querySelector("#summaryChart tbody");
    if (summaryBody) {
      summaryBody.querySelectorAll("tr").forEach(tr => {
        const cell = tr.cells?.[1];
        if (!cell) return;
        let text = cell.textContent || "";
        text = text.replace(/\bWhite\b(?=\s*\()/gi, displayName)
                   .replace(/\bBronze\b/gi, displayName)
                   .replace(/to be defined/gi, displayName);
        text = stripEyeNotes(text);
        cell.textContent = text;
      });
    }

    function patchArray(arr) {
      if (!Array.isArray(arr)) return;
      arr.forEach(o => {
        if (!o) return;
        if (o.phenotype) {
          o.phenotype = stripEyeNotes(
            o.phenotype.replace(/\bWhite\b/gi, displayName)
                       .replace(/\bBronze\b/gi, displayName)
                       .replace(/To Be Defined/gi, displayName)
          );
        }
        if (o.picturePath) {
          const file = o.picturePath.split("/").pop()?.toLowerCase() || "";
          if (file.includes("white") || file.includes("darkbrowneyes")) {
            if (file.startsWith("m")) o.picturePath = "https://portersturkeys.github.io/Pictures/" + data.male;
            if (file.startsWith("f")) o.picturePath = "https://portersturkeys.github.io/Pictures/" + data.female;
            if (file.startsWith("p")) o.picturePath = "https://portersturkeys.github.io/Pictures/" + data.poult;
          }
        }
        if (o.poultImagePath) {
          const f2 = o.poultImagePath.split("/").pop()?.toLowerCase() || "";
          if (f2.includes("white") || f2.includes("darkbrowneyes")) {
            o.poultImagePath = "https://portersturkeys.github.io/Pictures/" + data.poult;
          }
        }
      });
    }

    if (window.maleOffspring) patchArray(window.maleOffspring);
    if (window.femaleOffspring) patchArray(window.femaleOffspring);

    document.querySelectorAll("#maleOffspringResults img, #femaleOffspringResults img").forEach(img => {
      const srcLower = img.src.toLowerCase();
      const file = img.src.split("/").pop()?.toLowerCase() || "";
      if (srcLower.includes('darkbrowneyes') || (srcLower.includes('white') && !srcLower.includes('broadbreastedwhite'))) {
        const isPoult = file.startsWith("p");
        const isMale = img.closest("#maleOffspringResults");
        if (isPoult) {
          img.src = "https://portersturkeys.github.io/Pictures/" + data.poult;
        } else if (isMale) {
          img.src = "https://portersturkeys.github.io/Pictures/" + data.male;
        } else {
          img.src = "https://portersturkeys.github.io/Pictures/" + data.female;
        }
      }
    });
  }

  function installWhiteOffspringObserver() {
    let patching = false;
    const targets = [
      document.getElementById("maleOffspringResults"),
      document.getElementById("femaleOffspringResults"),
      document.getElementById("summaryChart")
    ].filter(Boolean);
    if (!targets.length) return;
    targets.forEach(target => {
      const obs = new MutationObserver(() => {
        if (patching) return;
        patching = true;
        setTimeout(() => {
          applyWhiteToOffspring();
          patching = false;
        }, 0);
      });
      obs.observe(target, { childList: true, subtree: true, characterData: true });
    });
  }

  function wrapVarietyFn(fnName, prefix) {
    const original = window[fnName];
    if (typeof original !== "function") return;
    window[fnName] = function () {
      const res = original.apply(this, arguments);
      const key = detectWhiteFromVariety(prefix);
      if (key) {
        setTimeout(() => applyWhiteToParent(prefix), 0);
      } else {
        const container = document.getElementById(prefix + "ImageContainer");
        if (container) delete container.dataset.whiteKey;
        whiteState[prefix] = null;
      }
      return res;
    };
  }

  window.addEventListener("load", () => {
    wrapVarietyFn("applyVarietyToSire", "sire");
    wrapVarietyFn("applyVarietyToDam", "dam");

    if (typeof window.resetCalculator === "function") {
      const originalReset = window.resetCalculator;
      window.resetCalculator = function(initial) {
        const result = originalReset.apply(this, arguments);
        whiteState.sire = null;
        whiteState.dam = null;
        ["sire", "dam"].forEach(prefix => {
          const container = document.getElementById(prefix + "ImageContainer");
          if (container) {
            delete container.dataset.whiteKey;
          }
        });
        return result;
      };
    }

    installWhiteOffspringObserver();

    if (typeof window.calculateOffspringWrapper === "function" && !window._whiteCalcPatchedFinal) {
      window._whiteCalcPatchedFinal = true;
      const orig = window.calculateOffspringWrapper;
      window.calculateOffspringWrapper = function() {
        const res = orig.apply(this, arguments);
        setTimeout(() => {
          ["sire", "dam"].forEach(prefix => {
            const cSel = document.getElementById(prefix + "AlleleC");
            if (cSel?.value === "cc" && whiteState[prefix]) {
              applyWhiteToParent(prefix);
            }
          });
          applyWhiteToOffspring();
        }, 150);
        return res;
      };
    }
  });
})();

////////////////////////////////

// ===========================================
// BROAD BREASTED BRONZE + WHITE OVERLAY (fixed for Bronze × White transfers)
// ===========================================
(function () {
'use strict';
const BRONZE = {
name: "Broad Breasted Bronze",
male: "MBroadBreastedBronze.jpg",
female: "FBroadBreastedBronze.jpg",
poult: "PBroadBreastedBronze.jpg"
};
const WHITE = {
name: "Broad Breasted White",
male: "MBroadBreastedWhite.jpg",
female: "FBroadBreastedWhite.jpg",
poult: "PBroadBreastedWhite.jpg"
};
const BRONZE_MAP = {
"broad breasted bronze": true,
"broad-breasted bronze": true,
"mammoth bronze": true,
"orlopp bronze": true,
"breasted bronze": true,
"bronze breasted": true,
"large bronze": true
};
const WHITE_MAP = {
"broad breasted white": true,
"broad-breasted white": true,
"giant white": true,
"commercial white": true,
"large white": true,
"broad white": true,
"breasted white": true
};
const state = { sire: null, dam: null }; // "bronze" or "white"
function norm(str) {
return (str || "").trim().toLowerCase();
}
function detectType(prefix) {
const input = document.getElementById(prefix + "VarietyInput");
const val = norm(input?.value);
let type = null;
if (BRONZE_MAP[val]) type = "bronze";
else if (WHITE_MAP[val]) type = "white";
state[prefix] = type;
const container = document.getElementById(prefix + "ImageContainer");
if (container) {
if (type) container.dataset.bbType = type;
else delete container.dataset.bbType;
}
return type;
}
function forceApply(prefix) {
const container = document.getElementById(prefix + "ImageContainer");
if (!container) return;
const type = state[prefix];
if (!type) return;
const data = type === "bronze" ? BRONZE : WHITE;
// Force alleles
const bId = prefix === "sire" ? "sireAlleleb" : "damAlleleb";
const cId = prefix === "sire" ? "sireAlleleC" : "damAlleleC";
const bSel = document.getElementById(bId);
const cSel = document.getElementById(cId);
// Always force bb for both
if (bSel && bSel.value !== "bb") bSel.value = "bb";
// Bronze: do not force C - preserve transferred value (CC or Cc)
// White: force cc
if (type === "white" && cSel && cSel.value !== "cc") cSel.value = "cc";
if (prefix === "sire" && typeof updateSireGenotype === "function") updateSireGenotype();
if (prefix === "dam" && typeof updateDamGenotype === "function") updateDamGenotype();
// Image
const img = container.querySelector("img");
if (img) img.src = "https://portersturkeys.github.io/Pictures/" + (prefix === "dam" ? data.female : data.male);
// Name
const strong = container.querySelector("strong");
if (strong) {
let span = strong.querySelector("span");
if (!span) {
span = document.createElement("span");
strong.innerHTML = '';
strong.appendChild(span);
}
span.textContent = data.name;
}
// Cleanup
const info = document.getElementById(prefix + "InfoContainer");
if (info) {
info.querySelectorAll("span, div, strong").forEach(el => {
if (/bronze|white.*eyes|to be defined/i.test(el.textContent || "")) {
el.textContent = data.name;
}
});
}
// Do NOT force variety input here - let transfer or user keep the correct name
}
function applyToOffspring() {
if (!state.sire || !state.dam) return;
// Patch internal arrays - genotype decides name
function patchArray(arr) {
if (!Array.isArray(arr)) return;
arr.forEach(o => {
if (!o) return;
let name = BRONZE.name;
if (o.genotype && /\bcc\b/.test(o.genotype)) {
name = WHITE.name;
}
if (o.phenotype) {
o.phenotype = o.phenotype
.replace(/\bBronze\b/gi, name)
.replace(/\bWhite\b/gi, name)
.replace(/To Be Defined/gi, name);
}
const data = (name === WHITE.name) ? WHITE : BRONZE;
if (o.picturePath) {
const f = o.picturePath.split("/").pop()?.toLowerCase() || "";
if (f === "mbronze.jpg") o.picturePath = "https://portersturkeys.github.io/Pictures/" + data.male;
if (f === "fbronze.jpg") o.picturePath = "https://portersturkeys.github.io/Pictures/" + data.female;
if (f === "pbronze.jpg") o.picturePath = "https://portersturkeys.github.io/Pictures/" + data.poult;
}
if (o.poultImagePath) {
const f2 = o.poultImagePath.split("/").pop()?.toLowerCase() || "";
if (f2 === "pbronze.jpg") o.poultImagePath = "https://portersturkeys.github.io/Pictures/" + data.poult;
}
});
}
if (window.maleOffspring) patchArray(window.maleOffspring);
if (window.femaleOffspring) patchArray(window.femaleOffspring);
// Patch visible text
document.querySelectorAll("#maleOffspringResults li, #femaleOffspringResults li").forEach(li => {
let html = li.innerHTML;
const fullBronze = BRONZE.name;
const fullWhite = WHITE.name;
if (html.includes(fullBronze) || html.includes(fullWhite)) return;
html = html.replace(/\bBronze\b/gi, fullBronze)
.replace(/\bWhite\b/gi, fullWhite)
.replace(/To Be Defined/gi, fullBronze);
li.innerHTML = html.trim();
});
// Patch summary chart
const summaryBody = document.querySelector("#summaryChart tbody");
if (summaryBody) {
summaryBody.querySelectorAll("tr").forEach(tr => {
const cell = tr.cells?.[1];
if (!cell) return;
let text = cell.textContent || "";
const fullBronze = BRONZE.name;
const fullWhite = WHITE.name;
if (text.includes(fullBronze) || text.includes(fullWhite)) return;
text = text.replace(/\bBronze\b/gi, fullBronze)
.replace(/\bWhite\b/gi, fullWhite)
.replace(/to be defined/gi, fullBronze);
cell.textContent = text.trim();
});
}
// Patch visible images
document.querySelectorAll("#maleOffspringResults img, #femaleOffspringResults img").forEach(img => {
const file = img.src.split("/").pop()?.toLowerCase() || "";
if (file === "mbronze.jpg") img.src = "https://portersturkeys.github.io/Pictures/" + BRONZE.male;
if (file === "fbronze.jpg") img.src = "https://portersturkeys.github.io/Pictures/" + BRONZE.female;
if (file === "pbronze.jpg") img.src = "https://portersturkeys.github.io/Pictures/" + BRONZE.poult;
});

////////////////////////

// Force clean name and standard image for bb cc offspring
document.querySelectorAll("#maleOffspringResults li, #femaleOffspringResults li").forEach(li => {
  let html = li.innerHTML || '';
  html = html.replace(/\s*\(Dark\s*Brown\s*Eyes\)\s*/gi, '');
  html = html.replace(/\s*\([^)]*Eyes[^)]*\)/gi, '');
  li.innerHTML = html.trim();
});

document.querySelectorAll("#maleOffspringResults img, #femaleOffspringResults img").forEach(img => {
  const src = img.src.toLowerCase();
  const fileName = img.src.split("/").pop()?.toLowerCase() || "";

  // Adult images (unchanged from your working version)
  if (src.includes('darkbrowneyes') || (src.includes('white') && !src.includes('broadbreastedwhite'))) {
    const isMale = img.closest('#maleOffspringResults');
    img.src = "https://portersturkeys.github.io/Pictures/" + (isMale ? "MBroadBreastedWhite.jpg" : "FBroadBreastedWhite.jpg");
  }

  // Added: Poult images only (p prefix) - force standard BB White poult if wrong
  if (fileName.startsWith("p") &&
      (src.includes('darkbrowneyes') || 
       (src.includes('white') && !src.includes('broadbreastedwhite')))) {
    img.src = "https://portersturkeys.github.io/Pictures/PBroadBreastedWhite.jpg";
  }
});
    
/////////////////////
    
}
function wrapVarietyFn(fnName, prefix) {
const orig = window[fnName];
if (typeof orig !== "function" || orig._bbWrapped) return;
window[fnName] = function (...args) {
const res = orig.apply(this, args);
if (detectType(prefix)) {
setTimeout(() => forceApply(prefix), 100);
setTimeout(() => forceApply(prefix), 400);
}
return res;
};
window[fnName]._bbWrapped = true;
}
window.addEventListener("load", () => {
wrapVarietyFn("applyVarietyToSire", "sire");
wrapVarietyFn("applyVarietyToDam", "dam");
if (typeof window.resetCalculator === "function") {
const orig = window.resetCalculator;
window.resetCalculator = function (...args) {
const res = orig.apply(this, args);
state.sire = state.dam = null;
["sire", "dam"].forEach(p => {
const c = document.getElementById(p + "ImageContainer");
if (c) delete c.dataset.bbType;
});
return res;
};
}
// TRANSFER - refined for Bronze/White: clear old state, precise genotype check
if (typeof window.transferOffspringToParent === "function" && !window._bbTransferPatchedMixed) {
window._bbTransferPatchedMixed = true;
const orig = window.transferOffspringToParent;
window.transferOffspringToParent = function (genotype, parent) {
const res = orig.apply(this, arguments);
if (parent !== "sire" && parent !== "dam") return res;
const varietyInput = document.getElementById(parent + "VarietyInput");
const container = document.getElementById(parent + "ImageContainer");
if (!varietyInput || !container) return res;
// Clear old state first - allows overriding White with Bronze offspring
state[parent] = null;
delete container.dataset.bbType;
// Clean and normalize variety input value after transfer
let val = norm(varietyInput.value || "");
val = val
.replace(/\s*$ .*? $/g, '')
.replace(/\s+/g, ' ')
.trim()
.toLowerCase();
let type = null;
// Forgiving name match
if (
BRONZE_MAP[val] ||
val.includes("broad breasted bronze") ||
val.includes("broad bronze") ||
val.includes("mammoth bronze") ||
val.includes("orlopp bronze") ||
val.includes("large bronze")
) {
type = "bronze";
} else if (
WHITE_MAP[val] ||
val.includes("broad breasted white") ||
val.includes("broad white") ||
val.includes("giant white") ||
val.includes("large white") ||
val.includes("commercial white")
) {
type = "white";
}
// Fallback: precise genotype check without lower (distinguish CC, Cc, cc)
if (!type) {
const geno = String(genotype || "");
const hasCC = /\bCC\b/.test(geno);
const hasCc = /\bCc\b/.test(geno);
const hascc = /\bcc\b/.test(geno);
const hasBB = /\bbb\b/.test(geno);
if (hasBB) {
if (hascc) type = "white"; // bb cc = white
else if (hasCC || hasCc) type = "bronze"; // bb CC or bb Cc = bronze
}
}
if (type) {
state[parent] = type;
container.dataset.bbType = type;
// Force apply with staggered delays for UI timing
setTimeout(() => forceApply(parent), 50);
setTimeout(() => forceApply(parent), 150);
setTimeout(() => forceApply(parent), 300);
// Only set variety input if it's clearly wrong/blank
const targetName = type === "white" ? WHITE.name : BRONZE.name;
if (!varietyInput.value.trim() || varietyInput.value.trim().toLowerCase().includes("to be defined")) {
varietyInput.value = targetName;
}
} else {
// Not BB-related → ensure no stale forcing
state[parent] = null;
delete container.dataset.bbType;
}
return res;
};
}
if (typeof window.calculateOffspringWrapper === "function" && !window._bbCalcPatched) {
window._bbCalcPatched = true;
const orig = window.calculateOffspringWrapper;
window.calculateOffspringWrapper = function (...args) {
const res = orig.apply(this, args);
setTimeout(() => {
["sire", "dam"].forEach(prefix => {
if (state[prefix]) forceApply(prefix);
});
applyToOffspring();
}, 200);
return res;
};
}
});
})();

////////////////////////////////
// =====================================================
// SUMMARY CHART / Dam (shows ONLY after calculate)
// Uses MutationObserver on #summaryChart tbody (your working method)
// PLUS: If parent name is blank (default), infer "Bronze" from genotype "bb"
// =====================================================
window.addEventListener("load", () => {
  if (window._summaryBreedingObserverInstalled) return;
  window._summaryBreedingObserverInstalled = true;

  const summaryContainer = document.getElementById("summaryChartContainer");
  const summaryTable = document.getElementById("summaryChart");
  const sireInfo = document.getElementById("sireInfoContainer");
  const damInfo  = document.getElementById("damInfoContainer");
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

  // start hidden/blank
  label.style.display = "none";
  label.innerHTML = "";

  function clean(t){ return String(t || "").replace(/\s+/g, " ").trim(); }
  function shortGeno(el){ return clean(el.getAttribute("data-short-genotype") || ""); }

  // If the UI name is blank, infer a sensible default from genotype
  function inferVarietyFromShortGeno(g) {
    g = clean(g);
    // Your default bronze shows genotype "bb"
    if (/^bb(\s|$)/i.test(g)) return "Bronze";
    return "";
  }

  // (Same safe name-finder that got you correct names)
  function getVarietyName(role) {
    const roleRx = new RegExp(role, "i");
    const goodRx = /(variety|phenotype|name|display|selected|choice|result)/i;
    const badRx  = /(genotype|allele|image|male|female|poult|pictures|photo|slider|size|favorite|save)/i;

    const els = document.querySelectorAll("input,select,textarea,span,div,p,strong,b,label,h1,h2,h3,h4");
    let best = {score:-1e9, text:""};

    els.forEach(el => {
      const hay = ((el.id||"")+" "+(el.className||"")+" "+(el.getAttribute("name")||"")).toLowerCase();
      if (!roleRx.test(hay) || badRx.test(hay)) return;

      const raw = /input|select|textarea/i.test(el.tagName) ? el.value : el.textContent;
      const t = clean(raw);
      if (!t || /^(sire|dam)$/i.test(t)) return;

      // reject genotype-like strings
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
    // Only show after results exist
    if (!summaryHasResults()) {
      label.style.display = "none";
      label.innerHTML = "";
      return;
    }

    const sireG = shortGeno(sireInfo);
    const damG  = shortGeno(damInfo);

    // Try UI names first; if blank, infer from genotype; else fall back to Sire/Dam
    const sireName = getVarietyName("sire") || inferVarietyFromShortGeno(sireG) || "Sire";
    const damName  = getVarietyName("dam")  || inferVarietyFromShortGeno(damG)  || "Dam";

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

  // Observe summary table body (your working trigger)
  const tbody = summaryTable.querySelector("tbody");
  if (tbody) {
    const obs = new MutationObserver(() => updateLabel());
    obs.observe(tbody, { childList: true, subtree: true });
  }

  // Clear/hide on reset
  if (typeof window.resetCalculator === "function") {
    const originalReset = window.resetCalculator;
    window.resetCalculator = function () {
      const r = originalReset.apply(this, arguments);
      label.style.display = "none";
      label.innerHTML = "";
      return r;
    };
  }

  // DOES NOT populate on load, stays hidden until tbody changes
});




///////////////////////////////////




// =====================================================
// OFFSPRING RESULTS TITLE
// - Appears ONLY after summary table has results
// - Clears on Reset
// - Placed directly above the summary table
// =====================================================
window.addEventListener("load", () => {
  if (window._offspringResultsTitleControlled) return;
  window._offspringResultsTitleControlled = true;

  const container = document.getElementById("summaryChartContainer");
  const table = document.getElementById("summaryChart");
  if (!container || !table) return;

  // Create wrapper + title (once)
  let wrap = document.getElementById("offspringResultsTitle");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.id = "offspringResultsTitle";
    wrap.style.textAlign = "center";
    wrap.style.margin = "5px 0";
    wrap.style.display = "none"; // hidden by default

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

    // Insert directly above the table
    table.parentNode.insertBefore(wrap, table);
  }

  function summaryHasResults() {
    const tbody = table.querySelector("tbody");
    return !!(tbody && tbody.querySelectorAll("tr").length > 0);
  }

  function updateTitleVisibility() {
    wrap.style.display = summaryHasResults() ? "block" : "none";
  }

  // Watch summary table body (same reliable trigger you're already using)
  const tbody = table.querySelector("tbody");
  if (tbody) {
    const obs = new MutationObserver(() => updateTitleVisibility());
    obs.observe(tbody, { childList: true, subtree: true });
  }

  // Clear on reset
  if (typeof window.resetCalculator === "function") {
    const originalReset = window.resetCalculator;
    window.resetCalculator = function () {
      const r = originalReset.apply(this, arguments);
      wrap.style.display = "none";
      return r;
    };
  }

  // Does NOT show on load
});


/////////////////////////


// LIVE TYPE-TO-APPLY (STRICT exact match only) + AUTO-RESET when match breaks


(function LiveApplyVarietyWithReset_STRICT() {

  if (window._LiveApplyVarietyWithReset_STRICT_installed) return;
  window._LiveApplyVarietyWithReset_STRICT_installed = true;

  // ----- Capture the true default allele dropdown values on load -----
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
      if (el && defaultAlleles[prefix][id] !== undefined) {
        el.value = defaultAlleles[prefix][id];
      }
    });

    if (prefix === "sire" && typeof window.updateSireGenotype === "function") window.updateSireGenotype();
    if (prefix === "dam"  && typeof window.updateDamGenotype  === "function") window.updateDamGenotype();
  }

  // ----- Build an EXACT phenotype set (lowercased) -----
  let EXACT = new Set();

  function rebuildExactSet() {
    EXACT = new Set();
    try {
      const maps = (typeof window.getAllPhenotypeMappings === "function")
        ? window.getAllPhenotypeMappings()
        : [];

      maps.forEach(map => {
        if (!map) return;
        Object.values(map).forEach(p => {
          if (!p) return;
          EXACT.add(String(p).trim().toLowerCase());
        });
      });
    } catch (e) {
      console.warn("[LIVE STRICT] Could not rebuild exact set:", e);
    }
  }

  function normalizeMaybe(s) {
    const raw = String(s || "").trim();
    if (!raw) return "";
    if (typeof window.normalizeVarietyInput === "function") {
      return String(window.normalizeVarietyInput(raw) || "").trim().toLowerCase();
    }
    return raw.toLowerCase();
  }

  function isExactMatch(rawInput) {
    const raw = String(rawInput || "").trim().toLowerCase();
    if (!raw) return false;

    // 1) raw exact
    if (EXACT.has(raw)) return true;

    // 2) synonym-normalized exact (but NOT word-order)
    const norm = normalizeMaybe(rawInput);
    if (norm && EXACT.has(norm)) return true;

    return false;
  }

  // ----- Live apply state per parent -----
  const state = {
    sire: { applied: false },
    dam:  { applied: false }
  };

  function handleLive(prefix) {
    const input = document.getElementById(prefix === "sire" ? "sireVarietyInput" : "damVarietyInput");
    if (!input) return;

    const raw = (input.value || "").trim();
    const st = state[prefix];

    // Apply immediately ONLY on strict exact match
    if (raw && isExactMatch(raw) && typeof window.findFirstGenotypeForPhenotype === "function") {
      const g = window.findFirstGenotypeForPhenotype(raw);
      if (g && typeof window.applyGenotypeToDropdowns === "function") {
        window.applyGenotypeToDropdowns(g, prefix);
        st.applied = true;
        return;
      }
    }

    // If it USED to be applied but match broke (user continued typing) => restore defaults
    if (st.applied && !isExactMatch(raw)) {
      st.applied = false;
      restoreDefaults(prefix);
    }

    // If user cleared the input, also restore defaults (keeps behavior clean)
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

  // ----- Init -----
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

////////////////////////////




// =====================================================
// FIREFOX/SAFARI FIX: Custom Variety Dropdown that WAITs for mappings
// Sire/Dam only. Does not care about duplicate functions.
// =====================================================
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

      // Avoid Object.values quirks by iterating keys (older Safari-safe)
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

      if (low.indexOf(q) === 0) {
        starts.push(v);
      } else {
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
      dd.style.left  = (window.scrollX + r.left) + "px";
      dd.style.top   = (window.scrollY + r.bottom + 2) + "px";
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

      try { if (typeof window.playVarietySound === "function") window.playVarietySound(); } catch(e){}


      // IMPORTANT: call your existing apply functions
      if (role === "sire" && typeof window.applyVarietyToSire === "function") window.applyVarietyToSire();
      if (role === "dam"  && typeof window.applyVarietyToDam  === "function") window.applyVarietyToDam();

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

          // Safari: touchstart is key. Also keep mousedown.
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
      // If cache is empty, try building again (this is the FF/Safari fix)
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
      // Rebuild on focus in case mappings loaded after page init
      buildVarietyCache(true);
      update();
    });

    inputEl.addEventListener("input", function(){
      update();
    });

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

    // Safari/Firefox: blur can fire before click; keep a small delay
    inputEl.addEventListener("blur", function(){ setTimeout(close, 200); });

    window.addEventListener("scroll", function(){ if (state.open) position(); }, true);
    window.addEventListener("resize", function(){ if (state.open) position(); });

    return { update:update };
  }

  function waitForMappingsThenInit() {
    var tries = 0;
    var maxTries = 120; // ~12 seconds at 100ms
    var timer = setInterval(function(){
      tries++;

      buildVarietyCache(true);

      // ready when cache has items and inputs exist
      var sire = document.getElementById("sireVarietyInput");
      var dam  = document.getElementById("damVarietyInput");

      if (cachedVarieties.length && (sire || dam)) {
        clearInterval(timer);
        if (sire) makeDropdown(sire, "sire");
        if (dam)  makeDropdown(dam, "dam");
      }

      if (tries >= maxTries) {
        clearInterval(timer);
        // still install dropdowns even if empty; focus/input will keep retrying
        var s2 = document.getElementById("sireVarietyInput");
        var d2 = document.getElementById("damVarietyInput");
        if (s2) makeDropdown(s2, "sire");
        if (d2) makeDropdown(d2, "dam");
      }
    }, 100);
  }

  // IMPORTANT: use window.load (Firefox/Safari timing)
  window.addEventListener("load", function(){
    waitForMappingsThenInit();
  });

})();


////////////////////////

// =====================================================
// Gate ONLY the VARIETY sound (do NOT wrap playSound)
// This preserves allele dropdown sounds everywhere.
// =====================================================
(function VarietySelectionSoundGate(){
  if (window._varietySelectionSoundGateInstalled) return;
  window._varietySelectionSoundGateInstalled = true;

  // Allow window (ms) during which variety sound is permitted
  let allowUntil = 0;
  function arm(ms = 800) { allowUntil = Date.now() + ms; }

  // Replace your wrapper so it is the ONLY gated path
  window.playVarietySound = function () {
    if (Date.now() > allowUntil) return; // BLOCK (prevents typing/blur/calc noise)
    if (typeof window.playSound === "function") window.playSound("alleleClickSound");
  };

  // Arm ONLY on real variety selection UI interactions
  document.addEventListener("pointerdown", function(e){
    if (e.target && e.target.closest && e.target.closest(".variety-dd-item")) arm();
  }, true);

  // If you still use the blue landscape suggestion list:
  document.addEventListener("pointerdown", function(e){
    if (e.target && e.target.closest && e.target.closest(".varSuggestionItem")) arm();
  }, true);

  // Optional: disarm on Calculate (extra safety)
  document.addEventListener("click", function(e){
    const btn = e.target && e.target.closest && e.target.closest('button[onclick="calculateOffspringWrapper()"]');
    if (btn) allowUntil = 0;
  }, true);

})();


////////////////////////////////////

// FIREFOX FIX: parent image/name enforcement (Wild/White/BB)
// Do not delete unless Firefox behavior changes

// =====================================================
// FIREFOX ONLY: Parent overlay enforcer (Wild / Named White / BB Bronze / BB White)
// Fixes: Firefox showing Bronze/no-image until Calculate.
// Safe: Does NOT touch overlay functions or observers.
// =====================================================
(function FirefoxParentOverlayEnforcer(){
  const ua = navigator.userAgent || "";
  const IS_FIREFOX = /Firefox\//i.test(ua);
  if (!IS_FIREFOX) return;
  if (window._ffParentOverlayEnforcerInstalled) return;
  window._ffParentOverlayEnforcerInstalled = true;

  // --------- MAPS (copied from your working config) ---------
  const WILD_VARIANTS = {
    eastern:  { name:"Eastern Wild",      male:"MEasternWild.jpg",      female:"FEasternWild.jpg" },
    goulds:   { name:"Gould's Wild",      male:"MGouldsWild.jpg",       female:"FGouldsWild.jpg"  },
    merriams: { name:"Merriam's Wild",    male:"MMerriamsWild.jpg",     female:"FMerriamsWild.jpg" },
    osceola:  { name:"Osceola Wild",      male:"MOsceolaWild.jpg",      female:"FOsceolaWild.jpg" },
    rio:      { name:"Rio Grande Wild",   male:"MRioGrandeWild.jpg",    female:"FRioGrandeWild.jpg" },
    hybrid:   { name:"Hybrid Wild",       male:"MHybridWild.jpg",       female:"FHybridWild.jpg" }
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
    midget:   { name:"Midget White",            male:"MMidgetWhite.jpg",          female:"FMidgetWhite.jpg" },
    holland:  { name:"White Holland",           male:"MWhiteHolland.jpg",         female:"FWhiteHolland.jpg" },
    broad:    { name:"Broad Breasted White",    male:"MBroadBreastedWhite.jpg",   female:"FBroadBreastedWhite.jpg" }
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

  // --------- helpers ----------
  function norm(s){ return String(s || "").trim().toLowerCase(); }

  function setParentImageAndName(prefix, displayName, maleFile, femaleFile){
    const container = document.getElementById(prefix + "ImageContainer");
    if (!container) return;

    const img = container.querySelector("img");
    const wantSrc = "https://portersturkeys.github.io/Pictures/" + (prefix === "dam" ? femaleFile : maleFile);

    if (img) {
      // Only set if missing or wrong (prevents loops)
      const cur = img.getAttribute("src") || "";
      if (!cur || cur.indexOf(wantSrc) === -1) {
        img.src = wantSrc;
      }
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

    // 1) Wild
    const wildKey = WILD_VARIETY_MAP[val] || null;
    if (wildKey && WILD_VARIANTS[wildKey]) {
      const d = WILD_VARIANTS[wildKey];
      setParentImageAndName(prefix, d.name, d.male, d.female);
      return;
    }

    // 2) Named White (incl BB White)
    const whiteKey = WHITE_VARIETY_MAP[val] || null;
    if (whiteKey && WHITE_VARIANTS[whiteKey]) {
      const d = WHITE_VARIANTS[whiteKey];
      setParentImageAndName(prefix, d.name, d.male, d.female);
      return;
    }

    // 3) Broad Breasted Bronze
    if (BB_BRONZE_MAP[val]) {
      setParentImageAndName(prefix, BB_BRONZE.name, BB_BRONZE.male, BB_BRONZE.female);
      return;
    }
  }

  function enforceBoth(){
    enforceOnce("sire");
    enforceOnce("dam");
  }

  // Firefox timing: do multiple passes after variety application
  function scheduleEnforce(){
    // immediate
    enforceBoth();
    // beat late DOM/image updates in Firefox
    setTimeout(enforceBoth, 0);
    setTimeout(enforceBoth, 50);
    setTimeout(enforceBoth, 150);
    setTimeout(enforceBoth, 300);
  }

  // Hook variety apply if present (safe wrap; Firefox-only)
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

    // Also run when the inputs change (covers programmatic value sets)
    ["sireVarietyInput","damVarietyInput"].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener("change", scheduleEnforce, true);
      el.addEventListener("blur", scheduleEnforce, true);
    });

    // First pass after load
    scheduleEnforce();
  });


})();

/* ==========================================================
   MOBILE FIREFOX/iOS PORTRAIT:
   Prevent "blow up" / zoom when tapping into Sire/Dam inputs

   ========================================================== */
(function () {
  // Only target small portrait screens 
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

  // Lock scaling while typing (prevents iOS/Firefox focus zoom)
  function lockViewport() {
    if (!isPortraitMobile()) return;

    
    const base = originalContent || "width=device-width, initial-scale=1";
    let c = base;

  
    c = c.replace(/,\s*(maximum-scale|minimum-scale|user-scalable)\s*=\s*[^,]+/gi, "");

  
    c += ", maximum-scale=1, user-scalable=no";
    vp.setAttribute("content", c);

   
    const styleId = "noFocusZoomStyle";
    if (!document.getElementById(styleId)) {
      const st = document.createElement("style");
      st.id = styleId;
      st.textContent = `
        @media (max-width:700px) and (orientation: portrait) {
          #sireVarietyInput, #damVarietyInput,
          input, select, textarea {
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
    const dam  = document.getElementById("damVarietyInput");

    [sire, dam].forEach(el => {
      if (!el || el._noZoomHooked) return;
      el._noZoomHooked = true;

      el.addEventListener("focus", lockViewport, true);
      el.addEventListener("blur", unlockViewport, true);

      // Some mobile browsers fire pointerdown before focus; lock early
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


/////////////////////
// ────────────────────────────────────────────────────────────────
// AUTO-RESET for Sire & Dam Variety Inputs (UPDATED for wild bb fix)
// Clears genotype dropdowns + images when user clears or changes variety name
// ────────────────────────────────────────────────────────────────
(function autoResetSireDamVariety() {
    const sireInput = document.getElementById('sireVarietyInput');
    const damInput = document.getElementById('damVarietyInput');
    if (!sireInput && !damInput) return;
    // Function to reset one parent (dropdowns + image + phenotype display)
    function resetParent(prefix) {
        // Reset all allele dropdowns to default (usually the first option or empty)
        const alleles = ['Alleleb', 'AlleleC', 'Alleled', 'AlleleE', 'AlleleN', 'AllelePn', 'AlleleR', 'AlleleSl', 'AlleleSp'];
        alleles.forEach(suffix => {
            const id = prefix + suffix;
            const select = document.getElementById(id);
            if (select) {
                select.selectedIndex = 0; // reset to first option (usually default like "B-" or "--")
            }
        });
        // NEW: Clear the wild bb forced flag so it can be re-applied on next wild entry
        const container = document.getElementById(prefix + 'ImageContainer');
        if (container) {
            delete container._wildbbForced;
        }
        // Force update genotype display / image
        if (prefix === 'sire' && typeof updateSireGenotype === 'function') {
            updateSireGenotype();
        }
        if (prefix === 'dam' && typeof updateDamGenotype === 'function') {
            updateDamGenotype();
        }
        // Clear any forced images or text (wild/white/BB overlays etc.)
        if (container) {
            const img = container.querySelector('img');
            if (img) img.src = ''; // blank image or set to placeholder if you have one
            const strong = container.querySelector('strong');
            if (strong) strong.innerHTML = ''; // clear phenotype text
        }
    }
    // Check if value is "valid" enough to keep genotype applied
    function shouldKeepApplied(val) {
        val = (val || '').trim().toLowerCase();
        if (!val) return false; // empty → reset
        // Optional: add more checks if you want (e.g. length < 3 → reset)
        return val.length > 2;
    }
    function handleInputChange(prefix, inputEl) {
        const val = inputEl.value.trim();
        if (!shouldKeepApplied(val)) {
            resetParent(prefix);
        }
        // If it's a new valid name, existing applyVarietyToSire/Dam will handle applying it
    }
    // Attach listeners
    [ {el: sireInput, prefix: 'sire'}, {el: damInput, prefix: 'dam'} ]
        .filter(item => item.el)
        .forEach(({el, prefix}) => {
            el.addEventListener('input', () => handleInputChange(prefix, el));
            // Also on blur/paste (extra safety)
            el.addEventListener('blur', () => handleInputChange(prefix, el));
            el.addEventListener('paste', () => setTimeout(() => handleInputChange(prefix, el), 50));
        });
    console.log("[Auto-Reset] Sire & Dam variety inputs now auto-clear genotypes on empty/change (with wild bb fix)");
})();








