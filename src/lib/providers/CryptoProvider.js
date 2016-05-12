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

var RSAProvider = require('./RSAProvider');

var CryptoProvider = function(options, rsa) {
	this.options = options;
	this.rsa = rsa || new RSAProvider(options);
};

CryptoProvider.prototype.encrypt = function(msg, callback) {
	if (checkMissingOptions(this.options, callback)) {
		return;
	}

	if (this.options.type === 'rsa') {
		this.rsa.encrypt(msg, function(err, encryptedMsg) {
			callback(err, encryptedMsg);
		});
	}
};

CryptoProvider.prototype.decrypt = function(msg, callback) {
	if (checkMissingOptions(this.options, callback)) {
		return;
	}

	if (this.options.type === 'rsa') {
		this.rsa.decrypt(msg, function(err, decryptedMsg) {
			callback(err, decryptedMsg);
		});
	}
};

function checkMissingOptions(options, callback)
{
	if (!options || !options.type) {
		callback(new Error("Invalid options.type specified"));
		return true;
	}

	return false;
}


module.exports = CryptoProvider;