// eslint-disable-next-line @typescript-eslint/no-require-imports
const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  development: {
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
    host: process.env.DB_HOST || 'localhost',
    username: process.env.DB_USERNAME || 'default_user',
    password: process.env.DB_PASSWORD || 'default_password',
    database: process.env.DB_NAME_DB || 'default_db',
  },
  test: {
    port: process.env.DB_PORT || 3306,
    host: process.env.DB_HOST || 'localhost',
    username: process.env.DB_USERNAME || 'default_user',
    password: process.env.DB_PASSWORD || 'default_password',
    database: process.env.DB_NAME_DB || 'default_db',
    dialect: 'mysql',
  },
  production: {
    port: process.env.DB_PORT || 3306,
    host: process.env.DB_HOST || 'localhost',
    username: process.env.DB_USERNAME || 'default_user',
    password: process.env.DB_PASSWORD || 'default_password',
    database: process.env.DB_NAME_DB || 'default_db',
    dialect: 'mysql',
    dialectOptions: {
      ssl: process.env.DB_SSL ? { rejectUnauthorized: false } : false, // For secure DB connection in production
    },
  },
};
