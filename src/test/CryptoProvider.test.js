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
var CryptoProvider = require('../lib/providers/CryptoProvider');
var RSAProvider = require('../lib/providers/RSAProvider');

suite('CryptoProvider', function(){
	var sut;

	var msg = 'random string';
	var options;
	var callback;

	var rsa, rsaStub;

	setup(function(){
		options = {type: 'rsa'};
		callback = sinon.spy();

		rsa = new RSAProvider();
		rsaStub = sinon.stub(rsa);

		sut = new CryptoProvider(options, rsa);
	});

	suite('#encrypt', function(){
		test('If options.type is rsa, call should be forwarded to this.rsa', function(){
			sut.encrypt(msg, callback);
			sinon.assert.calledWithExactly(rsa.encrypt, msg, sinon.match.func);
		});

		test('When the provider finishes, callback should be called', function () {
			var encryptedMsg = 'encrypted random string';
			rsaStub.encrypt.yields(false, encryptedMsg);
			sut.encrypt(msg, callback);
			sinon.assert.calledWithExactly(callback, false, encryptedMsg);
		});

		test('If no type is specified, callback should be called with err', function () {
			options.type = '';
			sut.encrypt(msg, callback);
			sinon.assert.calledWithExactly(callback, new Error());
		});
	});

	suite('#decrypt', function(){
		test('If options.type is rsa, call should be forwarded to this.rsa', function(){
			sut.decrypt(msg, callback);
			sinon.assert.calledWithExactly(rsa.decrypt, msg, sinon.match.func);
		});

		test('When the provider finishes, callback should be called', function () {
			var decryptedMsg = 'decrypted random string';
			rsaStub.decrypt.yields(false, decryptedMsg);
			sut.decrypt(msg, callback);
			sinon.assert.calledWithExactly(callback, false, decryptedMsg);
		});

		test('If no type is specified, callback should be called with err', function () {
			options.type = '';
			sut.decrypt(msg, callback);
			sinon.assert.calledWithExactly(callback, new Error());
		});
	});
});