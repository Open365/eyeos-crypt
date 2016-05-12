/*
    Copyright (c) 2016 eyeOS

    This file is part of Open365.

    Open365 is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

var RSAKeysHolder = require('./RSAKeysHolder');

var RSAProvider = function(options, rsaKeysHolder) {
	this.options = options;
	this.rsaKeysHolder = rsaKeysHolder || new RSAKeysHolder(options);
};

RSAProvider.prototype.encrypt = function(msg, callback) {
	this.rsaKeysHolder.publicKey(function(err, publicKey) {
		if (err) {
			callback(err);
			return;
		}
		var encrypted = publicKey.encrypt(msg, 'utf8', 'base64');
		callback(false, encrypted);
	});
};

RSAProvider.prototype.decrypt = function(msg, callback) {
	this.rsaKeysHolder.privateKey(function(err, privateKey) {
		if (err) {
			callback(err);
			return;
		}
		var decrypted = privateKey.decrypt(msg, 'base64', 'utf8');
		callback(false, decrypted);
	});
};


module.exports = RSAProvider;