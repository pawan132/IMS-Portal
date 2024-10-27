const bcrypt = require("bcryptjs");
require('dotenv-flow').config();

exports.createPasswordHash = async (password) => {
    const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
    const hashedPassword = await bcrypt.hash(password, salt);

    return { hashedPassword, salt };
}