const FavCurrencyUser = (sequelize, S) => {

    // defino el modelo Listado de Monedas favoritas
  
    const FCU = sequelize.define(
      "favcurrencylist",
      {
        name: {
          type: S.STRING,
          allowNull: false,
        },
        country: {
          type: S.STRING,
          allowNull: false,
        },
        isoName: {
          type: S.STRING,
          allowNull: false,
         
        },
    },
    {
      timestamps: false,
    }
  );

  return FCU;
};
  
  module.exports = FavCurrencyUser;
  