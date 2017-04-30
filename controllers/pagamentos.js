'use strict';

module.exports = function(app){
  app.get('/pagamentos', (req, res) => {
    console.log('Recebida requisicao de teste na porta 3000.')
    res.send('OK.');
  });

  app.post('/pagamentos/pagamento', (req, res) => {
  	console.log('Processando a requisição de um novo pagamento');

  	req.assert("forma_de_pagamento", 
  		"Forma de pagamento é obrigatório.").notEmpty();
  	req.assert("valor", "Valor é obrigatório e deve ser um decimal." )
  		.notEmpty().isFloat();
  	req.assert("moeda", "Moeda é obrigatória e deve ter 3 caracteres")
  	   	.notEmpty().len(3,3);


  	var erros = req.validationErrors();

  	if(erros) {
  		console.log('Erros de validação encontrados.');
  		res.status(400).send(erros);
  		return;
  	}

  	let pagamento = req.body;

  	pagamento.status = 'CRIADO';
  	pagamento.data = new Date();

  	app.dao.salva(pagamento)
  		.then((resultado) => {
  			console.log('Inserido com sucesso');
  			res.location('/pagamentos/pagamento/' + resultado._id)
  				.status(201).send(pagamento);
  		})
  		.catch((erros) => {
  			console.log('Erro ao inserir no banco');
  			res.status(500).send(erros);
  		});
  });
}
