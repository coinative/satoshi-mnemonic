var mnemonic = require('../');

var hex = function (hex) { return new Buffer(hex, 'hex'); };

var vectors = require('./fixtures/vectors.json').english;

describe('core-mnemonic', function () {
  describe('encode', function () {
    it('entropy must be at least 4 bytes', function () {
      expect(function () { mnemonic.encode(new Buffer(1)); }).to.throw();
      expect(function () { mnemonic.encode(new Buffer(3)); }).to.throw();
    });

    it('entropy must be multiple of 4 bytes', function () {
      expect(function () { mnemonic.encode(new Buffer(5)); }).to.throw();
      expect(function () { mnemonic.encode(new Buffer(9)); }).to.throw();
      expect(function () { mnemonic.encode(new Buffer(13)); }).to.throw();
    });

    vectors.forEach(function (vector) {
      it('should correctly encode ' + vector[0], function () {
        expect(mnemonic.encode(hex(vector[0])).join(' '))
          .to.equal(vector[1]);
      });
    });
  });

  describe('decode', function () {
    vectors.forEach(function (vector) {
      it('should correctly decode ' + vector[1], function () {
        expect(mnemonic.decode(vector[1].split(' ')).toString('hex'))
          .to.equal(vector[0]);
      });
    });
  });

  describe('toSeed', function () {
    vectors.forEach(function (vector) {
      it('should generate correct seed of ' + vector[1], function () {
        expect(mnemonic.toSeed(vector[1].split(' '), 'TREZOR').toString('hex'))
          .to.equal(vector[2]);
      });
    });
  });

  describe('check', function () {
    it('should return false on failed checksum', function () {
      expect(mnemonic.check('abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about'.split(' ')))
        .to.be.true;
      expect(mnemonic.check('abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon able'.split(' ')))
        .to.be.false;
    });
  });
});
