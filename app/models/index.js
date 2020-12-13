const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    pool: {
    logging: console.log, // set to console.log to see the raw SQL queries
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./Users.js")(sequelize, Sequelize);
db.prefCurrencyUserList = require("./PrefCurrencyUserList.js")(sequelize, Sequelize);
db.favoritesCoinsUsers = require("./FavoritesCoinsUsers")(sequelize, Sequelize);

//Acá van las relaciones



module.exports = db;