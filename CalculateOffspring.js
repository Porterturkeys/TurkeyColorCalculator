function calculateOffspring() {
    

    // Play success sound when offspring calculation is complete
    playSound('successSound');
}


// Add sound to the reset button
document.querySelector('button[onclick="resetCalculator()"]').addEventListener('click', () => {
    playSound('clickSound');
});
 
    
    
    
    
    
    let calculationCount = 0; // Counter to track the number of calculations
    function calculateOffspring() {
    const sireAlleleb = document.getElementById('sireAlleleb').value;
    const damAlleleb = document.getElementById('damAlleleb').value;
    const sireAlleleC = document.getElementById('sireAlleleC').value;
    const damAlleleC = document.getElementById('damAlleleC').value;
    const sireAlleled = document.getElementById('sireAlleled').value;
    const damAlleled = document.getElementById('damAlleled').value;
    const sireAlleleE = document.getElementById('sireAlleleE').value;
    const damAlleleE = document.getElementById('damAlleleE').value;
    const sireAlleleN = document.getElementById('sireAlleleN').value;
    const damAlleleN = document.getElementById('damAlleleN').value;
    const sireAllelePn = document.getElementById('sireAllelePn').value;
    const damAllelePn = document.getElementById('damAllelePn').value;
    const sireAlleleR = document.getElementById('sireAlleleR').value;
    const damAlleleR = document.getElementById('damAlleleR').value;
    const sireAlleleSl = document.getElementById('sireAlleleSl').value;
    const damAlleleSl = document.getElementById('damAlleleSl').value;
    const sireAlleleSp = document.getElementById('sireAlleleSp').value;
    const damAlleleSp = document.getElementById('damAlleleSp').value;

    showPopupMessage('Calculation complete, scroll down to view results');

    setGenotypeImage('sireImageContainer', sireAlleleb, sireAlleleC, sireAlleled, sireAlleleE, sireAlleleN, sireAllelePn, sireAlleleR, sireAlleleSl, sireAlleleSp, 'male');
    setGenotypeImage('damImageContainer', damAlleleb, damAlleleC, damAlleled, damAlleleE, damAlleleN, damAllelePn, damAlleleR, damAlleleSl, damAlleleSp, 'female');

    const combinationsb = calculateCombinations(sireAlleleb, damAlleleb, 'b');
    const combinationsC = calculateCombinations(sireAlleleC, damAlleleC, 'C');
    const combinationsd = calculateCombinations(sireAlleled, damAlleled, 'd');
    const combinationsE = calculateCombinations(sireAlleleE, damAlleleE, 'E');
    const combinationsN = calculateCombinations(sireAlleleN, damAlleleN, 'N');
    const combinationsPn = calculateCombinations(sireAllelePn, damAllelePn, 'Pn');
    const combinationsR = calculateCombinations(sireAlleleR, damAlleleR, 'R');
    const combinationsSl = calculateCombinations(sireAlleleSl, damAlleleSl, 'Sl');
    const combinationsSp = calculateCombinations(sireAlleleSp, damAlleleSp, 'Sp');

    const maleOffspring = [];
    const femaleOffspring = [];

    let totalRatioMale = 0;
    let totalRatioFemale = 0;

    for (const outcomeb of combinationsb.combinations) {
        for (const outcomeC of combinationsC.combinations) {
            for (const outcomed of combinationsd.combinations) {
                for (const outcomeE of combinationsE.combinations) {
                    for (const outcomeN of combinationsN.combinations) {
                        for (const outcomePn of combinationsPn.combinations) {
                            for (const outcomeR of combinationsR.combinations) {
                                for (const outcomeSl of combinationsSl.combinations) {
                                    for (const outcomeSp of combinationsSp.combinations) {
                                    const genotype = `${outcomeb} ${outcomeC} ${outcomed} ${outcomeE} ${outcomeN} ${outcomePn} ${outcomeR} ${outcomeSl} ${outcomeSp}`;
                                    const shortGenotype = removeUnusedAlleles(genotype);

                                    const ratio = combinationsb.ratios[outcomeb] *
                                        combinationsC.ratios[outcomeC] *
                                        combinationsd.ratios[outcomed] *
                                        combinationsE.ratios[outcomeE] *
                                        combinationsN.ratios[outcomeN] *
                                        combinationsPn.ratios[outcomePn] *
                                        combinationsR.ratios[outcomeR] *
                                        combinationsSl.ratios[outcomeSl] *
                                        combinationsSp.ratios[outcomeSp];

                                    let phenotype1 = phenotypeMapping1[shortGenotype];
                                    let phenotype1A = phenotypeMapping1A[shortGenotype];
                                    let phenotype1B = phenotypeMapping1B[shortGenotype];
                                    let phenotype1C = phenotypeMapping1C[shortGenotype];
                                    let phenotype1D = phenotypeMapping1D[shortGenotype];
                                    let phenotype1E = phenotypeMapping1E[shortGenotype];
                                    let phenotype2 = phenotypeMapping2[shortGenotype];
                                    let phenotype2A = phenotypeMapping2A[shortGenotype];
                                    let phenotype3 = phenotypeMapping3[shortGenotype];
                                    let phenotype3A = phenotypeMapping3A[shortGenotype];
                                    let phenotype4 = phenotypeMapping4[shortGenotype];
                                    let phenotype5 = phenotypeMapping5[shortGenotype];
                                    let phenotype6 = phenotypeMapping6[shortGenotype];
                                    let phenotype7 = phenotypeMapping7[shortGenotype];
                                    let phenotype8 = phenotypeMapping8[shortGenotype];
                                    let phenotype9 = phenotypeMapping9[shortGenotype];
                                    let phenotype10 = phenotypeMapping10[shortGenotype];
                                    let phenotype11 = phenotypeMapping11[shortGenotype];
                                    let phenotype12 = phenotypeMapping12[shortGenotype];
                                    let phenotype13 = phenotypeMapping13[shortGenotype];
                                    let phenotype14 = phenotypeMapping14[shortGenotype];
                                    let phenotype15 = phenotypeMapping15[shortGenotype];

                                    let phenotype = phenotype1 || phenotype1A || phenotype1B || phenotype1C || phenotype1D || phenotype1E || phenotype2 || phenotype2A ||  phenotype3 || phenotype3A || phenotype4 || phenotype5 || phenotype6 || phenotype7 || phenotype8 || phenotype9 || phenotype10 || phenotype11 || phenotype12 || phenotype13 || phenotype14 || phenotype15;

                                    
                                           if (!phenotype && genotype.includes("cc")) {
    if (genotype.includes("Fdfd") || genotype.includes("fdfd")) {
        // Do not set phenotype to "White" (Handle alternate logic here if needed)
    } else {
        // Assign specific White variation based on Bronze locus
        if (genotype.includes('BB') || genotype.includes('Bb') || genotype.includes('Bb1')) {
            phenotype = "White (Blue Eyes)";
        } else if (genotype.includes('bb') || genotype.includes('bb1')) {
            phenotype = "White (Dark Brown Eyes)";
        } else if (genotype.includes('b1b1')) {
            phenotype = "White (Light Brown Eyes)";
        } else {
            phenotype = "White"; // Default fallback for cc if none match
        }
    }
}

                                    const basePicturePath = 'https://porters-rare-heritage-turkeys.neocities.org/Pictures/';

                                    const maleGenotype = {
                                        phenotype: phenotype || 'To be defined',
                                        genotype: genotype,
                                        picturePath: phenotype ? `${basePicturePath}M${phenotype.replace(/\s/g, '')}.jpg` : '',
                                        ratio: ratio
                                    };

                                    const femaleGenotype = {
                                        phenotype: phenotype || 'To be defined',
                                        genotype: genotype,
                                        picturePath: phenotype ? `${basePicturePath}F${phenotype.replace(/\s/g, '')}.jpg` : '',
                                        ratio: ratio
                                    };

                                    if ((outcomeE === 'E-' || outcomeE === 'e-') && (outcomeN === 'N-' || outcomeN === 'n-')) {
                                        femaleOffspring.push(femaleGenotype);
                                        totalRatioFemale += ratio;
                                    }

                                    if ((outcomeE === 'EE' || outcomeE === 'Ee' || outcomeE === 'ee') && (outcomeN === 'NN' || outcomeN === 'Nn' || outcomeN === 'nn')) {
                                        maleOffspring.push(maleGenotype);
                                        totalRatioMale += ratio;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }  
}
 
 

    
 // Normalize ratios
maleOffspring.forEach(off => off.ratio = (off.ratio / totalRatioMale) / 2);
femaleOffspring.forEach(off => off.ratio = (off.ratio / totalRatioFemale) / 2);

displayResults('maleOffspringResults', maleOffspring, 'male');
displayResults('femaleOffspringResults', femaleOffspring, 'female');

displaySummaryChart(maleOffspring, femaleOffspring);
}



try {
    window.__ADV_LAST_RESULTS__ = {
        male: maleOffspring.slice(),
        female: femaleOffspring.slice()
    };
} catch (e) {}



/////////////////////////////////////////////


// ======================================================
// 🧬 GENETICS ENGINE EXPORT (FOR PARENTAGE CALCULATOR)
// SAFE: DOES NOT MODIFY calculateOffspring() LOGIC
// ======================================================

window.GeneticsEngine = window.GeneticsEngine || {};

window.GeneticsEngine.simulateCross = function(sireGenotypeString, damGenotypeString) {
  if (typeof calculateOffspring !== "function") {
    console.warn("simulateCross: calculateOffspring() not found.");
    return null;
  }
  if (typeof applyGenotypeToDropdowns !== "function") {
    console.warn("simulateCross: applyGenotypeToDropdowns() not found.");
    return null;
  }

  // Backup dropdown allele values
  const loci = ["b","C","d","E","N","Pn","R","Sl","Sp"];
  const backupAlleles = {};
  loci.forEach(locus => {
    const s = document.getElementById(`sireAllele${locus}`);
    const d = document.getElementById(`damAllele${locus}`);
    backupAlleles[`sireAllele${locus}`] = s ? s.value : undefined;
    backupAlleles[`damAllele${locus}`]  = d ? d.value : undefined;
  });

  // Backup functions we must silence / intercept
  const orig = {
    playSound: window.playSound,
    showPopupMessage: window.showPopupMessage,
    setGenotypeImage: window.setGenotypeImage,
    displayResults: window.displayResults,
    displaySummaryChart: window.displaySummaryChart
  };

  // Captured return payload
  const captured = { male: null, female: null };

  try {
    // Silence side-effects during simulation
    window.playSound = function(){};
    window.showPopupMessage = function(){};
    window.setGenotypeImage = function(){};
    window.displaySummaryChart = function(){};

    // Intercept displayResults to capture arrays (NO DOM work needed)
    window.displayResults = function(targetId, offspring, gender) {
      if (gender === "male") captured.male = offspring;
      if (gender === "female") captured.female = offspring;
      // Do NOT call original displayResults during simulation
      // (keeps it completely UI-free)
    };

    // Apply genotypes into your existing dropdowns
    applyGenotypeToDropdowns(sireGenotypeString, "sire");
    applyGenotypeToDropdowns(damGenotypeString, "dam");

    // Run your REAL working engine (unchanged)
    calculateOffspring();

    // Return captured offspring arrays
    return captured;

  } finally {
    // Restore dropdown values
    loci.forEach(locus => {
      const s = document.getElementById(`sireAllele${locus}`);
      const d = document.getElementById(`damAllele${locus}`);
      if (s && backupAlleles[`sireAllele${locus}`] !== undefined) s.value = backupAlleles[`sireAllele${locus}`];
      if (d && backupAlleles[`damAllele${locus}`] !== undefined) d.value = backupAlleles[`damAllele${locus}`];
    });

    // Restore original functions
    window.playSound = orig.playSound;
    window.showPopupMessage = orig.showPopupMessage;
    window.setGenotypeImage = orig.setGenotypeImage;
    window.displayResults = orig.displayResults;
    window.displaySummaryChart = orig.displaySummaryChart;
  }
};



/////////////////////////////////////

function applyGenotypeToDropdowns(genotypeString, role) {
    if (!genotypeString || !role) return;

    const map = {
        b: "b",
        C: "C",
        d: "d",
        E: "E",
        N: "N",
        Pn: "Pn",
        R: "R",
        Sl: "Sl",
        Sp: "Sp"
    };

    genotypeString.split(/\s+/).forEach(token => {
        Object.keys(map).forEach(locus => {
            if (token.startsWith(locus)) {
                const el = document.getElementById(`${role}Allele${locus}`);
                if (el) el.value = token;
            }
        });
    });
}


