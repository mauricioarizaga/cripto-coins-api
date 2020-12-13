const Users = (sequelize, S) => {

  // defino el modelo Usuarios

  const U = sequelize.define(
    "users",
    {
      firstName: {
        type: S.STRING,
        allowNull: false,
      },
      lastName: {
        type: S.STRING,
        allowNull: false,
      },
      password: {
        type: S.STRING,
        allowNull: false,
        validate: {
          min: 8,
        },
      },
      email: {
        type: S.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      preferedCurrency: {
        type: S.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
    },
    {
      timestamps: false,
    }
  );

  return U;
};

module.exports = Users;
