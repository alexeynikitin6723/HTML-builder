const path = require('path');
const { readdir, mkdir, copyFile, rm, readFile, writeFile } = require('fs/promises');


const pathToProjectDist = path.join(__dirname, 'project-dist');
const pathToTemplate = path.join(__dirname, 'template.html');
const pathToIndexHTML = path.join(pathToProjectDist, 'index.html');
const pathToStyles = path.join(__dirname, 'styles');
const pathToStylesBundle = path.join(pathToProjectDist, 'style.css');
const pathSource = path.join(__dirname, 'assets');
const pathDest = path.join(pathToProjectDist, 'assets');
const pathToComponents = path.join(__dirname, 'components');

async function createHTML() {
	mkdir(pathToProjectDist, { recursive: true });
	const template = (await readFile(pathToTemplate)).toString().split('\n');
	let result = [];
	for (let line of template) {
		let firstIndex = line.indexOf('{{');
		let lastIndex = line.indexOf('}}');
		//console.log(firstIndex, lastIndex);
		if (firstIndex === -1 || lastIndex === -1) {
			result.push(line);
		} else {
			const nameOfFile = line.slice(firstIndex + 2, lastIndex);
			let data = (await readFile(path.join(pathToComponents, nameOfFile + '.html'))).toString();
			result.push('\n', data, '\n');
		}
	}
	const bundle = writeFile(pathToIndexHTML, result);
	await bundle;
}

async function joinCssFiles() {
	try {
		const files = await readdir(pathToStyles, { withFileTypes: true });
		let result = [];
		for (const file of files) {
			if (file.isFile() && path.extname(file.name) == '.css') {
				let data = await readFile(path.join(pathToStyles, file.name));
				result.push(data.toString());
			}
		}
		const bundle = writeFile(pathToStylesBundle, result);
		await bundle;
	} catch (err) {
		console.error(err);
	}
}

async function copyDir(src, dest) {
	try {
		await rm(path.join(dest), { force: true, recursive: true });
		const files = await readdir(src, { withFileTypes: true });
		mkdir(dest, { recursive: true });
		for (let file of files) {
			const srcPath = path.join(src, file.name);
			const destPath = path.join(dest, file.name);
			if (file.isFile()) {
				await copyFile(srcPath, destPath);
			} else {
				await copyDir(srcPath, destPath);
			}
		}
	} catch (err) {
		console.error(err);
	}
}

createHTML();
joinCssFiles()
copyDir(pathSource, pathDest);