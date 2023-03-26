const crypto = require("crypto");

const csrfSecret = crypto.randomBytes(64).toString("hex");

exports.getCsrfSecret = () => {
    return csrfSecret;
}