'use strict';

const PAGAMENTO_CRIADO = "CRIADO";
const PAGAMENTO_CONFIRMADO = "CONFIRMADO";
const PAGAMENTO_CANCELADO  = "CANCELADO";

module.exports = function(app){

  app.get('/pagamentos', (req, res) => {
    app.dao.then((dao) => {
    	dao.listar()
    		.then((pagamentos) => res.json(pagamentos));
    });
  });

  app.delete('/pagamentos/pagamento/:id', (req, res) => {
    let id = req.params.id;

    app.dao.then((dao) => {
      dao.atualiza(id, PAGAMENTO_CANCELADO)
        .then(() => {
          console.log('Pagamento cancelado.');
          let pagamento = {"id": id, "status": PAGAMENTO_CANCELADO };
          res.status(204).json(pagamento);
        })
        .catch((erros) => {
          console.log(erros);
          res.status(500).send(erros);
        });
    });
  });

  app.put('/pagamentos/pagamento/:id', (req, res) => {

  	let id = req.params.id;

  	app.dao.then((dao) => {
  		dao.atualiza(id, PAGAMENTO_CONFIRMADO)
  			.then(() => {
          console.log('Pagamento confirmado.');
          let pagamento = {"id": id, "status": PAGAMENTO_CONFIRMADO };
  				res.json(pagamento);
  			})
  			.catch((erros) => {
  				console.log(erros);
  				res.status(500).send(erros);
  			});
  	});
  });

  function newResponse(pagamento) {
    return  {
                dados_do_pagamento : pagamento,
                links : [
                  {
                    href : `http://localhost:3000/pagamentos/pagamento/${pagamento._id}`,
                    rel: "confirmar",
                    method: "PUT",
                  }, 
                  {
                    href : `http://localhost:3000/pagamentos/pagamento/${pagamento._id}`,
                    rel: "cancelar",
                    method: "DELETE",
                  }
                ]
            }
  }


  app.post('/pagamentos/pagamento', (req, res) => {
  	console.log('Processando a requisição de um novo pagamento');

  	req.assert("pagamento.forma_de_pagamento", 
  		"Forma de pagamento é obrigatório.").notEmpty();
  	req.assert("pagamento.valor", "Valor é obrigatório e deve ser um decimal." )
  		.notEmpty().isFloat();
  	req.assert("pagamento.moeda", "Moeda é obrigatória e deve ter 3 caracteres")
  	   	.notEmpty().len(3,3);


  	var erros = req.validationErrors();

  	if(erros) {
  		console.log('Erros de validação encontrados.');
  		res.status(400).send(erros);
  		return;
  	}

  	let pagamento = req.body.pagamento;
    
    let clienteCartoes = new app.servicos.ClienteCartoes();
              
  	pagamento.status = PAGAMENTO_CRIADO;
  	pagamento.data = new Date();

  	app.dao.then((dao) => {
  		dao.salva(pagamento)
    		.then((pagamentoCriado) => {

    			console.log('Inserido com sucesso');

          var response = newResponse(pagamentoCriado);

          if(pagamentoCriado.forma_de_pagamento == 'cartao') {

              let cartao = req.body.cartao;

              clienteCartoes
                .autoriza(cartao)
                .then((cartaoAutorizado) => {
                  response["cartao"] = cartaoAutorizado;
                  res.location('/pagamentos/pagamento/' + pagamentoCriado._id)
                    .status(201).json(response);
                })
                .catch((erros) => {
                  console.log(erros);
                  res.status(400).send(erros);
                });
           } else {

              res.location('/pagamentos/pagamento/' + pagamentoCriado._id)
                .status(201).send(response);
           }

    		})
    		.catch((erros) => {
    			console.log('Erro ao inserir no banco');
          console.log(erros);
    			res.status(500).send(erros);
    		});
  	});
  });
}
