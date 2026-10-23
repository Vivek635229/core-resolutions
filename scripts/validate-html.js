const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

// Check IDs
const idRegex = /id=["']([^"']+)["']/g;
let match;
const idMatches = [];
while ((match = idRegex.exec(html)) !== null) {
  idMatches.push(match[1]);
}

const idCounts = {};
idMatches.forEach(id => {
  idCounts[id] = (idCounts[id] || 0) + 1;
});
const duplicateIds = Object.keys(idCounts).filter(id => idCounts[id] > 1);

// Check Href anchors
const hrefRegex = /href=["']#([^"']+)["']/g;
const hrefMatches = [];
while ((match = hrefRegex.exec(html)) !== null) {
  hrefMatches.push(match[1]);
}
const missingTargets = hrefMatches.filter(h => h && h !== '' && !idCounts[h]);

console.log('Total IDs found:', idMatches.length);
console.log('Duplicate IDs:', duplicateIds);
console.log('Missing anchor targets:', [...new Set(missingTargets)]);
