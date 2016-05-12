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

var sinon = require('sinon');
var assert = require('chai').assert;
var EyeCrypt = require('../lib/EyeCrypt');
var CryptoProvider = require('../lib/providers/CryptoProvider');

suite('EyeCrypt', function(){
	var sut;

	var msg = "random string";
	var options = {some: "option"};
	var callback;

	var cryptoProvider, cryptoProviderStub;

	setup(function(){
		callback = sinon.spy();

		cryptoProvider = new CryptoProvider();
		cryptoProviderStub = sinon.stub(cryptoProvider);

		sut = new EyeCrypt(options, cryptoProvider);
	});

	suite('#encrypt', function(){
		test('Should forward to cryptoProvider the entire call', function(){
			sut.encrypt(msg, callback);
			sinon.assert.calledWithExactly(cryptoProviderStub.encrypt, msg, sinon.match.func);
		});
		test('When encrypt finishes, passed callback should be called forwarding arguments', function () {
			var encryptedStuff = "encrypted stuff";
			cryptoProviderStub.encrypt.yields(false, encryptedStuff);
			sut.encrypt(msg, callback);

			sinon.assert.calledWithExactly(callback, false, encryptedStuff);
		});
	});

	suite('#decrypt', function(){
		test('Should forward to cryptoProvider.decrypt the entire call', function(){
			sut.decrypt(msg, callback);
			sinon.assert.calledWithExactly(cryptoProviderStub.decrypt, msg, sinon.match.func);
		});

		test('When decrypt finishes, passed callback should be called forwarding arguments', function () {
			var decryptedStuff = "decrypted stuff";
			cryptoProviderStub.decrypt.yields(false, decryptedStuff);
			sut.decrypt(msg, callback);

			sinon.assert.calledWithExactly(callback, false, decryptedStuff);
		});
	});
});