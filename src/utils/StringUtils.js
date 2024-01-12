const crypto = require('crypto');

const md5Hash = (input) => {
    const hash = crypto.createHash('md5');
    hash.update(input);
    const hashedValue = hash.digest('hex');
    return hashedValue;
}

module.exports = { md5Hash };