const { authJwt } = require("../middleware");
const controller = require("../controllers/users.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/test/all", controller.allAccess);

  app.get(
    "/test/user",
    [authJwt.verifyToken],
    controller.userBoard
  );

//Listado coins por moneda preferida  
app.get(
  "/list/coins",
 //[authJwt.verifyToken], 
  controller.coinList
);


//Agregar monedas a  favs
app.post(
  "/user/add/coins",
 // [authJwt.verifyToken], 
  controller.addFavCoins
);

//Listado monedas favoritas 
app.get(
  "/user/favlist/coins",
 // [authJwt.verifyToken], 
  controller.listFavCoins
);

//Borrar monedas de la lista de fav 
app.delete(
  "/user/favdelete/coins",
 // [authJwt.verifyToken], 
  controller.delFavCoins
);

//Update valores de precio y última actualización 
app.put(
  "/user/favupdate/coins",
 // [authJwt.verifyToken], 
  controller.updateFavCoins
);

};