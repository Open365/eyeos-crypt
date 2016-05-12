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
var sinon = require('sinon');
var assert = require('chai').assert;
var RSAKeysHolder = require('../lib/providers/RSAKeysHolder');

suite('RSAKeysHolder', function(){
	var sut;

	var fsStub;
	var callback;
	var options;
	setup(function(){
		options = {
			rsa: {
				public: "/public/key/path",
				private: "/private/key/path"
			}
		};
		sinon.stub(fs, 'readFile');
		sinon.stub(ursa, 'createPublicKey');
		sinon.stub(ursa, 'createPrivateKey');

		callback = sinon.spy();
		sut = new RSAKeysHolder(options);
	});

	teardown(function() {
		fs.readFile.restore();
		ursa.createPublicKey.restore();
		ursa.createPrivateKey.restore();
	});

	suite('#publicKey', function(){
		test('Should run callback directly when this.public does not evaluate to false', function(){
			sut.public = "super key";
			sut.publicKey(callback);
			sinon.assert.calledWithExactly(callback, false, sut.public);
		});

		test('Should run callback passing an Error if rsa key is not found in options', function () {
			sut.options.rsa.public = false;
			sut.publicKey(callback);
			sinon.assert.calledWithExactly(callback, new Error());
		});

		test('Should call fs.readFile with the path from options', function () {
			sut.publicKey(callback);
			sinon.assert.calledWith(fs.readFile, options.rsa.public);
		});

		test('On fs.readFile callback if error we should forward it', function () {
			var error = new Error('Made out error');
			fs.readFile.yields(error);
			sut.publicKey(callback);
			assert.equal(callback.args[0][0].message, error.message, "Error thrown by readfile should be received");
		});

		test('Once fs.readFile is done, we should call ursa.createPublicKey passing the data', function () {
			var keyData = "some data";
			fs.readFile.yields(false, keyData);
			sut.publicKey(callback);

			sinon.assert.calledWithExactly(ursa.createPublicKey, keyData);
		});

		test('ursa.createPublicKey returned value should be saved in this.public', function () {
			var publicUrsaKey = {foo: 'bar'};
			fs.readFile.yields(false, "");
			ursa.createPublicKey.returns(publicUrsaKey);
			sut.publicKey(callback);

			assert.deepEqual(sut.public, publicUrsaKey, "value returned by createPublicKey should be saved");
		});

		test('Should call callback with the result of createPublcKey', function () {
			var publicUrsaKey = {foo: 'bar'};
			fs.readFile.yields(false, "");
			ursa.createPublicKey.returns(publicUrsaKey);
			sut.publicKey(callback);

			sinon.assert.calledWithExactly(callback, false, publicUrsaKey);
		});
	});

	suite('#privateKey', function(){
		test('Should run callback directly when this.private does not evaluate to false', function(){
			sut.private = "super key";
			sut.privateKey(callback);
			sinon.assert.calledWithExactly(callback, false, sut.private);
		});

		test('Should run callback passing an Error if rsa key is not found in options', function () {
			sut.options.rsa.private = false;
			sut.privateKey(callback);
			sinon.assert.calledWithExactly(callback, new Error());
		});

		test('Should call fs.readFile with the path from options', function () {
			sut.privateKey(callback);
			sinon.assert.calledWith(fs.readFile, options.rsa.private);
		});

		test('On fs.readFile callback if error we should forward it', function () {
			var error = new Error('Made out error');
			fs.readFile.yields(error);
			sut.privateKey(callback);
			assert.equal(callback.args[0][0].message, error.message, "Error thrown by readfile should be received");
		});

		test('Once fs.readFile is done, we should call ursa.createPrivateKey passing the data', function () {
			var keyData = "some data";
			fs.readFile.yields(false, keyData);
			sut.privateKey(callback);

			sinon.assert.calledWithExactly(ursa.createPrivateKey, keyData);
		});

		test('ursa.createPrivateKey returned value should be saved in this.public', function () {
			var privateUrsaKey = {foo: 'bar'};
			fs.readFile.yields(false, "");
			ursa.createPrivateKey.returns(privateUrsaKey);
			sut.privateKey(callback);

			assert.deepEqual(sut.private, privateUrsaKey, "value returned by createPrivateKey should be saved");
		});

		test('Should call callback with the result of createPublcKey', function () {
			var privateUrsaKey = {foo: 'bar'};
			fs.readFile.yields(false, "");
			ursa.createPrivateKey.returns(privateUrsaKey);
			sut.privateKey(callback);

			sinon.assert.calledWithExactly(callback, false, privateUrsaKey);
		});
	});
});