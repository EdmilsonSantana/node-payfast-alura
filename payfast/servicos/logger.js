'use strict';

let winston = require('winston');
let fs = require('fs');

if(!fs.existsSync('logs')) {
	fs.mkdirSync('logs');
}

module.exports = function() {
	return new winston.Logger({
		transports: [
	 		new winston.transports.File({
	 			level: "info",
	 			filename: "logs/payfast.log",
	 			maxsize: 1048576,
	 			maxFiles: 10,
	 			colorize: false,
	 		}),
		]
	});
}