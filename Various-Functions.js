const BASE = "https://porterturkeys.github.io/TurkeyColorCalculator/";

const scripts = [
  BASE + "AlleleCombos-Ratios.js",
  BASE + "CalculateOffspring.js",
  BASE + "DisplayResults.js",
  BASE + "LatestFunctions.js",
  BASE + "SaveSirenDamFav.js",
  BASE + "SocialShare.js",
  BASE + "Sounds.js",
  BASE + "SplitFunction.js",
  BASE + "TransfertoParent.js",

  BASE + "phenotypeMapping1.js",
  BASE + "phenotypeMapping1A.js",
  BASE + "phenotypeMapping1B.js",
  BASE + "phenotypeMapping1C.js",
  BASE + "phenotypeMapping1D.js",
  BASE + "phenotypeMapping1E.js",
  BASE + "phenotypeMapping2.js",
  BASE + "phenotypeMapping2A.js",
  BASE + "phenotypeMapping3.js",
  BASE + "phenotypeMapping3A.js",
  BASE + "phenotypeMapping4.js",
  BASE + "phenotypeMapping5.js",
  BASE + "phenotypeMapping6.js",
  BASE + "phenotypeMapping7.js",
  BASE + "phenotypeMapping8.js",
  BASE + "phenotypeMapping9.js",
  BASE + "phenotypeMapping10.js",
  BASE + "phenotypeMapping11.js",
  BASE + "phenotypeMapping12.js",
  BASE + "phenotypeMapping13.js",
  BASE + "phenotypeMapping14.js",
  BASE + "phenotypeMapping15.js"
];
;


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



