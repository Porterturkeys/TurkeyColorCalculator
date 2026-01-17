function calculateCombinations(alleleSire, alleleDam, locus) {
const alleles = [alleleSire, alleleDam].sort().join(' ');
const combinations = [];
const ratios = {};
switch (locus) {
case 'b':
switch (alleles) {
case 'BB BB':
combinations.push('BB');
ratios['BB'] = 1;
break;
case 'BB Bb':
case 'Bb BB':
combinations.push('BB', 'Bb');
ratios['BB'] = 0.5;
ratios['Bb'] = 0.5;
break;
case 'BB bb':
case 'bb BB':
combinations.push('Bb');
ratios['Bb'] = 1;
break;
case 'BB b1b1':
case 'b1b1 BB':
combinations.push('Bb1');
ratios['Bb1'] = 1;
break;
case 'Bb Bb':
combinations.push('BB', 'Bb', 'bb');
ratios['BB'] = 0.25;
ratios['Bb'] = 0.5;
ratios['bb'] = 0.25;
break;
case 'Bb bb':
case 'bb Bb':
combinations.push('Bb', 'bb');
ratios['Bb'] = 0.5;
ratios['bb'] = 0.5;
break;
case 'Bb b1b1':
case 'b1b1 Bb':
combinations.push('Bb1', 'bb1');
ratios['Bb1'] = 0.5;
ratios['bb1'] = 0.5;
break;
case 'BB Bb1':
case 'Bb1 BB':
combinations.push('BB', 'Bb1');
ratios['BB'] = 0.5;
ratios['Bb1'] = 0.5;
break;
case 'Bb Bb1':
case 'Bb1 Bb':
combinations.push('BB', 'Bb', 'Bb1', 'bb1');
ratios['BB'] = 0.25;
ratios['Bb'] = 0.25;
ratios['Bb1'] = 0.25;
ratios['bb1'] = 0.25;
break;
case 'Bb1 bb':
case 'bb Bb1':
combinations.push('Bb', 'bb1');
ratios['Bb'] = 0.5;
ratios['bb1'] = 0.5;
break;
case 'Bb1 b1b1':
case 'b1b1 Bb1':
combinations.push('Bb1', 'b1b1');
ratios['Bb1'] = 0.5;
ratios['b1b1'] = 0.5;
break;
case 'Bb1 Bb1':
combinations.push('BB', 'Bb1', 'b1b1');
ratios['BB'] = 0.25;
ratios['Bb1'] = 0.5;
ratios['b1b1'] = 0.25;
break;
case 'BB bb1':
case 'bb1 BB':
combinations.push('Bb', 'Bb1');
ratios['Bb'] = 0.5;
ratios['Bb1'] = 0.5;
break;
case 'Bb bb1':
case 'bb1 Bb':
combinations.push('Bb', 'Bb1', 'bb', 'bb1');
ratios['Bb'] = 0.25;
ratios['Bb1'] = 0.25;
ratios['bb'] = 0.25;
ratios['bb1'] = 0.25;
break;
case 'Bb1 bb1':
case 'bb1 Bb1':
combinations.push('Bb', 'Bb1', 'bb1', 'b1b1');
ratios['Bb'] = 0.25;
ratios['Bb1'] = 0.25;
ratios['bb1'] = 0.25;
ratios['b1b1'] = 0.25;

break;
case 'bb bb':
combinations.push('bb');
ratios['bb'] = 1;
break;
case 'bb bb1':
case 'bb1 bb':
combinations.push('bb', 'bb1');
ratios['bb'] = 0.5;
ratios['bb1'] = 0.5;
break;
case 'bb1 bb1':
combinations.push('bb', 'bb1', 'b1b1');
ratios['bb'] = 0.25;
ratios['bb1'] = 0.5;
ratios['b1b1'] = 0.25;
break;
case 'bb b1b1':
case 'b1b1 bb':
combinations.push('bb1');
ratios['bb1'] = 1;
break;
case 'bb1 b1b1':
case 'b1b1 bb1':
combinations.push('bb1', 'b1b1');
ratios['bb1'] = 0.5;
ratios['b1b1'] = 0.5;
break;
case 'b1b1 b1b1':
combinations.push('b1b1');
ratios['b1b1'] = 1;
break;
default:
if (alleleSire === alleleDam) {
combinations.push(alleleSire);
ratios[alleleSire] = 1;
console.log('Matching alleles:', alleleSire);
} else {
combinations.push('To be defined');
console.log('Undefined combination');
}
break;
}
break;
case 'C':
switch (alleles) {
case 'CC CC':
combinations.push('CC');
ratios['CC'] = 1;
break;
case 'CC Ccg':
case 'Ccg CC':
combinations.push('CC', 'Ccg');
ratios['CC'] = 0.5;
ratios['Ccg'] = 0.5;
break;
case 'CC Ccm':
case 'Ccm CC':
combinations.push('CC', 'Ccm');
ratios['CC'] = 0.5;
ratios['Ccm'] = 0.5;
break;
case 'CC Cc':
case 'Cc CC':
combinations.push('CC', 'Cc');
ratios['CC'] = 0.5;
ratios['Cc'] = 0.5;
break;
case 'CC cgcg':
case 'cgcg CC':
combinations.push('Ccg');
ratios['Ccg'] = 1;
break;
case 'CC cgcm':
case 'cgcm CC':
combinations.push('Ccg', 'Ccm');
ratios['Ccg'] = 0.5;
ratios['Ccm'] = 0.5;
break;
case 'CC cgc':
case 'cgc CC':
combinations.push('Ccg', 'Cc');
ratios['Ccg'] = 0.5;
ratios['Cc'] = 0.5;
break;
case 'CC cmcm':
case 'cmcm CC':
combinations.push('Ccm');
ratios['Ccm'] = 1;
break;
case 'CC cmc':
case 'cmc CC':
combinations.push('Ccm', 'Cc');
ratios['Ccm'] = 0.5;
ratios['Cc'] = 0.5;
break;
case 'CC cc':
case 'cc CC':
combinations.push('Cc');
ratios['Cc'] = 1;
break;
case 'Ccg Ccg':
combinations.push('CC', 'Ccg', 'cgcg');
ratios['CC'] = 0.25;
ratios['Ccg'] = 0.5;
ratios['cgcg'] = 0.25;
break;
case 'Ccg Ccm':
case 'Ccm Ccg':
combinations.push('CC', 'Ccg', 'Ccm', 'cgcm');
ratios['CC'] = 0.25;
ratios['Ccg'] = 0.25;
ratios['Ccm'] = 0.25;
ratios['cgcm'] = 0.25;
break;
case 'Ccg Cc':
case 'Cc Ccg':
combinations.push('CC', 'Ccg', 'Cc', 'cgc');
ratios['CC'] = 0.25;
ratios['Ccg'] = 0.25;
ratios['Cc'] = 0.25;
ratios['cgc'] = 0.25;
break;
case 'Ccg cgcg':
case 'cgcg Ccg':
combinations.push('Ccg', 'cgcg');
ratios['Ccg'] = 0.5;
ratios['cgcg'] = 0.5;
break;
case 'Ccg cgcm':
case 'cgcm Ccg':
combinations.push('Ccg', 'Ccm', 'cgcg', 'cgcm');
ratios['Ccg'] = 0.25;
ratios['Ccm'] = 0.25;
ratios['cgcg'] = 0.25;
ratios['cgcm'] = 0.25;
break;
case 'Ccg cgc':
case 'cgc Ccg':
combinations.push('Ccg', 'Cc', 'cgcg', 'cgc');
ratios['Ccg'] = 0.25;
ratios['Cc'] = 0.25;
ratios['cgcg'] = 0.25;
ratios['cgc'] = 0.25;
break;
case 'Ccg cmcm':
case 'cmcm Ccg':
combinations.push('Ccm', 'cgcm');
ratios['Ccm'] = 0.5;
ratios['cgcm'] = 0.5;
break;
case 'Ccg cmc':
case 'cmc Ccg':
combinations.push('Ccm', 'Cc', 'cgcm', 'cgc');
ratios['Ccm'] = 0.25;
ratios['Cc'] = 0.25;
ratios['cgcm'] = 0.25;
ratios['cgc'] = 0.25;
break;
case 'Ccg cc':
case 'cc Ccg':
combinations.push('Cc', 'cgc');
ratios['Cc'] = 0.5;
ratios['cgc'] = 0.5;
break;
case 'Ccm Ccg':
case 'Ccg Ccm':
combinations.push('CC', 'Ccg', 'Ccm', 'cgcm');
ratios['CC'] = 0.25;
ratios['Ccg'] = 0.25;
ratios['Ccm'] = 0.25;
ratios['cgcm'] = 0.25;
break;
case 'Ccm Ccm':
combinations.push('CC', 'Ccm', 'cmcm');
ratios['CC'] = 0.25;
ratios['Ccm'] = 0.5;
ratios['cmcm'] = 0.25;
break;
case 'Ccm Cc':
case 'Cc Ccm':
combinations.push('CC', 'Ccm', 'Cc', 'cmc');
ratios['CC'] = 0.25;
ratios['Ccm'] = 0.25;
ratios['Cc'] = 0.25;
ratios['cmc'] = 0.25;
break;
case 'Ccm cgcg':
case 'cgcg Ccm':
combinations.push('Ccg', 'cgcm');
ratios['Ccg'] = 0.5;
ratios['cgcm'] = 0.5;
break;
case 'Ccm cgcm':
case 'cgcm Ccm':
combinations.push('Ccg', 'Ccm', 'cgcm', 'cmcm');
ratios['Ccg'] = 0.25;
ratios['Ccm'] = 0.25;
ratios['cgcm'] = 0.25;
ratios['cmcm'] = 0.25;
break;
case 'Ccm cgc':
case 'cgc Ccm':
combinations.push('Ccg', 'Cc', 'cgcm', 'cmc');
ratios['Ccg'] = 0.25;
ratios['Cc'] = 0.25;
ratios['cgcm'] = 0.25;
ratios['cmc'] = 0.25;
break;
case 'Ccm cmcm':
case 'cmcm Ccm':
combinations.push('Ccm', 'cmcm');
ratios['Ccm'] = 0.5;
ratios['cmcm'] = 0.5;
break;
case 'Ccm cmc':
case 'cmc Ccm':
combinations.push('Ccm', 'Cc', 'cmcm', 'cmc');
ratios['Ccm'] = 0.25;
ratios['Cc'] = 0.25;
ratios['cmcm'] = 0.25;
ratios['cmc'] = 0.25;
break;
case 'Ccm cc':
case 'cc Ccm':
combinations.push('Cc', 'cmc');
ratios['Cc'] = 0.5;
ratios['cmc'] = 0.5;
break;
case 'Cc Cc':
combinations.push('CC', 'Cc', 'cc');
ratios['CC'] = 0.25;
ratios['Cc'] = 0.5;
ratios['cc'] = 0.25;
break;
case 'Cc cgcg':
case 'cgcg Cc':
combinations.push('Ccg', 'cgc');
ratios['Ccg'] = 0.5;
ratios['cgc'] = 0.5;
break;
case 'Cc cgcm':
case 'cgcm Cc':
combinations.push('Ccg', 'Ccm', 'cgc', 'cmc');
ratios['Ccg'] = 0.25;
ratios['Ccm'] = 0.25;
ratios['cgc'] = 0.25;
ratios['cmc'] = 0.25;
break;
case 'Cc cgc':
case 'cgc Cc':
combinations.push('Ccg', 'Cc', 'cgc', 'cc');
ratios['Ccg'] = 0.25;
ratios['Cc'] = 0.25;
ratios['cgc'] = 0.25;
ratios['cc'] = 0.25;
break;
case 'Cc cmcm':
case 'cmcm Cc':
combinations.push('Ccm', 'cmc');
ratios['Ccm'] = 0.5;
ratios['cmc'] = 0.5;
break;
case 'Cc cmc':
case 'cmc Cc':
combinations.push('Ccm', 'Cc', 'cmc', 'cc');
ratios['Ccm'] = 0.25;
ratios['Cc'] = 0.25;
ratios['cmc'] = 0.25;
ratios['cc'] = 0.25;
break;
case 'Cc cc':
case 'cc Cc':
combinations.push('Cc', 'cc');
ratios['Cc'] = 0.5;
ratios['cc'] = 0.5;
break;
case 'cgcg cgcm':
case 'cgcm cgcg':
combinations.push('cgcg', 'cgcm');
ratios['cgcg'] = 0.5;
ratios['cgcm'] = 0.5;
break;
case 'cgcg cgc':
case 'cgc cgcg':
combinations.push('cgcg', 'cgc');
ratios['cgcg'] = 0.5;
ratios['cgc'] = 0.5;
break;
case 'cgcg cmcm':
case 'cmcm cgcg':
combinations.push('cgcm');
ratios['cgcm'] = 1;
break;
case 'cgcg cmc':
case 'cmc cgcg':
combinations.push('cgcm', 'cgc');
ratios['cgcm'] = 0.5;
ratios['cgc'] = 0.5;
break;
case 'cgcg cc':
case 'cc cgcg':
combinations.push('cgc');
ratios['cgc'] = 1;
break;
case 'cgcm cgcm':
combinations.push('cgcg', 'cgcm', 'cmcm');
ratios['cgcg'] = 0.25;
ratios['cgcm'] = 0.5;
ratios['cmcm'] = 0.25;
break;
case 'cgcm cgc':
case 'cgc cgcm':
combinations.push('cgcg', 'cgcm', 'cgc', 'cmc');
ratios['cgcg'] = 0.25;
ratios['cgcm'] = 0.25;
ratios['cgc'] = 0.25;
ratios['cmc'] = 0.25;
break;
case 'cgcm cmcm':
case 'cmcm cgcm':
combinations.push('cgcm', 'cmcm');
ratios['cgcm'] = 0.5;
ratios['cmcm'] = 0.5;
break;
case 'cgcm cmc':
case 'cmc cgcm':
combinations.push('cgcm', 'cgc', 'cmcm', 'cmc');
ratios['cgcm'] = 0.25;
ratios['cgc'] = 0.25;
ratios['cmcm'] = 0.25;
ratios['cmc'] = 0.25;
break;
case 'cgcm cc':
case 'cc cgcm':
combinations.push('cgc', 'cmc');
ratios['cgc'] = 0.5;
ratios['cmc'] = 0.5;
break;
case 'cgcg cgcg':
combinations.push('cgcg');
ratios['cgcg'] = 1;
break;
case 'cgc cgc':
combinations.push('cgcg', 'cgc', 'cc');
ratios['cgcg'] = 0.25;
ratios['cgc'] = 0.5;
ratios['cc'] = 0.25;
break;
case 'cgc cmcm':
case 'cmcm cgc':
combinations.push('cgcm', 'cmc');
ratios['cgcm'] = 0.5;
ratios['cmc'] = 0.5;
break;
case 'cgc cmc':
case 'cmc cgc':
combinations.push('cgcm', 'cgc', 'cmc', 'cc');
ratios['cgcm'] = 0.25;
ratios['cgc'] = 0.25;
ratios['cmc'] = 0.25;
ratios['cc'] = 0.25;
break;
case 'cgc cc':
case 'cc cgc':
combinations.push('cgc', 'cc');
ratios['cgc'] = 0.5;
ratios['cc'] = 0.5;
break;
case 'cmcm cmcm':
combinations.push('cmcm');
ratios['cmcm'] = 1;
break;
case 'cmcm cmc':
case 'cmc cmcm':
combinations.push('cmcm', 'cmc');
ratios['cmcm'] = 0.5;
ratios['cmc'] = 0.5;
break;
case 'cmcm cc':
case 'cc cmcm':
combinations.push('cmc');
ratios['cmc'] = 1;
break;
case 'cmc cmc':
combinations.push('cmcm', 'cmc', 'cc');
ratios['cmcm'] = 0.25;
ratios['cmc'] = 0.5;
ratios['cc'] = 0.25;
break;
case 'cmc cc':
case 'cc cmc':
combinations.push('cmc', 'cc');
ratios['cmc'] = 0.5;
ratios['cc'] = 0.5;
break;
case 'cc cc':
combinations.push('cc');
ratios['cc'] = 1;
break;
default:
if (alleleSire === alleleDam) {
combinations.push(alleleSire);
ratios[alleleSire] = 1;
console.log('Matching alleles:', alleleSire);
} else {
combinations.push('To be defined');
console.log('Undefined combination');
}
break;
}
break;
case 'd':
switch (alleles) {
case 'DD DD':
combinations.push('DD');
ratios['DD'] = 1;
break;
case 'DD Dd':
case 'Dd DD':
combinations.push('DD', 'Dd');
ratios['DD'] = 0.5;
ratios['Dd'] = 0.5;
break;
case 'DD dd':
case 'dd DD':
combinations.push('Dd');
ratios['Dd'] = 1;
break;
case 'Dd Dd':
combinations.push('DD', 'Dd', 'dd');
ratios['DD'] = 0.25;
ratios['Dd'] = 0.5;
ratios['dd'] = 0.25;
break;
case 'Dd dd':
case 'dd Dd':
combinations.push('Dd', 'dd');
ratios['Dd'] = 0.5;
ratios['dd'] = 0.5;
break;
case 'dd dd':
combinations.push('dd');
ratios['dd'] = 1;
break;
default:
if (alleleSire === alleleDam) {
combinations.push(alleleSire);
ratios[alleleSire] = 1;
console.log('Matching alleles:', alleleSire);
} else {
combinations.push('To be defined');
console.log('Undefined combination');
}
break;
}
break;
case 'E':
// Handle combinations for locus E
switch (alleles) {
case 'EE E-':
case 'E- EE':
combinations.push('EE', 'E-');
ratios['EE'] = 0.5;
ratios['E-'] = 0.5;
break;
case 'EE e-':
case 'e- EE':
combinations.push('Ee', 'E-');
ratios['Ee'] = 0.5;
ratios['E-'] = 0.5;
break;
case 'Ee E-':
case 'E- Ee':
combinations.push('EE', 'Ee', 'E-', 'e-');
ratios['EE'] = 0.25;
ratios['Ee'] = 0.25;
ratios['E-'] = 0.25;
ratios['e-'] = 0.25;
break;
case 'Ee e-':
case 'e- Ee':
combinations.push('Ee', 'E-', 'ee', 'e-');
ratios['Ee'] = 0.25;
ratios['E-'] = 0.25;
ratios['ee'] = 0.25;
ratios['e-'] = 0.25;
break;
case 'ee E-':
case 'E- ee':
combinations.push('Ee', 'e-');
ratios['Ee'] = 0.5;
ratios['e-'] = 0.5;
break;
case 'ee e-':
case 'e- ee':
combinations.push('ee', 'e-');
ratios['ee'] = 0.5;
ratios['e-'] = 0.5;
break;
default:
if (alleleSire === alleleDam) {
combinations.push(alleleSire);
ratios[alleleSire] = 1;
console.log('Matching alleles:', alleleSire);
} else {
combinations.push('To be defined');
console.log('Undefined combination');
}
break;
}
break;
case 'N':
// Handle combinations for locus N
switch (alleles) {
case 'NN N-':
case 'N- NN':
combinations.push('NN', 'N-');
ratios['NN'] = 0.5;
ratios['N-'] = 0.5;
break;
case 'NN n-':
case 'n- NN':
combinations.push('Nn', 'N-');
ratios['Nn'] = 0.5;
ratios['N-'] = 0.5;
break;
case 'Nn N-':
case 'N- Nn':
combinations.push('NN', 'Nn', 'N-', 'n-');
ratios['NN'] = 0.25;
ratios['Nn'] = 0.25;
ratios['N-'] = 0.25;
ratios['n-'] = 0.25;
break;
case 'Nn n-':
case 'n- Nn':
combinations.push('Nn', 'N-', 'nn', 'n-');
ratios['Nn'] = 0.25;
ratios['N-'] = 0.25;
ratios['nn'] = 0.25;
ratios['n-'] = 0.25;
break;
case 'nn N-':
case 'N- nn':
combinations.push('Nn', 'n-');
ratios['Nn'] = 0.5;
ratios['n-'] = 0.5;
break;
case 'nn n-':
case 'n- nn':
combinations.push('nn', 'n-');
ratios['nn'] = 0.5;
ratios['n-'] = 0.5;
break;
default:
if (alleleSire === alleleDam) {
combinations.push(alleleSire);
ratios[alleleSire] = 1;
console.log('Matching alleles:', alleleSire);
} else {
combinations.push('To be defined');
console.log('Undefined combination');
}
break;
}
break;
case 'Pn':
// Handle combinations for locus Pn
switch (alleles) {
case 'PnPn PnPn':
combinations.push('PnPn');
ratios['PnPn'] = 1;
break;
case 'PnPn Pnpn':
case 'Pnpn PnPn':
combinations.push('PnPn', 'Pnpn');
ratios['PnPn'] = 0.5;
ratios['Pnpn'] = 0.5;
break;
case 'Pnpn Pnpn':
combinations.push('PnPn', 'Pnpn', 'pnpn');
ratios['PnPn'] = 0.25;
ratios['Pnpn'] = 0.5;
ratios['pnpn'] = 0.25;
break;
case 'pnpn pnpn':
combinations.push('pnpn');
ratios['pnpn'] = 1;
break;
case 'Pnpn pnpn':
case 'pnpn Pnpn':
combinations.push('Pnpn', 'pnpn');
ratios['Pnpn'] = 0.5;
ratios['pnpn'] = 0.5;
break;
case 'PnPn pnpn':
combinations.push('Pnpn');
ratios['Pnpn'] = 1;
break;
default:
if (alleleSire === alleleDam) {
combinations.push(alleleSire);
ratios[alleleSire] = 1;
console.log('Matching alleles:', alleleSire);
} else {
combinations.push('To be defined');
console.log('Undefined combination');
}
break;
}
break;
case 'R':
// Handle combinations for locus R
switch (alleles) {
case 'RR RR':
combinations.push('RR');
ratios['RR'] = 1;
break;
case 'rr rr':
combinations.push('rr');
ratios['rr'] = 1;
break;
case 'RR rr':
case 'rr RR':
combinations.push('Rr');
ratios['Rr'] = 1;
break;
case 'RR Rr':
case 'Rr RR':
combinations.push('RR', 'Rr');
ratios['RR'] = 0.5;
ratios['Rr'] = 0.5;
break;
case 'Rr Rr':
combinations.push('RR', 'Rr', 'rr');
ratios['RR'] = 0.25;
ratios['Rr'] = 0.5;
ratios['rr'] = 0.25;
break;
case 'rr Rr':
case 'Rr rr':
combinations.push('Rr', 'rr');
ratios['Rr'] = 0.5;
ratios['rr'] = 0.5;
break;
default:
if (alleleSire === alleleDam) {
combinations.push(alleleSire);
ratios[alleleSire] = 1;
console.log('Matching alleles:', alleleSire);
} else {
combinations.push('To be defined');
console.log('Undefined combination');
}
break;
}
break;
case 'Sl':
// Handle combinations for locus Sl
switch (alleles) {
case 'SlSl SlSl':
combinations.push('SlSl');
ratios['SlSl'] = 1;
break;
case 'slsl slsl':
combinations.push('slsl');
ratios['slsl'] = 1;
break;
case 'SlSl slsl':
case 'slsl SlSl':
combinations.push('Slsl');
ratios['Slsl'] = 1;
break;
case 'Slsl Slsl':
combinations.push('SlSl', 'Slsl', 'slsl');
ratios['SlSl'] = 0.25;
ratios['Slsl'] = 0.5;
ratios['slsl'] = 0.25;
break;
case 'SlSl Slsl':
case 'Slsl SlSl':
combinations.push('SlSl', 'Slsl');
ratios['SlSl'] = 0.5;
ratios['Slsl'] = 0.5;
break;
case 'Slsl slsl':
case 'slsl Slsl':
combinations.push('Slsl', 'slsl');
ratios['Slsl'] = 0.5;
ratios['slsl'] = 0.5;
break;
default:
if (alleleSire === alleleDam) {
combinations.push(alleleSire);
ratios[alleleSire] = 1;
console.log('Matching alleles:', alleleSire);
} else {
combinations.push('To be defined');
console.log('Undefined combination');
}
break;
}
break;
case 'Sp':
// Handle combinations for locus Sp
switch (alleles) {
case 'SpSp SpSp':
combinations.push('SpSp');
ratios['SpSp'] = 1;
break;
case 'spsp spsp':
combinations.push('spsp');
ratios['spsp'] = 1;
break;
case 'SpSp spsp':
case 'spsp SpSp':
combinations.push('Spsp');
ratios['Spsp'] = 1;
break;
case 'Spsp Spsp':
combinations.push('SpSp', 'Spsp', 'spsp');
ratios['SpSp'] = 0.25;
ratios['Spsp'] = 0.5;
ratios['spsp'] = 0.25;
break;
case 'SpSp Spsp':
case 'Spsp SpSp':
combinations.push('SpSp', 'Spsp');
ratios['SpSp'] = 0.5;
ratios['Spsp'] = 0.5;
break;
case 'Spsp spsp':
case 'spsp Spsp':
combinations.push('Spsp', 'spsp');
ratios['Spsp'] = 0.5;
ratios['spsp'] = 0.5;
break;
default:
if (alleleSire === alleleDam) {
combinations.push(alleleSire);
ratios[alleleSire] = 1;
console.log('Matching alleles:', alleleSire);
} else {
combinations.push('To be defined');
console.log('Undefined combination');
}
break;
}
break;
}
return {
combinations,
ratios
};
}
