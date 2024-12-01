const { Sequelize } = require('sequelize');

const dotenv = require('dotenv');
dotenv.config({ path: 'api/config/config.env' });

const sequelize = new Sequelize(process.env.DATABASE_URI, {
    dialect: 'mariadb',
    dialectOptions: {
      charset: 'utf8mb4',
    },
});

sequelize
.authenticate()
.then(() => {
console.log('Connection to database has been established successfully.');
})
.catch((err) => {
console.error('Unable to connect to the database:', err);
});
  
module.exports = sequelize;