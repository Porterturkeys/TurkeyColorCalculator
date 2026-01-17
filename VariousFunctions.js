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
  "https://cdn.jsdelivr.net/gh/Porterturkeys/TurkeyColorCalculator@main/phenotypeMapping2.js"
]; 

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.async = false; // IMPORTANT: preserves execution order
    s.onload = () => { console.log("Loaded:", src); resolve(); };
    s.onerror = () => { console.error("Failed:", src); reject(new Error(src)); };
    document.head.appendChild(s);
  });
}

(async function loadAllInOrder() {
  for (const src of scripts) {
    await loadScript(src);
  }
  console.log("✅ All scripts loaded in order");
})();


