'use strict';

let express = require('express');
let consign = require('consign');
let bodyParser = require('body-parser');
let expressValidator = require('express-validator');
let morgan = require('morgan');
let logger = require('../servicos/logger')();

module.exports = function(){
  let app = express();

  app.use(morgan("common", {
    stream: {
      write: (mensagem) => logger.info(mensagem)
    }
  }));

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

  app.use(expressValidator());

  consign()
   .include('controllers')
   .then('persistencia')
   .then('servicos')
   .into(app);

  let PagamentoDao = app.persistencia.PagamentoDao;
  let ConnectionFactory = app.persistencia.ConnectionFactory;

  let dao = ConnectionFactory
            .createConnection()
  					.then((connection) => new PagamentoDao(connection))
  					.catch(() => console.log('Não foi possível obter uma conexão com o Banco de dados.'));

  app.persistencia = function() {
    return dao;
  };

  return app;
}


