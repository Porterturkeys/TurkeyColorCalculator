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
        phenotypeMapping6, phenotypeMapping7, phenotypeMapping8, phenotypeMapping9,
        phenotypeMapping10, phenotypeMapping11, phenotypeMapping12, phenotypeMapping13,
        phenotypeMapping14, phenotypeMapping15
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
        phenotypeMapping6, phenotypeMapping7, phenotypeMapping8, phenotypeMapping9,
        phenotypeMapping10, phenotypeMapping11, phenotypeMapping12, phenotypeMapping13,
        phenotypeMapping14, phenotypeMapping15
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


//////////////////////////

// ===========================================
// Wild VARIANTS OVERLAY (parents + offspring)
// ===========================================
(function () {
  'use strict';

  // Adjust filenames to match actual picture names
    const WILD_VARIANTS = {
    eastern: {
      name:  "Eastern Wild",
      male:  "MEasternWild.jpg",
      female:"FEasternWild.jpg",
      poult: "PEasternWild.jpg"
    },
    goulds: {
      name:  "Gould's Wild",
      male:  "MGouldsWild.jpg",
      female:"FGouldsWild.jpg",
      poult: "PGouldsWild.jpg"
    },
    merriams: {
      name:  "Merriam's Wild",
      male:  "MMerriamsWild.jpg",
      female:"FMerriamsWild.jpg",
      poult: "PMerriamsWild.jpg"
    },
    osceola: {
      name:  "Osceola Wild",
      male:  "MOsceolaWild.jpg",
      female:"FOsceolaWild.jpg",
      poult: "POsceolaWild.jpg"
    },
    rio: {
      name:  "Rio Grande Wild",
      male:  "MRioGrandeWild.jpg",
      female:"FRioGrandeWild.jpg",
      poult: "PRioGrandeWild.jpg"
    },
    hybrid: {
      name:  "Hybrid Wild",
      male:  "MHybridWild.jpg",
      female:"FHybridWild.jpg",
      poult: "PHybridWild.jpg"
    }
  };

  // What the user actually types in the variety box
  const WILD_VARIETY_MAP = {
    "eastern wild":           "eastern",
    "eastern":                "eastern",
    "wild eastern":           "eastern",
   

    "goulds wild":           "goulds",
    "gould's wild":          "goulds",
    "goulds wild turkey":    "goulds",
    "gould's wild turkey":   "goulds",
    "goulds":                "goulds",
    "gould's":               "goulds",
    "gould":                 "goulds",


    "merriams wild":   "merriams",
    "merriam wild":    "merriams",
    "merriam's wild":  "merriams",
    "merriams":        "merriams",
    "merriam's":       "merriams",
    "merriam":         "merriams",

    "osceola wild":           "osceola",
    "osceola wild turkey":    "osceola",

    "rio grande wild":        "rio",
    "rio grande wild turkey": "rio",
    "rio grand wild":         "rio"
    
    
  };


  // Track current wild variant per parent
  const wildState = {
    sire: null,   // "eastern" | "goulds" | "merriams" | "osceola" | "rio" | null
    dam:  null
  };

  function norm(str) {
    return (str || "").trim().toLowerCase();
  }

  // When user types / uses variety autocomplete, figure out if it's a Wild variant
  function detectWildFromVariety(prefix) {
    const input = document.getElementById(prefix + "VarietyInput");
    const val   = norm(input && input.value);
    const key   = WILD_VARIETY_MAP[val] || null;

    wildState[prefix] = key;

    const container = document.getElementById(prefix + "ImageContainer");
    if (container) {
      if (key) container.dataset.wildKey = key;
      else delete container.dataset.wildKey;
    }

    return key;
  }
  

    // Overlay Wild variant on a parent (image + visible name)
  function applyWildToParent(prefix) {
    const container = document.getElementById(prefix + "ImageContainer");
    if (!container) return;

    const key  = container.dataset.wildKey || wildState[prefix];
    if (!key) return;

    const data = WILD_VARIANTS[key];
    if (!data) return;

    // 0) Force Bronze locus dropdown to bb for Wild parents
    //    (so the genotype actually becomes bb at the bronze locus)
    const bronzeSelectId = prefix === "sire" ? "sireAlleleb" : "damAlleleb";
    const bronzeSelect   = document.getElementById(bronzeSelectId);

    if (bronzeSelect && bronzeSelect.value !== "bb") {
      bronzeSelect.value = "bb";

      if (prefix === "sire" && typeof updateSireGenotype === "function") {
        updateSireGenotype();
      }
      if (prefix === "dam" && typeof updateDamGenotype === "function") {
        updateDamGenotype();
      }
    }

    // 1) Swap parent image to correct Wild file
    const img = container.querySelector("img");
    if (img) {
      img.src = "https://portersturkeys.github.io/Pictures/" + (prefix === "dam" ? data.female : data.male);
    }

    // 2) Fix visible phenotype/variety label, assuming first <span> under a <strong>
    const strong = container.querySelector("strong");
    if (strong) {
      const spans = strong.querySelectorAll("span");
      const phenoSpan = spans[0];
      if (phenoSpan) {
        phenoSpan.textContent = data.name;
      }
    }

    // 3) Clean up "To Be Defined" in parent info container, if present
    const info = document.getElementById(prefix + "InfoContainer");
    if (info) {
      info.querySelectorAll("span, div, strong").forEach(el => {
        if (/to be defined/i.test(el.textContent)) {
          el.textContent = data.name;
        }
      });
    }
  }


          // ===========================================
  // Wild offspring naming + images
  //  - same-strain wild  that subspecies
  //  - different wild- Hybrid Wild
  // ===========================================
  function applyWildToOffspring() {
    const sireKey = wildState.sire;
    const damKey  = wildState.dam;

    // Need BOTH parents to be Wild variants
    if (!sireKey || !damKey) return;

    const sameStrain = (sireKey === damKey);

    // same wild that subspecies
    // different wild - Hybrid Wild
    const variantKey  = sameStrain ? sireKey : "hybrid";
    const data        = WILD_VARIANTS[variantKey];
    if (!data) return;

    const displayName = data.name; // e.g. "Eastern Wild" or "Hybrid Wild"

    // 1) Patch visible offspring text lines (male + female lists)
    document
      .querySelectorAll("#maleOffspringResults li, #femaleOffspringResults li")
      .forEach(li => {
        let html = li.innerHTML;

        // If already shows the variety name, skip to prevent multiplying it
        if (html.includes(displayName)) return;

        // "Wild (Dark Brown Eyes)"  "Eastern Wild (Dark Brown Eyes)" or "Hybrid Wild (..)"
        html = html.replace(/\bWild\b(?=\s*\()/gi, displayName);

        // Bronze / "To Be Defined"  strain/hybrid name
        html = html.replace(/\bBronze\b/gi, displayName);
        html = html.replace(/To Be Defined/gi, displayName);

        li.innerHTML = html;
      });

    // 2) Patch summary chart DOM if present
    const summaryBody = document.querySelector("#summaryChart tbody");
    if (summaryBody) {
      summaryBody.querySelectorAll("tr").forEach(tr => {
        const phenoCell = tr.cells && tr.cells[1];
        if (!phenoCell) return;

        let text = phenoCell.textContent || "";

        // If already contains the variety name, skip
        if (text.includes(displayName)) return;

        text = text.replace(/\bWild\b(?=\s*\()/gi, displayName);
        text = text.replace(/\bBronze\b/gi, displayName);
        text = text.replace(/to be defined/gi, displayName);

        phenoCell.textContent = text;
      });
    }

    // 3) Patch internal offspring arrays' image paths (Bronze  strain/hybrid images)
    function patchWildOffspringArray(arr) {
      if (!Array.isArray(arr)) return;

      arr.forEach(o => {
        if (!o) return;

        // Fix phenotype text stored in the data
        if (o.phenotype) {
          o.phenotype = o.phenotype
            .replace(/\bWild\b(?=\s*\()/gi, displayName)
            .replace(/\bBronze\b/gi, displayName)
            .replace(/to be defined/gi, displayName);
        }

        if (o.picturePath) {
          const file = (o.picturePath.split("/").pop() || "").toLowerCase();

          // Base offspring from core are Bronze - swap to Wild/Hybrid files
          if (file === "mbronze.jpg") {
            o.picturePath = "https://portersturkeys.github.io/Pictures/" + data.male;
          } else if (file === "fbronze.jpg") {
            o.picturePath = "https://portersturkeys.github.io/Pictures/" + data.female;
          } else if (file === "pbronze.jpg") {
            o.picturePath = "https://portersturkeys.github.io/Pictures/" + data.poult;
          }
        }

        if (o.poultImagePath) {
          const file2 = (o.poultImagePath.split("/").pop() || "").toLowerCase();

          if (file2 === "pbronze.jpg") {
            o.poultImagePath = "https://portersturkeys.github.io/Pictures/" + data.poult;
          }
        }
      });
    }

    if (window.maleOffspring)  patchWildOffspringArray(window.maleOffspring);
    if (window.femaleOffspring) patchWildOffspringArray(window.femaleOffspring);

    // 4) Patch visible offspring <img> elements in the DOM
    document
      .querySelectorAll("#maleOffspringResults img, #femaleOffspringResults img")
      .forEach(img => {
        const src  = img.getAttribute("src") || "";
        const file = src.split("/").pop().toLowerCase();

        // Swap visible Bronze images to the correct Wild or Hybrid images
        if (file === "mbronze.jpg") {
          img.src = "https://portersturkeys.github.io/Pictures/" + data.male;
        } else if (file === "fbronze.jpg") {
          img.src = "https://portersturkeys.github.io/Pictures/" + data.female;
        } else if (file === "pbronze.jpg") {
          img.src = "https://portersturkeys.github.io/Pictures/" + data.poult;
        }
      });
  }


  // Offspring/summary observer
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

  // Wrap variety functions so they record Wild state + apply overlay
  function wrapVarietyFn(fnName, prefix) {
    const original = window[fnName];
    if (typeof original !== "function") return;

    window[fnName] = function () {
      const res = original.apply(this, arguments);

      const key = detectWildFromVariety(prefix);
      if (key) {
        // Let core finish DOM changes, then overlay Wild variant
        setTimeout(() => applyWildToParent(prefix), 0);
      } else {
        const container = document.getElementById(prefix + "ImageContainer");
        if (container) delete container.dataset.wildKey;
        wildState[prefix] = null;
      }

      return res;
    };
  }

  // Watch parents for DOM changes and re-apply Wild overlay
  function installObservers() {
    const parentFlags = { sire: false, dam: false };

    ["sire", "dam"].forEach(prefix => {
      const container = document.getElementById(prefix + "ImageContainer");
      if (!container) return;

      const obs = new MutationObserver(() => {
        if (parentFlags[prefix]) return;
        parentFlags[prefix] = true;
        setTimeout(() => {
          applyWildToParent(prefix);
          parentFlags[prefix] = false;
        }, 0);
      });

      obs.observe(container, { childList: true, subtree: true });
    });
  }

  // Hook everything after core is loaded
window.addEventListener("load", () => {
  // Variety handlers 
  wrapVarietyFn("applyVarietyToSire", "sire");
  wrapVarietyFn("applyVarietyToDam",  "dam");

  // Make Reset clear Wild overlay state
  if (typeof window.resetCalculator === "function") {
    const originalReset = window.resetCalculator;

    window.resetCalculator = function(initial) {
      const result = originalReset.apply(this, arguments);

      // Clear Wild state
      wildState.sire = null;
      wildState.dam  = null;

      // Remove Wild flags from parent image containers
      ["sire", "dam"].forEach(prefix => {
        const container = document.getElementById(prefix + "ImageContainer");
        if (container && container.dataset.wildKey) {
          delete container.dataset.wildKey;
        }
      });

      return result;
    };
  }

  // DOM observers: keep Wild overlay alive through Calculate / redraws
  installObservers();

  // Offspring/summary overlay (same-strain Wild -Wild only)
  installWildOffspringObserver();

  // When an offspring is used as sire/dam, keep Wild / Hybrid Wild
  // for wild-wild crosses; otherwise clear Wild overlay.
  if (typeof window.transferOffspringToParent === "function" && !window._wildTransferPatched) {
    window._wildTransferPatched = true;

    const originalTransfer = window.transferOffspringToParent;

    window.transferOffspringToParent = function(genotype, parent) {
      // Run the core logic first (sets genotype, base image, etc.)
      const result = originalTransfer.apply(this, arguments);

      if (parent === "sire" || parent === "dam") {
        const sireKey = wildState.sire;
        const damKey  = wildState.dam;

        if (sireKey && damKey) {
          //  wild cross.
          // same strain  that subspecies
          // different strains  Hybrid Wild (if defined)
          const sameStrain = (sireKey === damKey);
          const variantKey = sameStrain ? sireKey : "hybrid";

          if (WILD_VARIANTS[variantKey]) {
            // Track this new parent as that wild / hybrid variant
            wildState[parent] = variantKey;

            const container = document.getElementById(parent + "ImageContainer");
            if (container) {
              container.dataset.wildKey = variantKey;
            }

            // Re-apply overlay so the parent shows correct wild name + image
            setTimeout(() => applyWildToParent(parent), 0);
          }
        } else {
          // Not a wild -wild context clear Wild overlay on this parent
          wildState[parent] = null;
          const container = document.getElementById(parent + "ImageContainer");
          if (container && container.dataset.wildKey) {
            delete container.dataset.wildKey;
          }
        }
      }

      return result;
    };
  }

  // ===========================================
  // FAVORITES  PARENT: keep Wild overlay
  // when loading a saved favorite
  // ===========================================
  if (typeof window.handleDropdownChange === "function" && !window._wildFavoritesPatched) {
    window._wildFavoritesPatched = true;

    const originalHandleDropdownChange = window.handleDropdownChange;

    window.handleDropdownChange = function (type, dropdownId, alleleIds) {
      // 1) Let favorites logic run normally (sets alleles + genotype + base image/name)
      const result = originalHandleDropdownChange.apply(this, arguments);

      // 2) Then try to re-apply a Wild overlay based on the favorite's name
      if (type === "sire" || type === "dam") {
        const dropdown = document.getElementById(dropdownId);
        const selectedName = dropdown && dropdown.value;
        if (selectedName) {
          // Strip duplicate suffix like "Eastern Wild (1)"
          const lowerName = selectedName.trim().toLowerCase();
          const baseName  = lowerName.replace(/\s*\(\d+\)\s*$/, "");

          let variantKey = null;

          // Match against WILD_VARIANT names (e.g. "Eastern Wild", "Goulds Wild")
          for (const [key, data] of Object.entries(WILD_VARIANTS)) {
            if (data.name.toLowerCase() === baseName) {
              variantKey = key;
              break;
            }
          }

          const container = document.getElementById(type + "ImageContainer");

          if (variantKey) {
            // Saved favorite is a named Wild subspecies (or Hybrid Wild, if defined)
            wildState[type] = variantKey;
            if (container) {
              container.dataset.wildKey = variantKey;
            }
            setTimeout(() => applyWildToParent(type), 0);
          } else {
            // Not a named wild favorite clear any previous wild overlay
            wildState[type] = null;
            if (container && container.dataset.wildKey) {
              delete container.dataset.wildKey;
            }
          }
        }
      }

      return result;
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
////////////////////////////////////




// ===========================================
// WHITE VARIANTS OVERLAY (parents + offspring)
// ===========================================
(function () {
  'use strict';

  // Adjust filenames to match actual picture names
  const WHITE_VARIANTS = {
    beltsville: {
      name:  "Beltsville Small White",
      male:  "MBeltsvilleSmallWhite.jpg",
      female:"FBeltsvilleSmallWhite.jpg",
      poult: "PBeltsvilleSmallWhite.jpg"
    },
    midget: {
      name:  "Midget White",
      male:  "MMidgetWhite.jpg",
      female:"FMidgetWhite.jpg",
      poult: "PMidgetWhite.jpg"
    },
    holland: {
      name:  "White Holland",
      male:  "MWhiteHolland.jpg",
      female:"FWhiteHolland.jpg",
      poult: "PWhiteHolland.jpg"
    },
    broad: {
      name:  "Broad Breasted White",
      male:  "MBroadBreastedWhite.jpg",
      female:"FBroadBreastedWhite.jpg",
      poult: "PBroadBreastedWhite.jpg"
    }
  };

  // What the user actually types in the variety box
  const WHITE_VARIETY_MAP = {
    "beltsville small white":        "beltsville",
    "beltsville white":              "beltsville",
    "white beltsville":              "beltsville",

    "midget white":            "midget",
    "midget":                  "midget",
    "white midget":            "midget",

    "white holland":           "holland",
    "holland white":           "holland",
    "holland":                 "holland",

    "broad breasted white":   "broad",
    "broad-breasted white":   "broad",
    "large white":            "broad",
    "commercial white":       "broad",
    "giant white":            "broad",
    "broad white":            "broad",
    "breasted white":         "broad"

  };

  // Track current white variant per parent
  const whiteState = {
    sire: null,   // "beltsville" | "midget" | "holland" | "broad" | null
    dam:  null
  };

  function norm(str) {
    return (str || "").trim().toLowerCase();
  }

  // When user types / uses variety autocomplete, figure out if it's a White variant
  function detectWhiteFromVariety(prefix) {
    const input = document.getElementById(prefix + "VarietyInput");
    const val   = norm(input && input.value);
    const key   = WHITE_VARIETY_MAP[val] || null;

    whiteState[prefix] = key;

    const container = document.getElementById(prefix + "ImageContainer");
    if (container) {
      if (key) container.dataset.whiteKey = key;
      else delete container.dataset.whiteKey;
    }

    return key;
  }

    // Overlay White variant on a parent (image + visible name)
  function applyWhiteToParent(prefix) {
    const container = document.getElementById(prefix + "ImageContainer");
    if (!container) return;

    const key  = container.dataset.whiteKey || whiteState[prefix];
    if (!key) return;

    const data = WHITE_VARIANTS[key];
    if (!data) return;

    // 0) Force bronze locus to bb and color locus to cc for White parents
    const bronzeSelectId = prefix === "sire" ? "sireAlleleb"  : "damAlleleb";
    const cSelectId      = prefix === "sire" ? "sireAlleleC" : "damAlleleC";

    const bronzeSelect = document.getElementById(bronzeSelectId);
    const cSelect      = document.getElementById(cSelectId);

    let changed = false;

    if (bronzeSelect && bronzeSelect.value !== "bb") {
      bronzeSelect.value = "bb";
      changed = true;
    }
    if (cSelect && cSelect.value !== "cc") {
      cSelect.value = "cc";
      changed = true;
    }

    // If  changed B or C, refresh that parent's genotype
    if (changed) {
      if (prefix === "sire" && typeof updateSireGenotype === "function") {
        updateSireGenotype();
      }
      if (prefix === "dam" && typeof updateDamGenotype === "function") {
        updateDamGenotype();
      }
    }

    // 1) Swap parent image to correct White file
    const img = container.querySelector("img");
    if (img) {
      img.src = "https://portersturkeys.github.io/Pictures/" + (prefix === "dam" ? data.female : data.male);
    }

    // 2) Fix visible phenotype/variety label, assuming first <span> under a <strong>
    const strong = container.querySelector("strong");
    if (strong) {
      const spans = strong.querySelectorAll("span");
      const phenoSpan = spans[0];
      if (phenoSpan) {
        phenoSpan.textContent = data.name;
      }
    }

    // 3) Clean up "To Be Defined" in parent info container, if present
    const info = document.getElementById(prefix + "InfoContainer");
    if (info) {
      info.querySelectorAll("span, div, strong").forEach(el => {
        if (/to be defined/i.test(el.textContent)) {
          el.textContent = data.name;
        }
      });
    }
  }

      // ===========================================
  // White offspring naming + images (same-strain only)
  // ===========================================
  function applyWhiteToOffspring() {
    const sireKey = whiteState.sire;
    const damKey  = whiteState.dam;

    // Need BOTH parents to be White variants and the SAME strain
    if (!sireKey || !damKey || sireKey !== damKey) return;

    const data = WHITE_VARIANTS[sireKey];
    if (!data) return;

    const displayName = data.name; // e.g. "Midget White"

    // 1) Patch visible offspring text lines (male + female lists)
//    (ONLY touch text, leave <img> and its click handlers alone)
document
  .querySelectorAll("#maleOffspringResults li, #femaleOffspringResults li")
  .forEach(li => {
    const namePattern = new RegExp(displayName + "\\s*\\([^)]*\\)", "g");

    function walk(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        let text = node.nodeValue;

        // Replace generic White/Bronze/To Be Defined with the named white
        text = text.replace(/\bWhite\b(?=\s*\()/gi, displayName);
        text = text.replace(/\bBronze\b/gi, displayName);
        text = text.replace(/To Be Defined/gi, displayName);

        // Strip "(... Eyes)" from named whites in the text
        text = text.replace(namePattern, displayName);

        node.nodeValue = text;
      } else if (node.childNodes && node.childNodes.length) {
        // Recurse into children
        for (let i = 0; i < node.childNodes.length; i++) {
          walk(node.childNodes[i]);
        }
      }
    }

    walk(li);
  });


    // 2) Patch summary chart DOM if present
    const summaryBody = document.querySelector("#summaryChart tbody");
if (summaryBody) {
  summaryBody.querySelectorAll("tr").forEach(tr => {
    const phenoCell = tr.cells && tr.cells[1];
    if (!phenoCell) return;

    let text = phenoCell.textContent || "";

    text = text.replace(/\bWhite\b(?=\s*\()/gi, displayName);
    text = text.replace(/\bBronze\b/gi, displayName);
    text = text.replace(/to be defined/gi, displayName);

    // Strip "(... Eyes)" from named whites in summary too
    text = text.replace(
      new RegExp(displayName + "\\s*\\([^)]*\\)", "g"),
      displayName
    );

    phenoCell.textContent = text;
  });
}


    // 3) Patch internal offspring arrays' image paths 
    function patchWhiteOffspringArray(arr) {
      if (!Array.isArray(arr)) return;

      arr.forEach(o => {
        if (!o) return;

        // picturePath: swap generic White images - named White images
        if (o.picturePath) {
          const file = (o.picturePath.split("/").pop() || "").toLowerCase();

          if (/^mwhite/.test(file)) {
            // Male White - named male White
            o.picturePath = "https://portersturkeys.github.io/Pictures/" + data.male;
          } else if (/^fwhite/.test(file)) {
            // Female White - named female White
            o.picturePath = "https://portersturkeys.github.io/Pictures/" + data.female;
          } else if (/^pwhite/.test(file)) {
            // Poult White - named poult White
            o.picturePath = "https://portersturkeys.github.io/Pictures/" + data.poult;
          }
        }

        // poultImagePath: same deal
        if (o.poultImagePath) {
          const file2 = (o.poultImagePath.split("/").pop() || "").toLowerCase();

          if (/^pwhite/.test(file2)) {
            o.poultImagePath = "https://portersturkeys.github.io/Pictures/" + data.poult;
          }
        }
      });
    }

    if (window.maleOffspring)  patchWhiteOffspringArray(window.maleOffspring);
    if (window.femaleOffspring) patchWhiteOffspringArray(window.femaleOffspring);

    // 4) Patch visible offspring <img> elements in the DOM
    document
      .querySelectorAll("#maleOffspringResults img, #femaleOffspringResults img")
      .forEach(img => {
        const src  = img.getAttribute("src") || "";
        const file = src.split("/").pop().toLowerCase();

        if (/^mwhite/.test(file)) {
          img.src = "https://portersturkeys.github.io/Pictures/" + data.male;
        } else if (/^fwhite/.test(file)) {
          img.src = "https://portersturkeys.github.io/Pictures/" + data.female;
        } else if (/^pwhite/.test(file)) {
          img.src = "https://portersturkeys.github.io/Pictures/" + data.poult;
        }
      });
  }


// Offspring/summary observer
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

      obs.observe(target, { childList: true, subtree: true });
    });
  }

  // Wrap variety functions so they record White state + apply overlay
  function wrapVarietyFn(fnName, prefix) {
    const original = window[fnName];
    if (typeof original !== "function") return;

    window[fnName] = function () {
      const res = original.apply(this, arguments);

      const key = detectWhiteFromVariety(prefix);
      if (key) {
        // Let core finish DOM changes, then overlay White variant
        setTimeout(() => applyWhiteToParent(prefix), 0);
      } else {
        const container = document.getElementById(prefix + "ImageContainer");
        if (container) delete container.dataset.whiteKey;
        whiteState[prefix] = null;
      }

      return res;
    };
  }

  // Watch parents for DOM changes and re-apply White overlay
  function installObservers() {
    const parentFlags = { sire: false, dam: false };

    ["sire", "dam"].forEach(prefix => {
      const container = document.getElementById(prefix + "ImageContainer");
      if (!container) return;

      const obs = new MutationObserver(() => {
        if (parentFlags[prefix]) return;
        parentFlags[prefix] = true;
        setTimeout(() => {
          applyWhiteToParent(prefix);
          parentFlags[prefix] = false;
        }, 0);
      });

      obs.observe(container, { childList: true, subtree: true });
    });
  }

  // Hooks everything after core is loaded
window.addEventListener("load", () => {
  // Variety handlers 
  wrapVarietyFn("applyVarietyToSire", "sire");
  wrapVarietyFn("applyVarietyToDam",  "dam");

  // Make Reset clear White overlay state
  if (typeof window.resetCalculator === "function") {
    const originalReset = window.resetCalculator;

    window.resetCalculator = function(initial) {
      const result = originalReset.apply(this, arguments);

      // Clear White state
      whiteState.sire = null;
      whiteState.dam  = null;

      // Remove White flags from parent image containers
      ["sire", "dam"].forEach(prefix => {
        const container = document.getElementById(prefix + "ImageContainer");
        if (container && container.dataset.whiteKey) {
          delete container.dataset.whiteKey;
        }
      });

      return result;
    };
  }

  // DOM observers: keep White overlay alive through Calculate / redraws
  installObservers();

  // Offspring/summary overlay (same-strain White-White only)
  installWhiteOffspringObserver();

  // IMPORTANT: When an offspring is used as sire/dam,
  // drop the White overlay for that parent so the new
  // offspring's image + name show correctly.
  if (typeof window.transferOffspringToParent === "function" && !window._whiteTransferPatched) {
    window._whiteTransferPatched = true;

    const originalTransfer = window.transferOffspringToParent;

    window.transferOffspringToParent = function(genotype, parent) {
      // Before core logic runs, drop any White overlay for this parent
      if (parent === "sire" || parent === "dam") {
        whiteState[parent] = null;
        const container = document.getElementById(parent + "ImageContainer");
        if (container && container.dataset.whiteKey) {
          delete container.dataset.whiteKey;
        }
      }

      // Let the core function update genotype, image, name, etc.
      return originalTransfer.apply(this, arguments);
    };
  }

  // ===========================================
  // FAVORITES - PARENT: keep named White overlay
  // when loading a saved favorite
  // ===========================================
  if (typeof window.handleDropdownChange === "function" && !window._whiteFavoritesPatched) {
    window._whiteFavoritesPatched = true;

    const originalHandleDropdownChange = window.handleDropdownChange;

    window.handleDropdownChange = function (type, dropdownId, alleleIds) {
      // 1) Let favorites logic run normally (sets alleles + genotype + base image/name)
      const result = originalHandleDropdownChange.apply(this, arguments);

      // 2) Then try to re-apply a named White overlay based on the favorite's name
      if (type === "sire" || type === "dam") {
        const dropdown = document.getElementById(dropdownId);
        const selectedName = dropdown && dropdown.value;
        if (selectedName) {
          // Strip duplicate suffix like "Midget White (1)"
          const lowerName = selectedName.trim().toLowerCase();
          const baseName  = lowerName.replace(/\s*\(\d+\)\s*$/, "");

          let variantKey = null;

          // Find which WHITE_VARIANTS entry matches this favorite name
          for (const [key, data] of Object.entries(WHITE_VARIANTS)) {
            if (data.name.toLowerCase() === baseName) {
              variantKey = key;
              break;
            }
          }

          const container = document.getElementById(type + "ImageContainer");

          if (variantKey) {
            // Mark this parent as that White variant and re-apply overlay
            whiteState[type] = variantKey;
            if (container) {
              container.dataset.whiteKey = variantKey;
            }
            setTimeout(() => applyWhiteToParent(type), 0);
          } else {
            // Not a named White favorite- clear any previous White overlay
            whiteState[type] = null;
            if (container && container.dataset.whiteKey) {
              delete container.dataset.whiteKey;
            }
          }
        }
      }

      return result;
    };
  }

}); 

})(); 


////////////////////////////


// ===========================================
// BROAD BREASTED VARIANTS OVERLAY (parents + offspring)
// ===========================================
(function () {
  'use strict';

  const BROAD_VARIANTS = {
    bronze: {
      name: "Broad Breasted Bronze",
      male: "MBroadBreastedBronze.jpg",
      female: "FBroadBreastedBronze.jpg",
      poult: "PBroadBreastedBronze.jpg"
    },
    white: {
      name: "Broad Breasted White",
      male: "MBroadBreastedWhite.jpg",
      female: "FBroadBreastedWhite.jpg",
      poult: "PBroadBreastedWhite.jpg"
    }
    // add more if needed, e.g. black, bourbon, etc.
  };

  const BROAD_VARIETY_MAP = {
    "broad breasted bronze": "bronze",
    "broad breasted white": "white",
    "broad bronze": "bronze",
    "broad white": "white",
    "bb bronze": "bronze",
    "bb white": "white",
    "broad breasted": "bronze",  // fallback
    "broad-breasted bronze": "bronze",
    "broad-breasted white": "white"
    // add any other common typos/variations users type
  };

  const broadState = {
    sire: null,   // "bronze" | "white" | null
    dam: null
  };

  function norm(str) {
    return (str || "").trim().toLowerCase();
  }

  function detectBroadFromVariety(prefix) {
    const input = document.getElementById(prefix + "VarietyInput");
    const val = norm(input && input.value);
    const key = BROAD_VARIETY_MAP[val] || null;
    broadState[prefix] = key;

    const container = document.getElementById(prefix + "ImageContainer");
    if (container) {
      if (key) {
        container.dataset.broadKey = key;
      } else {
        delete container.dataset.broadKey;
      }
    }
    return key;
  }

  function applyBroadToParent(prefix) {
    const container = document.getElementById(prefix + "ImageContainer");
    if (!container) return;

    const key = container.dataset.broadKey || broadState[prefix];
    if (!key) return;

    const data = BROAD_VARIANTS[key];
    if (!data) return;

    // Optional: force bronze locus (like Wild forces bb)
    // const bronzeId = prefix === "sire" ? "sireAlleleb" : "damAlleleb";
    // const sel = document.getElementById(bronzeId);
    // if (sel && sel.value !== "BB") { sel.value = "BB"; /* trigger update */ }

    // Swap image
    const img = container.querySelector("img");
    if (img) {
      img.src = "https://portersturkeys.github.io/Pictures/" + (prefix === "dam" ? data.female : data.male);
    }

    // Update phenotype name
    const strong = container.querySelector("strong");
    if (strong) {
      const span = strong.querySelector("span");
      if (span) span.textContent = data.name;
    }

    // Clean up any leftover "To Be Defined" or plain names
    const info = document.getElementById(prefix + "InfoContainer");
    if (info) {
      info.querySelectorAll("span, div, strong").forEach(el => {
        if (/to be defined|bronze|white/i.test(el.textContent)) {
          el.textContent = data.name;
        }
      });
    }
  }

  // ===========================================
  // Broad offspring patching (when both parents broad)
  // ===========================================
  function applyBroadToOffspring() {
    const sireKey = broadState.sire;
    const damKey = broadState.dam;
    if (!sireKey || !damKey) return;

    // For BB × BB: use sire's type (or add merge logic later)
    const variantKey = sireKey;  // or "bronze" if mixed
    const data = BROAD_VARIANTS[variantKey];
    if (!data) return;

    const displayName = data.name;

    // Patch text in offspring lists
    document.querySelectorAll("#maleOffspringResults li, #femaleOffspringResults li").forEach(li => {
      let html = li.innerHTML;
      if (html.includes(displayName)) return;
      html = html.replace(/\bBronze\b/gi, displayName);
      html = html.replace(/\bWhite\b/gi, displayName);
      html = html.replace(/To Be Defined/gi, displayName);
      li.innerHTML = html;
    });

    // Patch summary chart text
    const summaryBody = document.querySelector("#summaryChart tbody");
    if (summaryBody) {
      summaryBody.querySelectorAll("tr").forEach(tr => {
        const cell = tr.cells?.[1];
        if (cell) {
          let txt = cell.textContent || "";
          if (txt.includes(displayName)) return;
          txt = txt.replace(/\bBronze\b/gi, displayName);
          txt = txt.replace(/\bWhite\b/gi, displayName);
          txt = txt.replace(/to be defined/gi, displayName);
          cell.textContent = txt;
        }
      });
    }

    // Patch internal offspring arrays (for future transfers)
    function patchArray(arr) {
      if (!Array.isArray(arr)) return;
      arr.forEach(o => {
        if (o?.phenotype) {
          o.phenotype = o.phenotype
            .replace(/\bBronze\b/gi, displayName)
            .replace(/\bWhite\b/gi, displayName)
            .replace(/to be defined/gi, displayName);
        }
        if (o?.picturePath) {
          const file = o.picturePath.split("/").pop()?.toLowerCase() || "";
          if (file === "mbronze.jpg") o.picturePath = "https://portersturkeys.github.io/Pictures/" + data.male;
          if (file === "fbronze.jpg") o.picturePath = "https://portersturkeys.github.io/Pictures/" + data.female;
          if (file === "pbronze.jpg") o.poultImagePath = "https://portersturkeys.github.io/Pictures/" + data.poult;
        }
      });
    }
    if (window.maleOffspring) patchArray(window.maleOffspring);
    if (window.femaleOffspring) patchArray(window.femaleOffspring);

    // Patch visible images
    document.querySelectorAll("#maleOffspringResults img, #femaleOffspringResults img").forEach(img => {
      const src = img.src || "";
      const file = src.split("/").pop()?.toLowerCase() || "";
      if (file === "mbronze.jpg") img.src = "https://portersturkeys.github.io/Pictures/" + data.male;
      if (file === "fbronze.jpg") img.src = "https://portersturkeys.github.io/Pictures/" + data.female;
      if (file === "pbronze.jpg") img.src = "https://portersturkeys.github.io/Pictures/" + data.poult;
    });
  }

  function installBroadOffspringObserver() {
    let patching = false;
    const targets = [
      document.getElementById("maleOffspringResults"),
      document.getElementById("femaleOffspringResults"),
      document.getElementById("summaryChart")
    ].filter(Boolean);

    targets.forEach(target => {
      const obs = new MutationObserver(() => {
        if (patching) return;
        patching = true;
        setTimeout(() => {
          applyBroadToOffspring();
          patching = false;
        }, 0);
      });
      obs.observe(target, { childList: true, subtree: true });
    });
  }

  // Wrap variety functions (same as Wild)
  function wrapVarietyFn(fnName, prefix) {
    const original = window[fnName];
    if (typeof original !== "function") return;
    window[fnName] = function () {
      const res = original.apply(this, arguments);
      const key = detectBroadFromVariety(prefix);
      if (key) {
        setTimeout(() => applyBroadToParent(prefix), 0);
      } else {
        const container = document.getElementById(prefix + "ImageContainer");
        if (container) delete container.dataset.broadKey;
        broadState[prefix] = null;
      }
      return res;
    };
  }

  // Parent observers (re-apply on DOM changes)
  function installObservers() {
    ["sire", "dam"].forEach(prefix => {
      const container = document.getElementById(prefix + "ImageContainer");
      if (!container) return;
      const obs = new MutationObserver(() => {
        setTimeout(() => applyBroadToParent(prefix), 0);
      });
      obs.observe(container, { childList: true, subtree: true });
    });
  }

  window.addEventListener("load", () => {
    wrapVarietyFn("applyVarietyToSire", "sire");
    wrapVarietyFn("applyVarietyToDam", "dam");

    // Reset patch
    if (typeof window.resetCalculator === "function") {
      const originalReset = window.resetCalculator;
      window.resetCalculator = function (initial) {
        const result = originalReset.apply(this, arguments);
        broadState.sire = null;
        broadState.dam = null;
        ["sire", "dam"].forEach(prefix => {
          const container = document.getElementById(prefix + "ImageContainer");
          if (container) delete container.dataset.broadKey;
        });
        return result;
      };
    }

    installObservers();
    installBroadOffspringObserver();

    // Transfer patch — keep broad if both parents were broad (mirrors Wild logic)
    if (typeof window.transferOffspringToParent === "function" && !window._broadTransferPatched) {
      window._broadTransferPatched = true;
      const originalTransfer = window.transferOffspringToParent;
      window.transferOffspringToParent = function (genotype, parent) {
        const result = originalTransfer.apply(this, arguments);
        if (parent === "sire" || parent === "dam") {
          const sireKey = broadState.sire;
          const damKey = broadState.dam;
          if (sireKey && damKey) {
            // Both were broad → offspring was broad → new parent stays broad
            const variantKey = sireKey;  // or damKey, or logic to prefer one
            broadState[parent] = variantKey;
            const container = document.getElementById(parent + "ImageContainer");
            if (container) container.dataset.broadKey = variantKey;
            setTimeout(() => applyBroadToParent(parent), 0);
          } else {
            broadState[parent] = null;
            const container = document.getElementById(parent + "ImageContainer");
            if (container) delete container.dataset.broadKey;
          }
        }
        return result;
      };
    }
  });
})();


////////////////////////////////////////




    
    // Hook variety + reset
    window.addEventListener("load", () => {
        function wrapVarietyFn(fnName, prefix) {
            const orig = window[fnName];
            if (typeof orig !== "function") return;
            window[fnName] = function() {
                const res = orig.apply(this, arguments);
                detectBronzeFromVariety(prefix);
                setTimeout(() => applyBronzeToParent(prefix), 0);
                return res;
            };
        }
        wrapVarietyFn("applyVarietyToSire", "sire");
        wrapVarietyFn("applyVarietyToDam", "dam");

        if (typeof window.resetCalculator === "function") {
            const origReset = window.resetCalculator;
            window.resetCalculator = function(initial) {
                const res = origReset.apply(this, arguments);
                bronzeState.sire = bronzeState.dam = null;
                ["sire", "dam"].forEach(p => {
                    const container = document.getElementById(p + "ImageContainer");
                    if (container?.dataset.bronzeKey) delete container.dataset.bronzeKey;
                });
                return res;
            };
        }

        installObservers();
    });

})();

//////////////////////////



// Additional transfer-specific observer for parent containers
function installTransferObservers() {
  if (window._bbTransferObserversInstalled) return;
  window._bbTransferObserversInstalled = true;
  
  ["sire", "dam"].forEach(prefix => {
    const container = document.getElementById(prefix + "ImageContainer");
    if (!container) return;
    
    // Watch for image src changes specifically (catches overwrites)
    const imgObserver = new MutationObserver((mutations) => {
      let needsFix = false;
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
          const img = mutation.target;
          if (img.tagName === 'IMG' && 
              img.src.indexOf("bronze.jpg") !== -1 && 
              img.src.indexOf("BroadBreastedBronze") === -1 &&
              (bronzeState[prefix] === "broad" || container.dataset.bronzeKey === "broad")) {
            needsFix = true;
          }
        }
      });
      
      if (needsFix) {
        console.log(`[BB FIX] Observer caught image overwrite for ${prefix}, correcting...`);
        const genotype = document.getElementById(prefix + "InfoContainer")?.dataset.shortGenotype || "";
        forceBroadParent(prefix, genotype, true);
      }
    });
    
    const img = container.querySelector("img");
    if (img) {
      imgObserver.observe(img, { attributes: true, attributeFilter: ['src'] });
    }
    
    // Also watch for text content changes in the name
    const nameObserver = new MutationObserver((mutations) => {
      let nameNeedsFix = false;
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'characterData') {
          const strong = container.querySelector("strong");
          if (strong && 
              !/broad\s*breasted\s*bronze/i.test(strong.textContent || "") &&
              (bronzeState[prefix] === "broad" || container.dataset.bronzeKey === "broad")) {
            nameNeedsFix = true;
          }
        }
      });
      
      if (nameNeedsFix) {
        console.log(`[BB FIX] Observer caught name overwrite for ${prefix}, correcting...`);
        applyBronzeToParent(prefix);
      }
    });
    
    nameObserver.observe(container, { 
      childList: true, 
      subtree: true, 
      characterData: true,
      attributes: true,
      attributeFilter: ['textContent']
    });
  });
}

// Call this after installObservers()
installTransferObservers();



////////////////////////////////////

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

