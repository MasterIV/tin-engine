const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const dir = path.join(__dirname, '/../doc')
if(fs.existsSync(dir))
    fs.rmdirSync(dir);
fs.mkdirSync(dir);

