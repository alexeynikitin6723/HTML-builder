const path = require('path');
const { readdir, mkdir, copyFile, rm } = require('fs/promises');

const filePath = path.join(__dirname, 'files');
const filePathCopy = path.join(__dirname, 'files-copy');

async function copyDir(src, dest) {
	try {
		await rm(path.join(dest), { force: true, recursive: true });
		const files = await readdir(src, { withFileTypes: true });
		mkdir(dest, { recursive: true });
		for (let file of files) {
			const srcPath = path.join(src, file.name);
			const destPath = path.join(dest, file.name);
			await copyFile(srcPath, destPath);
		}
	} catch (err) {
		console.error(err);
	}
}

copyDir(filePath, filePathCopy);