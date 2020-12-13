const FavoritesUsersCoins = (sequelize, S) => {
    const F = sequelize.define(
      "favuserscoins",
      {
        favIdUser: {
          type: S.INTEGER,
          allowNull: false,
        },
        favCoinId: {
          type: S.STRING,
          allowNull: false,
        },
        favCoinSymbol: {
            type: S.STRING,
            allowNull: false,
        },
        favCoinValue: {
            type: S.DECIMAL(40, 2),
            allowNull: false,
            validate: {
              min: 0,
            },
          },
          favCoinName: {
            type: S.STRING,
            allowNull: false,
            
          },
          favCoinImage: {
            type: S.STRING,
            allowNull: false,
          },
          favCoinLastUpdate: {
            type: S.DATEONLY,
            allowNull: true,
            validate: {
              isDate: true,
            },
          },
      },
      {
        timestamps: false,
      }
    );
  
    return F;
  };
  
  module.exports = FavoritesUsersCoins;