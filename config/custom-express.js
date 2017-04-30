'use strict';

let express = require('express');
let consign = require('consign');
let bodyParser = require('body-parser');
let expressValidator = require('express-validator');

module.exports = function(){
  let app = express();

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

  app.use(expressValidator());

  consign()
   .include('controllers')
   .then('persistencia')
   .into(app);

  let PagamentoDao = app.persistencia.PagamentoDao;
  let ConnectionFactory = app.persistencia.ConnectionFactory;
  
  ConnectionFactory
  	.createConnection()
  	.then((connection) => new PagamentoDao(connection))
  	.then((dao) => app.dao = dao)
  	.catch(() => console.log('Não foi possível obter uma conexão com o Banco de dados.'));  
 
  return app;
}
