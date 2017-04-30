'use strict';

let mongodb = require('mongodb');
let MongoClient = mongodb.MongoClient;

let url = 'mongodb://localhost:27017';


class ConnectionFactory {
	static createConnection() {
		return new Promise((resolve, reject) => {
			MongoClient.connect(url, (erros, connection) => {
				if(!erros) {
					console.log("Conectado corretamente com o Banco de dados.");
					resolve(connection);
				} else {
					console.log(erros)
					reject(connection);
				}
			});
		});
		
	}
}

module.exports = function() {
	return ConnectionFactory;
}