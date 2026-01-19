const scripts = [
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/refs/heads/main/AlleleCombos-Ratios.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/refs/heads/main/CalculateOffspring.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/refs/heads/main/DisplayResults.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/refs/heads/main/LatestFunctions.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/refs/heads/main/SaveSirenDamFav.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/refs/heads/main/SocialShare.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/refs/heads/main/Sounds.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/refs/heads/main/SplitFunction.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/refs/heads/main/TransfertoParent.js",

  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/refs/heads/main/phenotypeMapping1.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/refs/heads/main/phenotypeMapping1A.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/refs/heads/main/phenotypeMapping1B.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/refs/heads/main/phenotypeMapping1C.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/refs/heads/main/phenotypeMapping1D.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/refs/heads/main/phenotypeMapping1E.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/refs/heads/main/phenotypeMapping2.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/refs/heads/main/phenotypeMapping2A.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/refs/heads/main/phenotypeMapping3.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/refs/heads/main/phenotypeMapping3A.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/refs/heads/main/phenotypeMapping4.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/refs/heads/main/phenotypeMapping5.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/refs/heads/main/phenotypeMapping6.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/refs/heads/main/phenotypeMapping7.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/refs/heads/main/phenotypeMapping8.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/refs/heads/main/phenotypeMapping9.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/refs/heads/main/phenotypeMapping10.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/refs/heads/main/phenotypeMapping11.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/refs/heads/main/phenotypeMapping12.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/refs/heads/main/phenotypeMapping13.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/refs/heads/main/phenotypeMapping14.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/refs/heads/main/phenotypeMapping15.js"
];

// Convert raw.githubusercontent.com refs/heads/main -> jsDelivr gh@main
function toCdn(url) {
  return url.replace(
    "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/refs/heads/main/",
    "https://cdn.jsdelivr.net/gh/Porterturkeys/TurkeyColorCalculator@main/"
  );
}

function loadOne(url) {
  return new Promise((resolve, reject) => {
    const src = toCdn(url);
    const s = document.createElement("script");
    s.src = src;
    s.async = false; // keep execution order
    s.onload = () => {
      console.log("Loaded:", src);
      resolve();
    };
    s.onerror = () => {
      console.error("Failed to load:", src);
      reject(new Error(src));
    };
    document.head.appendChild(s);
  });
}

(async function loadAllInOrderFromCDN() {
  try {
    for (const url of scripts) {
      await loadOne(url);
    }
    console.log("ALL SCRIPTS LOADED (jsDelivr, ordered)");

    // capture core if present
    if (typeof window.calculateOffspring === "function") {
      window._realCalculateOffspring = window.calculateOffspring;
      console.log("Core calculateOffspring captured");
    } else {
      console.error("calculateOffspring is still missing after load");
    }

    // quick visibility checks
    console.log("typeof resetCalculator =", typeof window.resetCalculator);
    console.log("typeof searchResults   =", typeof window.searchResults);

  } catch (e) {
    console.error("Stopped loading due to error:", e);
  }
})();



