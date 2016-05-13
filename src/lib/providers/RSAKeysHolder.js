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

var fs = require('fs');
var ursa = require('ursa');

var RSAKeysHolder = function(options) {
	this.options = options;
	this.public = null;
	this.private = null;
};

RSAKeysHolder.prototype.publicKey = function(callback) {
	if (this.public) {
		callback(false, this.public);
		return;
	}

	if (process.env.EYEOS_CRYPT_PWD_PUBLIC_KEY) {
		// public key is passed base64 encoded in the environment, so decode it
		try {
			this.public = ursa.createPublicKey(
				new Buffer(process.env.EYEOS_CRYPT_PWD_PUBLIC_KEY, 'base64').toString("utf-8")
			);
			return callback(false, this.public);
		} catch (e) {
			// key in envar isn't valid (not base64 as expected), fallback
			// to old method
		}
	}

	if (!this.options.rsa || !this.options.rsa.public) {
		callback(new Error("Can't find public key in options.rsa.public"));
		return;
	}

	var self = this;
	fs.readFile(this.options.rsa.public, null, function(err, data) {
		if (err) {
			callback(err);
			return;
		}

		self.public = ursa.createPublicKey(data);
		callback(false, self.public);
	});
};


RSAKeysHolder.prototype.privateKey = function(callback) {
	if (this.private) {
		callback(false, this.private);
		return;
	}

	if (process.env.EYEOS_CRYPT_PWD_PRIVATE_KEY) {
		// private key is passed base64 encoded in the environment, so decode it
		try {
			this.private = ursa.createPrivateKey(
				new Buffer(process.env.EYEOS_CRYPT_PWD_PRIVATE_KEY, 'base64').toString("utf-8")
			);
			return callback(false, this.private);
		} catch (e) {
			// key in envar isn't valid (not base64 as expected), fallback
			// to old method
		}
	}

	if (!this.options.rsa || !this.options.rsa.private) {
		callback(new Error("Can't find private key in options.rsa.private"));
		return;
	}

	var self = this;
	fs.readFile(this.options.rsa.private, null, function(err, data) {
		if (err) {
			callback(err);
			return;
		}

		self.private = ursa.createPrivateKey(data);
		callback(false, self.private);
	});
};

module.exports = RSAKeysHolder;
