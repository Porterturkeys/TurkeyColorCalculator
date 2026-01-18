const scripts = [
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/main/SplitFunction.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/main/AlleleCombos-Ratios.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/main/CalculateOffspring.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/main/DisplayResults.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/main/TransfertoParent.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/main/SaveSirenDamFav.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/main/Sounds.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/main/SocialShare.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/main/LatestFunctions.js",

  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/main/phenotypeMapping1.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/main/phenotypeMapping1A.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/main/phenotypeMapping1B.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/main/phenotypeMapping1C.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/main/phenotypeMapping1D.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/main/phenotypeMapping1E.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/main/phenotypeMapping2.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/main/phenotypeMapping2A.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/main/phenotypeMapping3.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/main/phenotypeMapping3A.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/main/phenotypeMapping4.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/main/phenotypeMapping5.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/main/phenotypeMapping6.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/main/phenotypeMapping7.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/main/phenotypeMapping8.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/main/phenotypeMapping9.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/main/phenotypeMapping10.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/main/phenotypeMapping11.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/main/phenotypeMapping12.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/main/phenotypeMapping13.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/main/phenotypeMapping14.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/main/phenotypeMapping15.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/main/phenotypeMapping16.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/main/phenotypeMapping17.js",
  "https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/main/phenotypeMapping18.js"


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
