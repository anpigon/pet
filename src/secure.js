import sjcl from 'sjcl';

function encryptData(pData, pKey) {
  if (!pData || !pKey) return null;
  const key = sjcl.codec.base64.toBits(pKey);
  const salt = sjcl.random.randomWords('4', '0');
  return sjcl.encrypt(key, pData, { ks: 256, iter: 10000, salt });
}

function decryptData(pData, pKey) {
  if (!pData || !pKey) return null;
  const key = sjcl.codec.base64.toBits(pKey);
  return sjcl.decrypt(key, pData);
}

function stringToAsciiByteArray(str) {
  const bytes = [];
  for (let i = 0; i < str.length; ++i) {
    const charCode = str.charCodeAt(i);
    if (charCode > 0xFF) { // char > 1 byte since charCodeAt returns the UTF-16 value
      throw new Error(`Character ${String.fromCharCode(charCode)} can't be represented by a US-ASCII byte.`);
    }
    bytes.push(charCode);
  }
  return bytes;
}

function stringToUtf16ByteArray(str) {
  const bytes = [];
  // currently the function returns without BOM. Uncomment the next line to change that.
  // bytes.push(254, 255);  //Big Endian Byte Order Marks
  for (let i = 0; i < str.length; ++i) {
    const charCode = str.charCodeAt(i);
    // char > 2 bytes is impossible since charCodeAt can only return 2 bytes
    bytes.push((charCode & 0xFF00) >>> 8); // high byte (might be 0)
    bytes.push(charCode & 0xFF); // low byte
  }
  return bytes;
}

function stringToUtf32ByteArray(str) {
  const bytes = [];
  // currently the function returns without BOM. Uncomment the next line to change that.
  // bytes.push(0, 0, 254, 255);  //Big Endian Byte Order Marks
  for (let i = 0; i < str.length; i += 2) {
    const charPoint = str.codePointAt(i);
    // char > 4 bytes is impossible since codePointAt can only return 4 bytes
    bytes.push((charPoint & 0xFF000000) >>> 24);
    bytes.push((charPoint & 0xFF0000) >>> 16);
    bytes.push((charPoint & 0xFF00) >>> 8);
    bytes.push(charPoint & 0xFF);
  }
  return bytes;
}

String.prototype.encodeHex = function () {
  // return this.split('').map(e => e.charCodeAt())
  const bytes = [];
  for (let i = 0; i < this.length; ++i) {
    bytes.push(this.charCodeAt(i));
  }
  return bytes;
};

Array.prototype.decodeHex = function () {
  // return this.map(e => String.fromCharCode(e)).join('')
  const str = [];
  const hex = this.toString().split(',');
  for (let i = 0; i < hex.length; i++) {
    str.push(String.fromCharCode(hex[i]));
  }
  return str.toString().replace(/,/g, '');
};

/**
 * var str = "Hello World!";
 * var bytes = str.getBytes();
 */
// String.prototype.getBytes = function () {
//   let bytes = [];
//   for (var i = 0; i < this.length; ++i) {
//     bytes.push(this.charCodeAt(i));
//   }
//   return bytes;
// };
String.prototype.getBytes = function () {
  const bytes = [];
  for (let i = 0; i < this.length; i++) {
    const charCode = this.charCodeAt(i);
    const cLen = Math.ceil(Math.log(charCode) / Math.log(256));
    for (let j = 0; j < cLen; j++) {
      bytes.push((charCode << (j * 8)) & 0xFF);
    }
  }
  return bytes;
};

export default {
  encryptData,
  decryptData,
  stringToAsciiByteArray,
  stringToUtf16ByteArray,
  stringToUtf32ByteArray,
};
