const path = require('path');
const fsPromises = require('fs/promises');
const { readdir, stat } = require('fs/promises');
const { stdout } = process;
const filePath = path.join(__dirname, 'secret-folder');

(async function () {
	try {
		const files = await readdir(filePath, { withFileTypes: true });
		for (const file of files) {
			if (file.isFile()) {
				const fileExtension = path.extname(file.name);
				const fileName = path.basename(file.name, fileExtension);
				const fileSize = ((await stat(path.join(filePath, file.name))).size / 1024).toFixed(3);
				console.log(`${fileName} - ${fileExtension.slice(1)} - ${fileSize}kb`);
			}
		}
	} catch (err) {
		console.error(err);
	}
})();