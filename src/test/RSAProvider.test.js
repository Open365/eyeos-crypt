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
var RSAProvider = require('../lib/providers/RSAProvider');
var RSAKeysHolder = require('../lib/providers/RSAKeysHolder');

suite('RSAProvider', function(){
	var sut;

	var publicKey, privateKey;
	var publicKeyStub;

	var options = {};
	var msg = "some random string";
	var callback;
	var rsaKeysHolder, rsaKeysHolderStub;

	setup(function(){
		callback = sinon.spy();

		publicKey = {
			encrypt: function(){}
		};

		privateKey = {
			decrypt: function(){}
		};

		publicKeyStub = sinon.stub(publicKey);
		sinon.stub(privateKey);

		rsaKeysHolder = new RSAKeysHolder();
		rsaKeysHolderStub = sinon.stub(rsaKeysHolder);

		sut = new RSAProvider(options, rsaKeysHolder);
	});

	suite('#encrypt', function(){
		test('Should call rsaKeysHolder.publicKey and pass a callback', function(){
			sut.encrypt(msg, callback);
			sinon.assert.calledWithExactly(rsaKeysHolderStub.publicKey, sinon.match.func);
		});

		test('Should forward the error to callback if any', function () {
			var error = new Error('Keys are not available');
			rsaKeysHolderStub.publicKey.yields(error);
			sut.encrypt(msg, callback);

			sinon.assert.calledWithExactly(callback, error);
		});

		test('Should call publicKey.encrypt forwarding the msg', function () {
			rsaKeysHolderStub.publicKey.yields(false, publicKey);
			sut.encrypt(msg, callback);

			sinon.assert.calledWith(publicKey.encrypt, msg);
		});

		test('Should call the callback with the returned value from publicKey.encrypt', function () {
			var crypt = "crypted data";
			rsaKeysHolderStub.publicKey.yields(false, publicKey);
			publicKey.encrypt.returns(crypt);
			sut.encrypt(msg, callback);

			sinon.assert.calledWithExactly(callback, false, crypt);
		});
	});

	suite('#decrypt', function(){
		test('Should call rsaKeysHolder.privateKey and pass a callback', function(){
			sut.decrypt(msg, callback);
			sinon.assert.calledWithExactly(rsaKeysHolderStub.privateKey, sinon.match.func);
		});

		test('Should forward the error to callback if any', function () {
			var error = new Error('Keys are not available');
			rsaKeysHolderStub.privateKey.yields(error);
			sut.decrypt(msg, callback);

			sinon.assert.calledWithExactly(callback, error);
		});

		test('Should call privateKey.decrypt forwarding the msg', function () {
			rsaKeysHolderStub.privateKey.yields(false, privateKey);
			sut.decrypt(msg, callback);

			sinon.assert.calledWith(privateKey.decrypt, msg);
		});

		test('Should call the callback with the returned value from privateKey.decrypt', function () {
			var decryptedData = "decrypted data";
			rsaKeysHolderStub.privateKey.yields(false, privateKey);
			privateKey.decrypt.returns(decryptedData);
			sut.decrypt(msg, callback);

			sinon.assert.calledWithExactly(callback, false, decryptedData);
		});
	});
});