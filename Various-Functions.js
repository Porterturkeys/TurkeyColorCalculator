<script>
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

function loadOne(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.async = false; // IMPORTANT: preserve order
    s.onload = () => { console.log("Loaded:", src); resolve(); };
    s.onerror = () => { console.error("Failed to load:", src); reject(new Error(src)); };
    document.head.appendChild(s);
  });
}

(async function loadAllInOrder() {
  try {
    for (const src of scripts) {
      await loadOne(src);
    }
    console.log("ALL SCRIPTS LOADED IN ORDER");

    // capture core if it exists now
    if (typeof window.calculateOffspring === "function") {
      window._realCalculateOffspring = window.calculateOffspring;
      console.log("Core calculateOffspring captured");
    } else {
      console.error("Core calculateOffspring still missing AFTER load");
    }

  } catch (e) {
    console.error("STOPPED LOADING due to failure:", e);
  }
})();
</script>
