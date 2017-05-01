'use strict';

module.exports = function(app) {
	app.post('/correios/calculo-prazo', (req, res) => {
		
		let dadosDaEntrega = req.body;

		let clienteSoapCorreios = new app.servicos.ClienteSoapCorreios();

		clienteSoapCorreios.calculoPrazo(dadosDaEntrega)
							.then((resultado) => {
								console.log(resultado);
								res.status(200).json(resultado);
							})
							.catch((erros) => {
								console.log(erros);
								res.status(500).send(erros);
							});
	});
}