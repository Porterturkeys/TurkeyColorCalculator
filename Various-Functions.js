// Loads all core scripts IN ORDER (sync order) from jsDelivr (executes properly)
const scripts = [
  "https://cdn.jsdelivr.net/gh/Porterturkeys/TurkeyColorCalculator@main/SplitFunction.js",
  "https://cdn.jsdelivr.net/gh/Porterturkeys/TurkeyColorCalculator@main/AlleleCombos-Ratios.js",
  "https://cdn.jsdelivr.net/gh/Porterturkeys/TurkeyColorCalculator@main/CalculateOffspring.js",
  "https://cdn.jsdelivr.net/gh/Porterturkeys/TurkeyColorCalculator@main/DisplayResults.js",
  "https://cdn.jsdelivr.net/gh/Porterturkeys/TurkeyColorCalculator@main/TransfertoParent.js",
  "https://cdn.jsdelivr.net/gh/Porterturkeys/TurkeyColorCalculator@main/SaveSirenDamFav.js",
  "https://cdn.jsdelivr.net/gh/Porterturkeys/TurkeyColorCalculator@main/Sounds.js",
  "https://cdn.jsdelivr.net/gh/Porterturkeys/TurkeyColorCalculator@main/SocialShare.js",
  "https://cdn.jsdelivr.net/gh/Porterturkeys/TurkeyColorCalculator@main/LatestFunctions.js",
  "https://cdn.jsdelivr.net/gh/Porterturkeys/TurkeyColorCalculator@main/phenotypeMapping1.js",
  "https://cdn.jsdelivr.net/gh/Porterturkeys/TurkeyColorCalculator@main/phenotypeMapping1A.js",
  "https://cdn.jsdelivr.net/gh/Porterturkeys/TurkeyColorCalculator@main/phenotypeMapping1B.js",
  "https://cdn.jsdelivr.net/gh/Porterturkeys/TurkeyColorCalculator@main/phenotypeMapping1C.js",
  "https://cdn.jsdelivr.net/gh/Porterturkeys/TurkeyColorCalculator@main/phenotypeMapping1D.js",
  "https://cdn.jsdelivr.net/gh/Porterturkeys/TurkeyColorCalculator@main/phenotypeMapping1E.js",
  "https://cdn.jsdelivr.net/gh/Porterturkeys/TurkeyColorCalculator@main/phenotypeMapping2.js",
  "https://cdn.jsdelivr.net/gh/Porterturkeys/TurkeyColorCalculator@main/phenotypeMapping2A.js",
  "https://cdn.jsdelivr.net/gh/Porterturkeys/TurkeyColorCalculator@main/phenotypeMapping3.js",
  "https://cdn.jsdelivr.net/gh/Porterturkeys/TurkeyColorCalculator@main/phenotypeMapping3A.js",
  "https://cdn.jsdelivr.net/gh/Porterturkeys/TurkeyColorCalculator@main/phenotypeMapping4.js",
  "https://cdn.jsdelivr.net/gh/Porterturkeys/TurkeyColorCalculator@main/phenotypeMapping5.js",
  "https://cdn.jsdelivr.net/gh/Porterturkeys/TurkeyColorCalculator@main/phenotypeMapping6.js",
  "https://cdn.jsdelivr.net/gh/Porterturkeys/TurkeyColorCalculator@main/phenotypeMapping7.js",
  "https://cdn.jsdelivr.net/gh/Porterturkeys/TurkeyColorCalculator@main/phenotypeMapping8.js",
  "https://cdn.jsdelivr.net/gh/Porterturkeys/TurkeyColorCalculator@main/phenotypeMapping9.js",
  "https://cdn.jsdelivr.net/gh/Porterturkeys/TurkeyColorCalculator@main/phenotypeMapping10.js",
  "https://cdn.jsdelivr.net/gh/Porterturkeys/TurkeyColorCalculator@main/phenotypeMapping11.js",
  "https://cdn.jsdelivr.net/gh/Porterturkeys/TurkeyColorCalculator@main/phenotypeMapping12.js",
  "https://cdn.jsdelivr.net/gh/Porterturkeys/TurkeyColorCalculator@main/phenotypeMapping13.js",
  "https://cdn.jsdelivr.net/gh/Porterturkeys/TurkeyColorCalculator@main/phenotypeMapping14.js",
  "https://cdn.jsdelivr.net/gh/Porterturkeys/TurkeyColorCalculator@main/phenotypeMapping15.js"
  
];

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.async = false; // preserve order
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed: " + src));
    document.head.appendChild(s);
  });
}

(async function loadAllInOrder() {
  try {
    for (const src of scripts) await loadScript(src);
    console.log("✅ Calculator core loaded");
  } catch (e) {
    console.error("❌ Core load failed:", e);
  }
})();
