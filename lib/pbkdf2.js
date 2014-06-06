var hmacsha512 = require('core-hash').hmacsha512;

// Node > 11.x allows specifying the hash function for pbkdf2
module.exports = function (password, salt) {
  var iterations = 2048;
  if (typeof salt === 'string') {
    salt = new Buffer(salt);
  }
  if (typeof password === 'string') {
    password = new Buffer(password);
  }

  var dkLen = 64;
  var hLen = 64;

  var DK = new Buffer(dkLen);

  var U;
  var T = new Buffer(hLen);
  var block = new Buffer(salt.length + 4);

  var l = Math.ceil(dkLen / hLen);
  var r = dkLen - (l - 1) * hLen;

  salt.copy(block, 0, 0, salt.length);
  for (var i = 1; i <= l; i++) {
    block.writeUInt32BE(i, salt.length)

    U = hmacsha512(password, block);

    U.copy(T, 0, 0, hLen);

    for (var j = 1; j < iterations; j++) {
      U = hmacsha512(password, U);

      for (var k = 0; k < hLen; k++) {
        T[k] ^= U[k];
      }
    }

    var destPos = (i - 1) * hLen;
    var len = (i == l ? r : hLen)
    T.copy(DK, destPos, 0, len);
  }

  return DK;
}
