'use strict';

const PAGAMENTO_CRIADO = "CRIADO";
const PAGAMENTO_CONFIRMADO = "CONFIRMADO";
const PAGAMENTO_CANCELADO  = "CANCELADO";

module.exports = function(app){

  app.get('/pagamentos/pagamento/:id', (req, res) => {

    let id = req.params.id;

    console.log(`Consultando pagamento: ${id}`);

    let clienteCache = new app.servicos.ClienteCache();
    let chaveCache = `pagamento-${id}`;

    clienteCache
     .get(chaveCache)
     .then((pagamento) => res.json(pagamento))
     .catch(() => {
         app.persistencia().then((dao) => {
             dao.buscar(id).then((resultado) => {
                     console.log(`Pagamento encontrado: ${JSON.stringify(resultado)}`);
                     res.json(resultado);
                 })
                 .catch((erros) => {
                     console.log(erros);
                     res.status(500).send(erros);
                 });
         });
     });
    

  });

  app.delete('/pagamentos/pagamento/:id', (req, res) => {
    let id = req.params.id;

    app.persistencia().then((dao) => {
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

  	app.persistencia().then((dao) => {
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
    
  	pagamento.status = PAGAMENTO_CRIADO;
  	pagamento.data = new Date();

  	app.persistencia().then((dao) => {
  		dao.salva(pagamento)
    		.then((pagamentoCriado) => {

    			console.log('Inserido com sucesso');

          enviarPagamentoCriado(pagamentoCriado, req, res);

    		})
    		.catch((erros) => {
    			console.log('Erro ao inserir no banco');
          console.log(erros);
    			res.status(500).send(erros);
    		});
  	});

  });

  function enviarPagamentoCriado(pagamento, req, res) {
      var dadosRetorno = criarDadosRetorno(pagamento);
     
      let clienteCache = new app.servicos.ClienteCache();
     
      let chaveCache = `pagamento-${pagamento._id}`;

      clienteCache.set(chaveCache, pagamento);

      if (pagamento.forma_de_pagamento == 'cartao') {

          let clienteCartoes = new app.servicos.ClienteCartoes();
          let cartao = req.body.cartao;

          clienteCartoes
              .autoriza(cartao)
              .then((cartaoAutorizado) => {
                  dadosRetorno["cartao"] = cartaoAutorizado;
                  res.location('/pagamentos/pagamento/' + pagamento._id)
                      .status(201).json(dadosRetorno);
              })
              .catch((erros) => {
                  console.log(erros);
                  res.status(400).send(erros);
              });
      } else {

          res.location('/pagamentos/pagamento/' + pagamento._id)
              .status(201).send(dadosRetorno);
      }
  }

  function criarDadosRetorno(pagamento) {
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

}
