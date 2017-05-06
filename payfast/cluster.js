'use strict';

let cluster = require('cluster');
let os = require('os');

let cpus = os.cpus();

console.log('Executando thread.');

if(cluster.isMaster) {
	console.log('Executando thread master.');
	
	cpus.forEach(() => {
		cluster.fork();
	});

	cluster.on('listening', worker => {
		console.log(`Cluster conectado ${worker.process.pid}`)
	});

	cluster.on('exit', worker => {
		console.log('Cluster %d desconectado', worker.process.pid);
		cluster.fork();
	});

} else {
	console.log('Executando thread slave.');
	require('./index')
}