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
   
   

  
  
"https://portersturkeys.github.io/adv-cal/geno-pheno-mapping1.js",
"https://portersturkeys.github.io/adv-cal/geno-pheno-mapping1A.js",
"https://portersturkeys.github.io/adv-cal/geno-pheno-mapping1B.js",
"https://portersturkeys.github.io/adv-cal/geno-pheno-mapping1C.js",
"https://portersturkeys.github.io/adv-cal/geno-pheno-mapping1D.js",
"https://portersturkeys.github.io/adv-cal/geno-pheno-mapping1E.js",
"https://portersturkeys.github.io/adv-cal/geno-pheno-mapping2.js",
"https://portersturkeys.github.io/adv-cal/geno-pheno-mapping2A.js",
"https://portersturkeys.github.io/adv-cal/geno-pheno-mapping3.js",
"https://portersturkeys.github.io/adv-cal/geno-pheno-mapping3A.js",
"https://portersturkeys.github.io/adv-cal/geno-pheno-mapping4.js",
"https://portersturkeys.github.io/adv-cal/geno-pheno-mapping5.js",
"https://portersturkeys.github.io/adv-cal/geno-pheno-mapping6.js",
"https://portersturkeys.github.io/adv-cal/geno-pheno-mapping7.js",
"https://portersturkeys.github.io/adv-cal/geno-pheno-mapping8.js",
"https://portersturkeys.github.io/adv-cal/geno-pheno-mapping9.js",
"https://portersturkeys.github.io/adv-cal/geno-pheno-mapping10.js",
"https://portersturkeys.github.io/adv-cal/geno-pheno-mapping11.js",
"https://portersturkeys.github.io/adv-cal/geno-pheno-mapping12.js",
"https://portersturkeys.github.io/adv-cal/geno-pheno-mapping13.js",
"https://portersturkeys.github.io/adv-cal/geno-pheno-mapping14.js",
"https://portersturkeys.github.io/adv-cal/geno-pheno-mapping15.js"

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
