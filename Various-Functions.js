const scripts = [
   
"https://portersturkeys.github.io/adv-cal/VariousFunctions-AlleleCombos-Ratios.js",
"https://portersturkeys.github.io/adv-cal/VariousFunctions-CalculateOffspring.js",
"https://portersturkeys.github.io/adv-cal/VariousFunctions-DisplayResults.js",  
"https://portersturkeys.github.io/adv-cal/VariousFunctions-fdsplitfunct.js",
"https://portersturkeys.github.io/adv-cal/VariousFunctions-fdAllelecomboratio.js",
"https://portersturkeys.github.io/adv-cal/VariousFunctions-fdCalOff.js",
"https://portersturkeys.github.io/adv-cal/VariousFunctions-fdDisplayRes.js",
"https://portersturkeys.github.io/adv-cal/VariousFunctions-fdtranstparent.js",
"https://portersturkeys.github.io/adv-cal/VariousFunctions-fdsavesirendam.js",
"https://portersturkeys.github.io/adv-cal/VariousFunctions-DNALoader.js",
"https://portersturkeys.github.io/adv-cal/VariousFunctions-Sounds.js",
"https://portersturkeys.github.io/adv-cal/VariousFunctions-SocialShare.js",
"https://portersturkeys.github.io/adv-cal/VariousFunctions-LatestFunctions.js",  

  
  
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
