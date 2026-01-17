function getHeterozygousGenotype(genotype) {
const loci = genotype.split(' ');
const heterozygousLoci = [];
const specialCases = [];

loci.forEach(locus => {
let splitLabel = '';

switch (locus) {
case 'Bb':
splitLabel = 'Black (B), Bronze (b)';
break;
case 'Bb1':
splitLabel = 'Black (B), Black Winged Bronze (b1)';
break;
case 'bb1':
splitLabel = 'Bronze (b), Black Winged Bronze (b1)';
break;
case 'Ccg':
splitLabel = 'Gray (cg)';
break;
case 'Ccm':
splitLabel = 'Mottling (cm)';
break;
case 'Cc':
splitLabel = 'White (c)';
break;
case 'cgcm':
splitLabel = 'Gray (cg), Mottling (cm)';
break;
case 'cgc':
splitLabel = 'Gray (cg), White (c)';
break;
case 'cmc':
splitLabel = 'Mottling (cm), White (c)';
break;
case 'Ee':
splitLabel = 'Brown (e)';
break;
case 'Nn':
splitLabel = 'Narragansett (n)';
break;
case 'Pnpn':
specialCases.push('Heterozygous for Pencilling (Pnpn)');
break;
case 'pnpn':
specialCases.push('Homozygous for Pencilling (pnpn)');
break;
case 'Slsl':
splitLabel = 'Recessive Slate (sl)';
break;
case 'Spsp':
splitLabel = 'Spotting (sp)';
break;
}

        if (splitLabel) {
            heterozygousLoci.push(splitLabel);
        }
    });

    const result = [];
    if (heterozygousLoci.length > 0) {
        result.push(`Split: ${heterozygousLoci.join(', ')}`);
    }
    if (specialCases.length > 0) {
        result.push(specialCases.join(', '));
    }

    return result.join(', ');
}


