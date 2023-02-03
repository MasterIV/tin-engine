#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const express = require('express');
const chalk = require( 'chalk' );
const yargs = require("yargs");
const buildExamples = require('../examples/build');

const port = 8080;
const engineDir = path.join(__dirname, '..');
const currentDir = process.cwd();

function mkdir(dir) {
	if(!fs.existsSync(dir)) fs.mkdirSync(dir);
}

function copyFile(local, dest = '') {
	const filename = path.join(currentDir, dest, path.basename(local))
	if(!fs.existsSync(filename))
		fs.copyFileSync(local, filename);
}

function copyAll(dir, dest = '') {
	const files = fs.readdirSync(dir);

	files.forEach(f => {
		const name = path.join(dir, f);
		const stats = fs.statSync(name);

		if(stats.isDirectory()) {
			copyAll(name, path.join(dest, f));
		} else {
			copyFile(name, dest);
		}
	});
}

function commandExamples() {
	const app = express();
	app.get(/^\/\w*$/, (req, res) => res.send(buildExamples()));
	app.use(express.static(engineDir));
	app.listen(port, () => console.log(`Example app listening on port ${port}`));
}

function commandDesigner() {
	const app = express();
	app.get('/', (req, res) => res.send(fs.readFileSync(path.join(engineDir, 'designer', 'index.html')).toString()));
	app.use(express.static(engineDir));
	app.listen(port, () => console.log(`Example app listening on port ${port}`));
}

function commandBootstrap() {
	if(currentDir == engineDir)
		throw 'Can\'t bootstrap engine directory. Please run this command only in a project.';

	// Update package json
	const packagePath = path.join(currentDir, 'package.json')
	let packageJson = {
		name: path.basename(currentDir),
		version: "0.0.1",
		dependencies: {},
		devDependencies: {},
		scripts: {},
	};

	if(fs.existsSync(packagePath)) {
		const currentJson = JSON.parse(fs.readFileSync(packagePath));
		Object.assign(packageJson, currentJson);
	}

	Object.assign(packageJson['dependencies'], {
		"tin-engine": "^" + JSON.parse(fs.readFileSync(path.join(engineDir, 'package.json'))).version
	});

	Object.assign(packageJson['devDependencies'], {
		"webpack": "^4.*",
		"webpack-cli": "^4.*"
	});

	Object.assign(packageJson['scripts'], {
		"debug": "webpack --config webpack.config.js --mode development -w",
		"build": "webpack --config webpack.config.js --mode production",
	});

	fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, '  '));

	// Copy files
	mkdir(path.join(currentDir, 'js'));
	mkdir(path.join(currentDir, 'img'));
	mkdir(path.join(currentDir, 'css'));
	mkdir(path.join(currentDir, 'src'));
	mkdir(path.join(currentDir, 'src/scene'));
	mkdir(path.join(currentDir, 'src/entity'));
	mkdir(path.join(currentDir, 'src/ui'));

	copyFile(path.join(engineDir, '.gitignore'));
	copyFile(path.join(engineDir, 'konservenfabrik.gif'), 'img');
	copyAll(path.join(engineDir, 'project'));
}

try {
	yargs
		.command('examples', 'Run a local webserver with the engine examples', {}, commandExamples)
		.command('designer', 'Run a local webserver for the UI design tool', {}, commandDesigner)
		.command('bootstrap', 'Setup a new project with all to be used with the engine', {}, commandBootstrap)
		.demandCommand(1, chalk.red('Please provide a command.'))
		.help()
		.argv
} catch (error) {
	console.error(chalk.red('Error: ' + error));
}
