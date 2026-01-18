// ======================================================
// CALCULATE OFFSPRING (SINGLE DEFINITON - NO DUPLICATES)
// + SAFE reset button sound binding
// + SAFE basePicturePath (no refs/heads)
// + Exports results to window.__ADV_LAST_RESULTS__
// + GeneticsEngine.simulateCross() for parentage calculator
// ======================================================

// ---- Reset button sound (SAFE: waits for DOM, checks element) ----
document.addEventListener("DOMContentLoaded", () => {
  const resetBtn = document.querySelector('button[onclick="resetCalculator()"]');
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      try { playSound("clickSound"); } catch (e) {}
    });
  }
});

// ---- OPTIONAL: if you want a global calc counter (kept from your snippet) ----
let calculationCount = 0;

// ======================================================
// MAIN ENGINE
// ======================================================
function calculateOffspring() {
  // If any required functions/vars are missing, fail loudly in console
  // (prevents silent "core not loading" confusion)
  if (typeof calculateCombinations !== "function") console.error("[calc] calculateCombinations missing");
  if (typeof removeUnusedAlleles !== "function") console.error("[calc] removeUnusedAlleles missing");
  if (typeof displayResults !== "function") console.error("[calc] displayResults missing");
  if (typeof displaySummaryChart !== "function") console.error("[calc] displaySummaryChart missing");
  if (typeof setGenotypeImage !== "function") console.error("[calc] setGenotypeImage missing");

  // ---- Read dropdown values ----
  const sireAlleleb  = document.getElementById("sireAlleleb")?.value;
  const damAlleleb   = document.getElementById("damAlleleb")?.value;
  const sireAlleleC  = document.getElementById("sireAlleleC")?.value;
  const damAlleleC   = document.getElementById("damAlleleC")?.value;
  const sireAlleled  = document.getElementById("sireAlleled")?.value;
  const damAlleled   = document.getElementById("damAlleled")?.value;
  const sireAlleleE  = document.getElementById("sireAlleleE")?.value;
  const damAlleleE   = document.getElementById("damAlleleE")?.value;
  const sireAlleleN  = document.getElementById("sireAlleleN")?.value;
  const damAlleleN   = document.getElementById("damAlleleN")?.value;
  const sireAllelePn = document.getElementById("sireAllelePn")?.value;
  const damAllelePn  = document.getElementById("damAllelePn")?.value;
  const sireAlleleR  = document.getElementById("sireAlleleR")?.value;
  const damAlleleR   = document.getElementById("damAlleleR")?.value;
  const sireAlleleSl = document.getElementById("sireAlleleSl")?.value;
  const damAlleleSl  = document.getElementById("damAlleleSl")?.value;
  const sireAlleleSp = document.getElementById("sireAlleleSp")?.value;
  const damAlleleSp  = document.getElementById("damAlleleSp")?.value;

  // If any dropdowns are missing, stop here (prevents cryptic null errors)
  const required = [
    sireAlleleb, damAlleleb, sireAlleleC, damAlleleC, sireAlleled, damAlleled,
    sireAlleleE, damAlleleE, sireAlleleN, damAlleleN, sireAllelePn, damAllelePn,
    sireAlleleR, damAlleleR, sireAlleleSl, damAlleleSl, sireAlleleSp, damAlleleSp
  ];
  if (required.some(v => typeof v === "undefined")) {
    console.error("[calc] One or more allele dropdowns not found (IDs mismatch).");
    return;
  }

  calculationCount++;

  try { showPopupMessage?.("Calculation complete, scroll down to view results"); } catch(e) {}

  // Update parent images immediately
  try {
    setGenotypeImage("sireImageContainer", sireAlleleb, sireAlleleC, sireAlleled, sireAlleleE, sireAlleleN, sireAllelePn, sireAlleleR, sireAlleleSl, sireAlleleSp, "male");
    setGenotypeImage("damImageContainer",  damAlleleb,  damAlleleC,  damAlleled,  damAlleleE,  damAlleleN,  damAllelePn,  damAlleleR,  damAlleleSl,  damAlleleSp, "female");
  } catch (e) {
    console.warn("[calc] setGenotypeImage failed:", e);
  }

  // ---- Build locus combinations ----
  const combinationsb  = calculateCombinations(sireAlleleb,  damAlleleb,  "b");
  const combinationsC  = calculateCombinations(sireAlleleC,  damAlleleC,  "C");
  const combinationsd  = calculateCombinations(sireAlleled,  damAlleled,  "d");
  const combinationsE  = calculateCombinations(sireAlleleE,  damAlleleE,  "E");
  const combinationsN  = calculateCombinations(sireAlleleN,  damAlleleN,  "N");
  const combinationsPn = calculateCombinations(sireAllelePn, damAllelePn, "Pn");
  const combinationsR  = calculateCombinations(sireAlleleR,  damAlleleR,  "R");
  const combinationsSl = calculateCombinations(sireAlleleSl, damAlleleSl, "Sl");
  const combinationsSp = calculateCombinations(sireAlleleSp, damAlleleSp, "Sp");

  const maleOffspring = [];
  const femaleOffspring = [];

  let totalRatioMale = 0;
  let totalRatioFemale = 0;

  // ---- Picture base (FIXED - no refs/heads) ----
  const basePicturePath = "https://raw.githubusercontent.com/PortersTurkeys/Pictures/main/";

  // ---- Helper: lookup phenotype across all mappings safely ----
  function lookupPhenotype(shortGenotype) {
    // Use window[] so missing files don't crash everything
    const maps = [
      "phenotypeMapping1","phenotypeMapping1A","phenotypeMapping1B","phenotypeMapping1C","phenotypeMapping1D","phenotypeMapping1E",
      "phenotypeMapping2","phenotypeMapping2A",
      "phenotypeMapping3","phenotypeMapping3A",
      "phenotypeMapping4","phenotypeMapping5","phenotypeMapping6","phenotypeMapping7","phenotypeMapping8","phenotypeMapping9",
      "phenotypeMapping10","phenotypeMapping11","phenotypeMapping12","phenotypeMapping13","phenotypeMapping14",
      "phenotypeMapping15","phenotypeMapping16","phenotypeMapping17","phenotypeMapping18"
    ];

    for (const name of maps) {
      const m = window[name];
      if (m && typeof m === "object" && m[shortGenotype]) return m[shortGenotype];
    }
    return null;
  }

  // ======================================================
  // LOOP ALL OFFSPRING OUTCOMES
  // ======================================================
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

                    const ratio =
                      combinationsb.ratios[outcomeb]  *
                      combinationsC.ratios[outcomeC]  *
                      combinationsd.ratios[outcomed]  *
                      combinationsE.ratios[outcomeE]  *
                      combinationsN.ratios[outcomeN]  *
                      combinationsPn.ratios[outcomePn]*
                      combinationsR.ratios[outcomeR]  *
                      combinationsSl.ratios[outcomeSl]*
                      combinationsSp.ratios[outcomeSp];

                    let phenotype = lookupPhenotype(shortGenotype);

                    // ---- Your cc / White override block (kept) ----
                    if (!phenotype && genotype.includes("cc")) {
                      if (genotype.includes("Fdfd") || genotype.includes("fdfd")) {
                        // do nothing here (your logic placeholder)
                      } else {
                        if (genotype.includes("BB") || genotype.includes("Bb") || genotype.includes("Bb1")) {
                          phenotype = "White (Blue Eyes)";
                        } else if (genotype.includes("bb") || genotype.includes("bb1")) {
                          phenotype = "White (Dark Brown Eyes)";
                        } else if (genotype.includes("b1b1")) {
                          phenotype = "White (Light Brown Eyes)";
                        } else {
                          phenotype = "White";
                        }
                      }
                    }

                    const safeNameForFile = phenotype ? String(phenotype).replace(/\s/g, "") : "";

                    const maleGenotype = {
                      phenotype: phenotype || "To be defined",
                      genotype,
                      picturePath: phenotype ? `${basePicturePath}M${safeNameForFile}.jpg` : "",
                      ratio
                    };

                    const femaleGenotype = {
                      phenotype: phenotype || "To be defined",
                      genotype,
                      picturePath: phenotype ? `${basePicturePath}F${safeNameForFile}.jpg` : "",
                      ratio
                    };

                    // Female = sex-linked placeholders
                    if ((outcomeE === "E-" || outcomeE === "e-") && (outcomeN === "N-" || outcomeN === "n-")) {
                      femaleOffspring.push(femaleGenotype);
                      totalRatioFemale += ratio;
                    }

                    // Male = full diploid outcomes
                    if ((outcomeE === "EE" || outcomeE === "Ee" || outcomeE === "ee") &&
                        (outcomeN === "NN" || outcomeN === "Nn" || outcomeN === "nn")) {
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

  // ---- Normalize ratios (kept exactly like your logic) ----
  maleOffspring.forEach(off => off.ratio = (off.ratio / totalRatioMale) / 2);
  femaleOffspring.forEach(off => off.ratio = (off.ratio / totalRatioFemale) / 2);

  // ---- EXPORT RESULTS (FIXED: inside the function so variables exist) ----
  try {
    window.__ADV_LAST_RESULTS__ = {
      male: maleOffspring.slice(),
      female: femaleOffspring.slice()
    };
  } catch (e) {}

  // ---- Render ----
  displayResults("maleOffspringResults", maleOffspring, "male");
  displayResults("femaleOffspringResults", femaleOffspring, "female");
  displaySummaryChart(maleOffspring, femaleOffspring);

  // ---- Play success sound at the end (kept intention of your first function) ----
  try { playSound?.("successSound"); } catch (e) {}
}



// ======================================================
// GENETICS ENGINE EXPORT (FOR PARENTAGE CALCULATOR)
// SAFE: does not modify calculateOffspring logic
// ======================================================
window.GeneticsEngine = window.GeneticsEngine || {};

window.GeneticsEngine.simulateCross = function (sireGenotypeString, damGenotypeString) {
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
    };

    // Apply genotypes into your existing dropdowns
    applyGenotypeToDropdowns(sireGenotypeString, "sire");
    applyGenotypeToDropdowns(damGenotypeString, "dam");

    // Run the real engine
    calculateOffspring();

    // Return captured offspring arrays
    return captured;

  } finally {
    // Restore dropdown values
    loci.forEach(locus => {
      const s = document.getElementById(`sireAllele${locus}`);
      const d = document.getElementById(`damAllele${locus}`);
      if (s && backupAlleles[`sireAllele${locus}`] !== undefined) s.value = backupAlleles[`sireAllele${locus}`];
      if (d && backupAlleles[`damAllele${locus}`]  !== undefined) d.value = backupAlleles[`damAllele${locus}`];
    });

    // Restore original functions
    window.playSound = orig.playSound;
    window.showPopupMessage = orig.showPopupMessage;
    window.setGenotypeImage = orig.setGenotypeImage;
    window.displayResults = orig.displayResults;
    window.displaySummaryChart = orig.displaySummaryChart;
  }
};



