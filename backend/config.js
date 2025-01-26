const dotenv = require("dotenv");

dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

module.exports = {
    PORT: process.env.PORT,
    DB_NAME: process.env.DB_NAME,
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY
}