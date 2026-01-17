// ==============================
// Favorites Helpers
// ==============================
function getFavorites(key) {
    return JSON.parse(localStorage.getItem(key)) || {};
}

function setFavorites(key, favorites) {
    localStorage.setItem(key, JSON.stringify(favorites));
}

// ==============================
// Save Genotype (Sire or Dam)
// ==============================
function saveGenotype(type, alleleIds) {
    const imageContainer = document.getElementById(
        type === 'sire' ? 'sireImageContainer' : 'damImageContainer'
    );
    const img = imageContainer ? imageContainer.querySelector('img') : null;

    if (!img || !img.src) {
        alert(`No ${type} variety is currently displayed. Please set alleles first.`);
        return;
    }

 // ==============================
// Determine variety name
// ==============================
let name = "";

// FIRST: check displayed blue text (phenotype OR genotype)
const parent = document.getElementById(type === 'sire' ? 'sireImageContainer' : 'damImageContainer');

if (parent) {
    // Get ALL blue spans in that info block
    const spans = parent.querySelectorAll('span[style*="color"]');

    if (spans.length) {
        const firstText  = spans[0].textContent.trim();                 // Phenotype/Variety
        const secondText = spans.length > 1 ? spans[1].textContent.trim() : "";  // Short Genotype

        // If phenotype says "To be defined" and genotype exists, save genotype
        if (/to be defined/i.test(firstText) && secondText) {
            name = `Genotype: ${secondText}`;
        } else {
            // Otherwise save phenotype name (normal defined case)
            name = firstText;
        }
    }
}


// IF NAME WAS FOUND ABOVE, DO NOT USE IMAGE AT ALL
if (!name) {
    if (img && img.src) {
        const src = img.src.toLowerCase();

        // Ignore placeholder images completely
        if (!src.includes("no image") && !src.includes("to be defined")) {
            name = img.src.split('/').pop().split('.')[0];

            name = name.replace(/^[MF]/i, '');
            name = name.replace(/_male|_female|_tom|_hen|_adult/gi, '');
            name = name.replace(/([a-z])([A-Z])/g, '$1 $2');
            name = name.replace(/_/g, ' ').replace(/-/g, ' ');
            name = name.trim();
            name = name.split(' ')
                .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
                .join(' ');
        }
    }
}

// FINAL CHECK
if (!name || name.length < 2) {
    alert(`Could not determine ${type} variety name to save.`);
    return;
}



    const favoritesKey = `${type}Favorites`;
    const favorites = getFavorites(favoritesKey);

    // Prevent overwrite
    let originalName = name;
    let counter = 1;
    while (favorites[name]) {
        name = `${originalName} (${counter++})`;
    }

    // Save genotype
    const genotype = {};
    alleleIds.forEach(id => {
        const el = document.getElementById(id);
        const key = id.replace(type + 'Allele', 'allele').toLowerCase();
        genotype[key] = el ? el.value : '';
    });

    favorites[name] = genotype;
    setFavorites(favoritesKey, favorites);

    updateFavoritesDropdown(type);
    alert(`"${name}" saved successfully!`);
}

// ==============================
// Load Selected Favorite
// ==============================
function handleDropdownChange(type, dropdownId, alleleIds) {
    const dropdown = document.getElementById(dropdownId);
    const name = dropdown.value;
    if (!name) return;

    const favorites = getFavorites(`${type}Favorites`);
    const genotype = favorites[name];
    if (!genotype) return;

    alleleIds.forEach(id => {
        const key = id.replace(type + 'Allele', 'allele').toLowerCase();
        const el = document.getElementById(id);
        if (el) el.value = genotype[key] || '';
    });

    if (type === 'sire') updateSireGenotype();
    if (type === 'dam') updateDamGenotype();
}

// ==============================
// Delete Selected Favorite
// ==============================
function deleteSelectedFavorite(type) {
    const dropdown = document.getElementById(`${type}FavoritesDropdown`);
    const name = dropdown.value;

    if (!name) {
        alert(`Please select a saved ${type} to remove.`);
        return;
    }

    if (!confirm(`Are you sure you want to remove this "${name}"?`)) return;

    const favoritesKey = `${type}Favorites`;
    const favorites = getFavorites(favoritesKey);

    delete favorites[name];
    setFavorites(favoritesKey, favorites);

    updateFavoritesDropdown(type);
    dropdown.value = '';
}

// ==============================
// Populate Favorites Dropdown
// ==============================
function updateFavoritesDropdown(type) {
    const favorites = getFavorites(`${type}Favorites`);
    const dropdown = document.getElementById(`${type}FavoritesDropdown`);
    if (!dropdown) return;

    dropdown.innerHTML =
        `<option value="">Select a Saved ${type.charAt(0).toUpperCase() + type.slice(1)}</option>`;

    Object.keys(favorites)
        .sort((a, b) => a.localeCompare(b))
        .forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            dropdown.appendChild(option);
        });
}

// ==============================
// Allele ID Lists
// ==============================
const sireAlleleIds = [
    'sireAlleleb', 'sireAlleleC', 'sireAlleled',
    'sireAlleleE', 'sireAlleleN', 'sireAllelePn',
    'sireAlleleR', 'sireAlleleSl', 'sireAlleleSp'
];

const damAlleleIds = [
    'damAlleleb', 'damAlleleC', 'damAlleled',
    'damAlleleE', 'damAlleleN', 'damAllelePn',
    'damAlleleR', 'damAlleleSl', 'damAlleleSp'
];

// ==============================
// Wrapper Functions
// ==============================
function saveSireGenotype() { saveGenotype('sire', sireAlleleIds); }
function saveDamGenotype() { saveGenotype('dam', damAlleleIds); }



// ==============================
// Init (Neocities-safe)
// ==============================
function runFavoritesInit() {
    updateFavoritesDropdown('sire');
    updateFavoritesDropdown('dam');

    var sireDropdown = document.getElementById('sireFavoritesDropdown');
    var damDropdown  = document.getElementById('damFavoritesDropdown');

    if (sireDropdown) {
        sireDropdown.addEventListener('change', function () {
            handleDropdownChange('sire', 'sireFavoritesDropdown', sireAlleleIds);
        });
    }

    if (damDropdown) {
        damDropdown.addEventListener('change', function () {
            handleDropdownChange('dam', 'damFavoritesDropdown', damAlleleIds);
        });
    }

    var delSire = document.getElementById('deleteSireFavorite');
    var delDam  = document.getElementById('deleteDamFavorite');

    if (delSire) {
        delSire.addEventListener('click', function () {
            deleteSelectedFavorite('sire');
        });
    }

    if (delDam) {
        delDam.addEventListener('click', function () {
            deleteSelectedFavorite('dam');
        });
    }
}

// Delay init slightly so DOM + dynamic scripts are ready
setTimeout(runFavoritesInit, 0);