// ======================================================
// APPLY GENOTYPE STRING -> DROPDOWNS
// ======================================================
function applyGenotypeToDropdowns(genotypeString, role) {
  if (!genotypeString || !role) return;

  const loci = ["b","C","d","E","N","Pn","R","Sl","Sp"];

  genotypeString.split(/\s+/).forEach(token => {
    loci.forEach(locus => {
      // match tokens like: bb, Bb1, CC, cgcg, Dd, EE, E-, NN, N-, PnPn, Rr, SlSl, Slsl, SpSp, etc.
      // We keep your simple startsWith behavior.
      if (token.startsWith(locus)) {
        const el = document.getElementById(`${role}Allele${locus}`);
        if (el) el.value = token;
      }
      // Special-case: tokens like "PnPn" should be detected too
      if (locus === "Pn" && token.startsWith("Pn")) {
        const el = document.getElementById(`${role}AllelePn`);
        if (el) el.value = token;
      }
      if (locus === "Sl" && token.startsWith("Sl")) {
        const el = document.getElementById(`${role}AlleleSl`);
        if (el) el.value = token;
      }
      if (locus === "Sp" && token.startsWith("Sp")) {
        const el = document.getElementById(`${role}AlleleSp`);
        if (el) el.value = token;
      }
    });
  });
}
