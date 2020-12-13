const axios =require("axios");
const db = require("../models");
const FavUserCoins = db.favoritesCoinsUsers;
const Users = db.user;
const PrefCurrencyList = db.prefCurrencyUserList;
exports.allAccess = (req, res) => {
    res.status(200).send("Acceso para invitados.");
  };
  
  exports.userBoard = (req, res) => {
    res.status(200).send("Acceso solo para usuarios.");
  };
  //Listado de monedas
  exports.coinList = (req, res) => {
   const { preferedCurrencyisoName } = req.body;  
   if(preferedCurrencyisoName.length !== 3){
    res.send({message: "Error. La moneda no ha sido leido correctamente"});
   }
   axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency='+ preferedCurrencyisoName).then(response =>{   
    res.send(response.data);
   }).catch(err =>{
    res.status(500).res.json({mensaje:err});
   })
  };

//Agregar monedas desde listado 
  exports.addFavCoins= async (req, res) => {
    const {idUser, id, symbol, current_price, name, image, last_updated } = req.body;
    const duplicateCoins = await FavUserCoins.findOne({
      where: {
        favIdUser:idUser,
        favCoinId: id,
      },
    });
    const userExists = await Users.findOne({
      where: {
        id: idUser,
      },
    });
    if(!duplicateCoins && userExists){
      return FavUserCoins.create({
        favIdUser: idUser,
        favCoinId: id,
        favCoinSymbol: symbol,
        favCoinValue: current_price,
        favCoinName: name,
        favCoinImage: image,
        favCoinLastUpdate: last_updated
      }).then((response) => {
        return res.status(200).json(response);
      }).catch(err =>{
        res.status(500).res.json({mensaje:err});
       });
    } else if(!userExists) {
      return res.send({message: "Error. Este usuario no existe"});
      
    } else{
      return res.send({message: "Error. Esta moneda ya ha sido agregada"});
    }
  };

//Listar monedas favoritas de un usuario 
exports.listFavCoins= async (req, res) => {
  let sortMarketPrice=[];
  const {idUser, num, orderName} = req.body;
  
  await FavUserCoins.findAll({
    where: {
      favIdUser: idUser,
    },
  }).then(async response =>{ 
  //Darle formato a la url para hacer la request a la api  
  let url ="https://api.coingecko.com/api/v3/simple/price?ids=";    
  for(i=0;i<response.length;i++){
    if(i==0){
   url= url+response[i].favCoinId
    }else{
      url= url+","+response[i].favCoinId 
    }
  }
  url =url+"&vs_currencies=";
  const listAllCurrency = await PrefCurrencyList.findAll();
  for(i=0;i<listAllCurrency.length;i++){
    if(i==0){
   url= url+listAllCurrency[i].isoName
    }else{
      url= url+","+listAllCurrency[i].isoName 
    }
  }
//final formato url - Consulta API
 const coinValues = await axios.get(url);

 //Guarda las propiedades del objeto como array
 const arrayProperties = Object.keys(coinValues.data)

 //Agrega a cada favorito el valor de mercado de las monedas preferidas
 for(i=0; i<response.length; i++){
  for(j=0; j<arrayProperties.length; j++){
    if(arrayProperties[j]==response[i].favCoinId){  
      response[i].dataValues.OtherCurrencyValuesUpdated = coinValues.data[arrayProperties[j]]
  }
}
 }

//Ordena Array por el valor de mercado de las monedas

switch(orderName){
  case "asc":
  sortMarketPrice = response.sort((a, b) => {
    function getValue(v) {
      return parseFloat(v.replace('.', '').replace(',', '.'));
  }
 if (getValue(a.favCoinValue) > getValue(b.favCoinValue)) return 1;
 if (getValue(a.favCoinValue) < getValue(b.favCoinValue)) return -1;
 return 0
 });
    break;
  default:
  sortMarketPrice = response.sort((a, b) => {
      function getValue(v) {
        return parseFloat(v.replace('.', '').replace(',', '.'));
    }
   if (getValue(a.favCoinValue) < getValue(b.favCoinValue)) return 1;
   if (getValue(a.favCoinValue) > getValue(b.favCoinValue)) return -1;
   return 0
   });
      break;    
}

//Mostramos y controlamos num para mostrar el listado de fav coins
if(num<= 0 || typeof num !== "number"){
  return res.status(200).json(sortMarketPrice.slice(0,25)) 
}

if(sortMarketPrice.length>num && num <= 25 ){
return res.status(200).json(sortMarketPrice.slice(0,num));

}else if(sortMarketPrice.length<num && num <= 25){
return res.status(200).json(sortMarketPrice);

}else if(num>25){
return res.status(200).json(sortMarketPrice.slice(0,25));
}
}).catch(err =>{
  res.status(500).res.json({mensaje:err});
})
};

//Eliminar monedas desde listado 
exports.delFavCoins= async (req, res) => {
  const {idUser, id } = req.body;
   await FavUserCoins.destroy({
     where:{
      favIdUser: idUser,
      favCoinId: id
    },
    }).then((response) => {
      if(response==0){
      return res.json({messagge:"Error!!. La moneda no ha sido borrada o no existe en el listado" });
      } else {
      return res.json({messagge:"La moneda ha sido borrada de tu lista." });
      }
    }).catch(err =>{
      res.status(500).res.json({mensaje:err});
     });
};

//Actualizar precios y fecha última actualización 
exports.updateFavCoins= async (req, res) => {
  const {idUser, id , preferedCurrencyisoName } = req.body;
  const dataUpdated = await axios.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency="+preferedCurrencyisoName+"&ids="+id)
  
 
  FavUserCoins.update({
    favCoinValue: dataUpdated.data[0].current_price,
    favCoinLastUpdate: dataUpdated.data[0].last_updated
  }, {
    where: {
      favIdUser: idUser,
      favCoinId: id
    },
  }).then((response) => {
      if(response==1){
      return res.json({mensaje: "El precio de la moneda y su última fecha de cambio se ha actualizado correctamente"})
    }else{
      return res.json({messagge:"Error!!. El precio de la moneda y su última fecha de cambio NO se ha actualizado." });      
    }    }).catch(err =>{
      res.status(500).res.json({mensaje:err});
     });
};
