const path = require('path');
const { readdir, readFile, writeFile } = require('fs/promises')

const pathStyles = path.join(__dirname, 'styles');
const pathBundle = path.join(__dirname, 'project-dist', 'bundle.css');

async function joinCssFiles() {
	try {
		const files = await readdir(pathStyles, { withFileTypes: true });
		let result = [];
		for (const file of files) {
			if (file.isFile() && path.extname(file.name) == '.css') {
				let data = await readFile(path.join(pathStyles, file.name));
				result.push(data.toString());
			}
		}
		const bundle = writeFile(pathBundle, result);
		await bundle;
	} catch (err) {
		console.error(err);
	}
}

joinCssFiles()