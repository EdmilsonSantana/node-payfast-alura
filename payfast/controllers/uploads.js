'use strict';

var fs = require('fs');

module.exports = function(app) {

	app.post('/upload/imagem', (req, res) => {
		console.log('Recebendo imagem');

		let filename = req.headers.filename;

		req.pipe(fs.createWriteStream(`files/${filename}`))
			.on('finish', () => {
				console.log('Arquivo escrito');
				res.status(201).send('OK');
			});
	});
}