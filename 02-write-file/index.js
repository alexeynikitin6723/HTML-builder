const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process
const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write('Hello! Write here\n')
stdin.on('data', chunk => {
	if (chunk.toString().trim() == 'exit') {
		console.log('Goodluck!');
		process.exit();
	}
	output.write(chunk);
});
process.on('SIGINT', () => {
	stdout.write('Goodluck!');
	process.exit();
})