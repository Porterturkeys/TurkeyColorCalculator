function displayResults(containerId, offspring, sex) {
    const offspringList = document.getElementById(containerId);
    offspringList.innerHTML = '';

    offspring.forEach(offspringItem => {
        const listItem = document.createElement('li');
        listItem.className = 'offspring-item';

        const genotype = removeUnusedAlleles(offspringItem.genotype);
        const phenotype = offspringItem.phenotype || 'To be defined';
        const basePicturePath = 'https://raw.githubusercontent.com/PortersTurkeys/Pictures/refs/heads/main/';
        const fallbackImagePath = 'https://raw.githubusercontent.com/PortersTurkeys/Pictures/refs/heads/main/image-not-available.jpg'; 
        const heterozygousGenotype = getHeterozygousGenotype(genotype);
        const longGenotype = offspringItem.genotype;
        const shortGenotype = genotype;
        
        
        // Generates image paths
        const adultPicturePath = basePicturePath + (sex === 'male' ? 'M' : 'F') + phenotype.replace(/\s/g, '') + '.jpg';

        // Sets default poult image
        let poultPicturePath = basePicturePath + 'P' + phenotype.replace(/\s/g, '') + '.jpg';

       
// Special conditions for poult image
if (genotype.includes('cc') && !genotype.includes("Fdfd") && !genotype.includes("fdfd")) {
            if (genotype.includes('BB') || genotype.includes('Bb') || genotype.includes('Bb1')) {
                displayPhenotype = "White (Blue Eyes)";
                imagePhenotype = "White";
            } else if (genotype.includes('bb') || genotype.includes('bb1')) {
                displayPhenotype = "White (Dark Brown Eyes)";
                imagePhenotype = "White";
            } else if (genotype.includes('b1b1')) {
                displayPhenotype = "White (Light Brown Eyes)";
                imagePhenotype = "White";
            }
        }





        // Formats the ratio
        const ratio = offspringItem.ratio;
        const fraction = `1/${(1 / ratio).toFixed(0)}`;
        const percentage = (ratio * 100).toFixed(7).replace(/\.?0+$/, '');
        const minSpecimens = Math.ceil(1 / ratio);

        listItem.innerHTML = `
        <strong><u>Phenotype/Variety:</u></strong><br>
        <span class="variety-name">${phenotype}</span><br>

        <strong class="genotype" data-long-genotype="${offspringItem.genotype}" data-short-genotype="${genotype}">
        ${genotypeDisplayFormat === 'long' ? offspringItem.genotype : genotype}
        </strong><br>
        
         ${heterozygousGenotype}<br>
        <b><span style="color: blue;">Ratio: ${fraction} = ${percentage}%, minimum offspring to breed: ${minSpecimens}</span><br><b>

        <div class="image-container">
            <div class="image-wrapper">
                <img src="${adultPicturePath}" alt="Adult ${sex} Image" style="width: 150px; height: 150px; border: 2px solid black;" 
                     onerror="this.onerror=null; this.src='${fallbackImagePath}';">
                <p>Adult</p>
            </div>
            <div class="image-wrapper" style="margin-top: 10px;">
                <img src="${poultPicturePath}" alt="Poult Image" style="width: 150px; height: 150px; border: 2px solid black;" 
                     onerror="this.onerror=null; this.src='${fallbackImagePath}';">
                <p>Poult</p>
            </div>
        </div>

        <button 
        onclick="transferOffspringToParent('${genotype}', '${sex === 'male' ? 'sire' : 'dam'}'); playSound('${sex === 'male' ? 'sireSound' : 'damSound'}');" 
        style="border: 4px solid blue; padding: 5px 10px;">
        Continue as ${sex === 'male' ? 'Sire' : 'Dam'}
    </button>
`;

        offspringList.appendChild(listItem);
    });

    updateDisplayedGenotypes(); 
}



function setGenotypeImage(containerId, alleleb, alleleC, alleled, alleleE, alleleN, allelePn, alleleR, alleleSl, alleleSp, sex) {
    const basePicturePath = 'https://raw.githubusercontent.com/PortersTurkeys/Pictures/refs/heads/main/';
    const fallbackImagePath = 'https://raw.githubusercontent.com/PortersTurkeys/Pictures/refs/heads/main/image-not-available.jpg'; 
    const sexPrefix = sex === 'male' ? 'M' : 'F';

    // Builds genotype string
    const genotype = `${alleleb} ${alleleC} ${alleled} ${alleleE} ${alleleN} ${allelePn} ${alleleR} ${alleleSl} ${alleleSp}`;
    const shortGenotype = removeUnusedAlleles(genotype);

    // Retrieves phenotype from all mappings
    const phenotypeMappings = [phenotypeMapping1, phenotypeMapping1A, phenotypeMapping1B, phenotypeMapping1C, phenotypeMapping1D, phenotypeMapping1E, phenotypeMapping2, phenotypeMapping2A, phenotypeMapping3, phenotypeMapping3A, phenotypeMapping4, phenotypeMapping5, phenotypeMapping6, phenotypeMapping7, phenotypeMapping8, phenotypeMapping9, phenotypeMapping10, phenotypeMapping11, phenotypeMapping12, phenotypeMapping13, phenotypeMapping14, phenotypeMapping15, phenotypeMapping16, phenotypeMapping17, phenotypeMapping18];
    let phenotype = null;

    // Checks for cc in the genotype to force White phenotype
if (genotype.includes('cc') && !(genotype.includes('Fdfd') || genotype.includes('fdfd'))) {
    if (genotype.includes('BB') || genotype.includes('Bb') || genotype.includes('Bb1')) {
        phenotype = "White (Blue Eyes)";
    } else if (genotype.includes('bb') || genotype.includes('bb1')) {
        phenotype = "White (Dark Brown Eyes)";
    } else if (genotype.includes('b1b1')) {
        phenotype = "White (Light Brown Eyes)";
    } else {
        phenotype = "White"; // Default fallback if none of the above match
    }
} else {
    for (const mapping of phenotypeMappings) {
        if (mapping.hasOwnProperty(shortGenotype)) {
            phenotype = mapping[shortGenotype];
            break;
        }
    }
}


    // Determines the image path or fallback
    const picturePath = phenotype
        ? `${basePicturePath}${sexPrefix}${phenotype.replace(/\s/g, '')}.jpg`
        : fallbackImagePath;

    // Generates the genotype information
    const genotypeInfo = `<strong><u>Phenotype/Variety:</u><br><span style="color: blue;">${phenotype || 'To be defined'}</span><br><br><u>Short Genotype:</u><br><span style="color: blue;">${shortGenotype}</span></strong>`;

    // Updates the container with the image and info
    document.getElementById(containerId).innerHTML = `
        <div>
            <img src="${picturePath}" alt="${sex} Image" style="max-width: 460px; height: auto;" 
                onerror="this.onerror=null; this.src='${fallbackImagePath}';">
            <div>${genotypeInfo}</div>
        </div>
    `;
}
