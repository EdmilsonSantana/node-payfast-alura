'use strict';

var ObjectID = require('mongodb').ObjectID; 

class PagamentoDao {
	
	constructor(connection) {
		this._collection = connection.collection('pagamentos');
	}

	salva(pagamento) {
		return new Promise((resolve, reject)=> {
			this._collection.insert(pagamento, (erros, resultado) => {
				if(!erros) {
					resolve(resultado.ops[0]);
				} else {
					reject(erros);
				}
			});
		});
	}

	listar() {
		return new Promise((resolve, reject) => {
			this._collection.find({}).toArray((erros, resultado)=>{
				if(!erros) {
					resolve(resultado);
				} else {
					reject(erros);
				}
			});
		});
	}

	atualiza(id, status) {
		return new Promise((resolve, reject) => {
			this._collection
				.updateOne({"_id": ObjectID(id)}, {$set : {"status": status}}, 
				 	    (erros,resultado)=> {
				 	    	if(!erros) {
				 	    		resolve(resultado);
				 	    	} else {
				 	    		reject(erros);
				 	    	}
						}
				);
		});
	}
}

module.exports = function() {
	return PagamentoDao;
}