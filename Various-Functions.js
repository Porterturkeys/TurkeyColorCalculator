const scripts = [
  "https://porterturkeys.github.io/TurkeyColorCalculator/AlleleCombos-Ratios.js",
  "https://porterturkeys.github.io/TurkeyColorCalculator/CalculateOffspring.js",
  "https://porterturkeys.github.io/TurkeyColorCalculator/DisplayResults.js",
  "https://porterturkeys.github.io/TurkeyColorCalculator/LatestFunctions.js",
  "https://porterturkeys.github.io/TurkeyColorCalculator/SaveSirenDamFav.js",
  "https://porterturkeys.github.io/TurkeyColorCalculator/SocialShare.js",
  "https://porterturkeys.github.io/TurkeyColorCalculator/Sounds.js",
  "https://porterturkeys.github.io/TurkeyColorCalculator/SplitFunction.js",
  "https://porterturkeys.github.io/TurkeyColorCalculator/TransfertoParent.js",

  "https://porterturkeys.github.io/TurkeyColorCalculator/phenotypeMapping1.js",
  "https://porterturkeys.github.io/TurkeyColorCalculator/phenotypeMapping1A.js",
  "https://porterturkeys.github.io/TurkeyColorCalculator/phenotypeMapping1B.js",
  "https://porterturkeys.github.io/TurkeyColorCalculator/phenotypeMapping1C.js",
  "https://porterturkeys.github.io/TurkeyColorCalculator/phenotypeMapping1D.js",
  "https://porterturkeys.github.io/TurkeyColorCalculator/phenotypeMapping1E.js",
  "https://porterturkeys.github.io/TurkeyColorCalculator/phenotypeMapping2.js",
  "https://porterturkeys.github.io/TurkeyColorCalculator/phenotypeMapping2A.js",
  "https://porterturkeys.github.io/TurkeyColorCalculator/phenotypeMapping3.js",
  "https://porterturkeys.github.io/TurkeyColorCalculator/phenotypeMapping3A.js",
  "https://porterturkeys.github.io/TurkeyColorCalculator/phenotypeMapping4.js",
  "https://porterturkeys.github.io/TurkeyColorCalculator/phenotypeMapping5.js",
  "https://porterturkeys.github.io/TurkeyColorCalculator/phenotypeMapping6.js",
  "https://porterturkeys.github.io/TurkeyColorCalculator/phenotypeMapping7.js",
  "https://porterturkeys.github.io/TurkeyColorCalculator/phenotypeMapping8.js",
  "https://porterturkeys.github.io/TurkeyColorCalculator/phenotypeMapping9.js",
  "https://porterturkeys.github.io/TurkeyColorCalculator/phenotypeMapping10.js",
  "https://porterturkeys.github.io/TurkeyColorCalculator/phenotypeMapping11.js",
  "https://porterturkeys.github.io/TurkeyColorCalculator/phenotypeMapping12.js",
  "https://porterturkeys.github.io/TurkeyColorCalculator/phenotypeMapping13.js",
  "https://porterturkeys.github.io/TurkeyColorCalculator/phenotypeMapping14.js",
  "https://porterturkeys.github.io/TurkeyColorCalculator/phenotypeMapping15.js"
];



scripts.forEach(src => {
  const script = document.createElement('script');
  script.src = src;
  script.onload = () => {
    console.log(`Loaded: ${src}`);
  };
  script.onerror = () => {
    console.error(`Failed to load: ${src}`);
  };
  document.head.appendChild(script);
});



