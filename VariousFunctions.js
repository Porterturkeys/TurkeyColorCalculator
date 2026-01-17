const scripts = [
"https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/refs/heads/main/SplitFunction.js",
"https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/refs/heads/main/AlleleCombos-Ratios.js",
"https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/refs/heads/main/CalculateOffspring.js",
"https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/refs/heads/main/DisplayResults.js",
"https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/refs/heads/main/TransfertoParent.js",
"https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/refs/heads/main/SaveSirenDamFav.js",
"https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/refs/heads/main/Sounds.js",
"https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/refs/heads/main/SocialShare.js",
"https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/refs/heads/main/LatestFunctions.js",
https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/refs/heads/main/phenotypeMapping1.js,
https://raw.githubusercontent.com/Porterturkeys/TurkeyColorCalculator/refs/heads/main/phenotypeMapping2.js,

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

