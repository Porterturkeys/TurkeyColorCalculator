const scripts = [
"VariousFunctions/DNALoader.js",
"VariousFunctions/SplitFunction.js",
"VariousFunctions/AlleleCombos-Ratios.js",
"VariousFunctions/CalculateOffspring.js",
"VariousFunctions/DisplayResults.js",
"VariousFunctions/TransfertoParent.js",
"VariousFunctions/SaveSirenDamFav.js",
"VariousFunctions/Sounds.js",
"VariousFunctions/SocialShare.js",
"VariousFunctions/LatestFunctions.js",
"VariousFunctions/PaytoPlay.js",
"Geno-Pheno-Mapping/Aub.BarBla.BarCh.js",
"Geno-Pheno-Mapping/BarSla.Bla.BWB.js",
"Geno-Pheno-Mapping/BWN.BluCal.BluNar.BP.BRB.js",
"Geno-Pheno-Mapping/BP.BRB.BluSG.js",
"Geno-Pheno-Mapping/BluCorP.BourBuf.BR.js",
"Geno-Pheno-Mapping/BN.Cal.ChesBuf.js",
"Geno-Pheno-Mapping/BarSla-BR.js",
"Geno-Pheno-Mapping/BN-ChRed.js",
"Geno-Pheno-Mapping/CH-Dil.JB.js",
"Geno-Pheno-Mapping/DilRustBla-FroOLavBlu.js",
"Geno-Pheno-Mapping/GN-LavP.js",
"Geno-Pheno-Mapping/LRBN-MCD.js",
"Geno-Pheno-Mapping/MDRBla-PT.js",
"Geno-Pheno-Mapping/Misc-pn.js",
"Geno-Pheno-Mapping/RBlu-RS.js",
"Geno-Pheno-Mapping/RdAub-RF.js",
"Geno-Pheno-Mapping/RdRS-RBla.js",
"Geno-Pheno-Mapping/RustBro-RustSla.js",
"Geno-Pheno-Mapping/SBF-TriPP.js",
"Geno-Pheno-Mapping/Misc.js",
"Geno-Pheno-Mapping/cmVar.js",
"Geno-Pheno-Mapping/cm-notCompleted.js"


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

