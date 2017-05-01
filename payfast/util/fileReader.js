var fs = require('fs');

fs.readFile('imagem.jpg', (erros, buffer) => {
	console.log('Arquivo Lido');

	fs.writeFile('imagem-com-buffer.jpg', buffer, (erros) => {
		console.log('Arquivo escrito');
	});
});