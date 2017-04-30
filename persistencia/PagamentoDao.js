'use strict';

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
			this._collection.find({}).toArray((erros, documentos)=>{
				if(!err) {
					resolve(documentos);
				} else {
					reject(erros);
				}
			});
		});
	}
}

module.exports = function() {
	return PagamentoDao;
}