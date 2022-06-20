const fs = require('fs');
const path = require('path');

let examples = [];

function findExamples(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(f => {
        const name = path.join(dir, f);
        const stats = fs.statSync(name);

        if(stats.isDirectory())
            findExamples(name);
        else if(f.endsWith('.example.js'))
            examples.push({
                id: f.substring(0, f.length-11),
                path: path.relative(path.join(__dirname, '..'), name).replace(path.sep, '/')
            });
    });
}

module.exports = function() {
    const dir = path.join(__dirname, '..', 'examples');
    const template_index = fs.readFileSync(path.join(dir, 'index.html')).toString();

    examples = [];
    findExamples(path.join(__dirname, '..'));

    let script = "import renderExamples from './examples/examples.js';\n";
    script += examples.map(e => `import ${e.id} from './${e.path}';\n`).join('');
    script += "\nwindow.onload = () => renderExamples({\n" + examples.map(e => `  ${e.id}: {examples: ${e.id}, path: '${e.path}'},\n`).join('') + "});";

    return template_index.replace('{{ script }}', `<script type="module">${script}</script>`);
};
