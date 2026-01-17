function getFavorites(key) {
    return JSON.parse(localStorage.getItem(key)) || {};
}

function formatShortGenotype(entry) {
    if (!entry || !entry.genotype) return "";

    // Explicit list of genotypes that should NOT be displayed
    const IGNORE = new Set([
        "CC",
        "dd",
        "EE",
        "E-",
        "NN",
        "N-",
        "PnPn",
        "RR",
        "SlSl",
        "SpSp"
    ]);

    const result = [];

    Object.values(entry.genotype).forEach(val => {
        if (!val) return;

        const v = val.trim();

        // Ignore ONLY known wild-type / default values
        if (IGNORE.has(v)) return;

        // Everything else is meaningful
        result.push(v);
    });

    // Only show label if something remains
    return result.length ? `Genotype: ${result.join(" ")}` : "";
}



function renderFavorites(type, containerId) {
    const favorites = getFavorites(type + "Favorites");
    const container = document.getElementById(containerId);

    container.innerHTML = "";

    const names = Object.keys(favorites).sort((a, b) => a.localeCompare(b));

    if (!names.length) {
        container.innerHTML = "<em>No saved entries</em>";
        return;
    }

    names.forEach(name => {
        const entry = favorites[name];

        const div = document.createElement("div");
        div.className = "entry";

        div.innerHTML = `
    <div class="entry-name">${name}</div>
    ${entry.image ? `<img src="${entry.image}" class="fav-image">` : ""}
    <div class="entry-geno">${formatShortGenotype(entry)}</div>
    <button class="use-btn" onclick="useSavedFavorite('${type}', '${name}')">
        Use as ${type.charAt(0).toUpperCase() + type.slice(1)}
    </button>
`;


        container.appendChild(div);
    });
}


renderFavorites("sire", "sireList");
renderFavorites("dam", "damList");





function useSavedFavorite(type, name) {
    const favorites = getFavorites(type + "Favorites");
    const entry = favorites[name];
    if (!entry) return;

    // Store selected bird
    sessionStorage.setItem("selectedFavorite", JSON.stringify({
        type: type,
        genotype: entry.genotype
    }));

    // Get exact return URL
    const returnURL = sessionStorage.getItem("favoritesReturnURL");

    if (!returnURL) {
        alert("Return location not found. Please go back to the calculator manually.");
        return;
    }

    window.location.href = returnURL;
}
