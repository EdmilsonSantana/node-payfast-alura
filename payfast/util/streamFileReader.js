var fs = require('fs');

fs.createReadStream('imagem.jpg')
	.pipe(fs.createWriteStream('image-com-stream.jpg'))
	.on('finish', () => {
		console.log('Arquivo escrito com stream');
	});