const fs = require('fs');
const path = require('path');

const buildExamples = require('../examples/build');

fs.writeFileSync(path.join(__dirname, '..', 'index.html'), buildExamples());