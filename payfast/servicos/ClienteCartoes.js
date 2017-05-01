'use strict';

let restify = require('restify');

let url = "http://localhost:3001";

class ClienteCartoes {
	constructor() {
		this._cliente = restify.createJsonClient({url});
	}

	autoriza(cartao) {
		return new Promise((resolve, reject) => {
				this._cliente.post('/cartoes/autoriza', cartao, 
				(erros, req, res, retorno) => {

					if(!erros) {
						resolve(retorno);
					} else {
						reject(erros);
					}
	 			}
 			);
		});
	}
}


module.exports = function() {
	return ClienteCartoes;
}

