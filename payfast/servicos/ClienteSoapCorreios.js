'use strict';

let soap = require('soap');

class ClienteSoapCorreios {

	constructor() {
		this._url = "http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?wsdl";
	}

	calculoPrazo(dadosDaEntrega) {
		return new Promise((resolve, reject) => {
			this.cliente.then((cliente) => {

				cliente.CalcPrazo(dadosDaEntrega, (erros, resultado) => {
					if(!erros) {
						resolve(JSON.stringify(resultado));
					} else {
						reject(erros);
					}
				});	
			})
			.catch((erros) => reject(erros));
		});
	}

	get cliente() {
		return new Promise((resolve, reject) => {
			soap.createClient(this._url, (erros, cliente) => {
				if(!erros) {
					resolve(cliente);
				} else {
					console.log(erros);
					reject(erros);
				}
			})
		});
	}
}



module.exports = function() {
	return ClienteSoapCorreios;
}