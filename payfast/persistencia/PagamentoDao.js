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

	buscar(id) {

		let consulta = {}

		if(id) {
			consulta._id = ObjectID(id);
		}
		
		return new Promise((resolve, reject) => {
			this._collection.find(consulta)
							.toArray((erros, resultado)=>{
								if(!erros && resultado.length > 0) {
									resolve(resultado);
								} else {
									reject(`Pagamento não encontrado: ${erros}`);
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