// Run server to show documentation
const express = require('express');
const app = express();
const port = 8080;

const buildExamples = require('../examples/build');

app.use(express.static('./'));

app.get(/\w*/, (req, res) => {
    res.send(buildExamples());
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

