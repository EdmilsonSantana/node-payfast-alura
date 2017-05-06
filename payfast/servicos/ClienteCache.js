'use strict';

let Memcached = require('memcached');


let url = 'localhost:11211';
const timeToLive = 60000;

class ClienteCache {

	constructor() {
		this._cliente = new Memcached(url, {
			retries: 10,
			retry: 10000,
			remove: true
		});
	}

	set(key, object) {

		this._cliente.set(key, object, timeToLive, (erros) => {
			if(!erros) {
				console.log(`Nova chave adicionada ao cache - ${key}`);
			}
		});
	}

	get(id) {
		return new Promise((resolve, reject) => {
			this._cliente.get(id, (erros, retorno)=> {
				if(erros || !retorno) {
					console.log('MISS - chave não encontrada');
					reject();
				} else {
					console.log(`HIT - valor: ${JSON.stringify(retorno)}`);
					resolve(retorno);
				}
			});
		});
	}

	static get timeToLive() {
		return timeToLive;
	} 
}

module.exports = function() {
	return ClienteCache;
};
