const { Sequelize } = require('sequelize');
const { initializeMockDatabase } = require('../data/mockDatabase.js');
const { defineUser } = require('../models/user.js');

let sequelize;
let models = {};

const initializeDatabase = async () => {
  if (process.env.USE_DATABASE === 'true') {
    if (!sequelize) {
      console.log('Initializing database connection with:', {
        name: process.env.DB_NAME,
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT
      });

      sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
          host: process.env.DB_HOST,
          port: process.env.DB_PORT,
          dialect: 'postgres',
          logging: console.log,
          dialectOptions: {
            ssl: {
              require: true,
              rejectUnauthorized: false
            }
          },
          pool: {
            max: 2,
            min: 0,
            acquire: 30000,
            idle: 10000
          }
        }
      );

      try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');

        // Define models
        models.User = defineUser(sequelize);

        // Sincroniza o modelo com o banco de dados
        await sequelize.sync();
        console.log('Database synchronized successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
        throw error;
      }
    }

    return models;
  } else {
    console.log('Using mock database');
    return initializeMockDatabase();
  }
};

module.exports = {
  initializeDatabase
};
