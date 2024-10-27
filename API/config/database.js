const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
  host: process.env.MYSQL_HOST,
  dialect: 'mysql',
  port: process.env.MYSQL_PORT,
  logging: false, // Disable logging; default: console.log
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
    acquire: 30000,
  },
  timezone: '+00:00'
});

// Test the connection
const dbConnect = () => {
  sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    // sequelize.sync({force: true});
    // sequelize.sync();
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
}

module.exports = { sequelize, dbConnect };
