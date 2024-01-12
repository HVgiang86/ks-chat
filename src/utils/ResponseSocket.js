const {
    STATUS
} = require('../common/Socket')

function createResponseMessage(status, data) {

    return {
        status: status,
        message: data
    };
}

module.exports = {
    createResponseMessage
};