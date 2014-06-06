var sjcl = require('core-sjcl');

var toBits = sjcl.codec.bytes.toBits;
var toBytes = sjcl.codec.bytes.fromBits;

function wrap(fn) {
  return function () {
    var args = Array.prototype.slice.call(arguments);
    for (var i = 0; i < args.length; i++) {
      if (Buffer.isBuffer(args[i])) {
        args[i] = toBits(args[i]);
      }
    }
    return new Buffer(toBytes(fn.apply(null, args)));
  }
}

module.exports = wrap(function (password, salt) {
  return sjcl.misc.pbkdf2(password, salt, 2048, 512, function (key) {
    return new sjcl.misc.hmac(key, sjcl.hash.sha512);
  });
});
