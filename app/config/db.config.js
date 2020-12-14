module.exports = {
    HOST: "localhost",
    USER: "postgres",
    PASSWORD: "postgres",
    DB: "wolox",
    dialect: "postgres",
    pool: {
      max: 20,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };