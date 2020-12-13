const db = require("../models");
const config = require("../config/auth.config");
const Users = db.user;
const CurrencyList = db.favCurrencyUser;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.signup = async (req, res) => {
  // Guardar User en la db
  const { firstName,lastName,email,password,preferedCurrency} = req.body;
  const regExpPass = /^(?=\w*\d)(?=\w*[0-9])(?=\w*[a-z])\S{8,}$/; //Setea el regExp para las contraseñas

  if(password.match(regExpPass)){
    const hashedPassword = await bcrypt.hash(password, 10);
    Users.create({
    email,
    password: hashedPassword,
    firstName,
    lastName,
    preferedCurrency
  }).then((user) => {
    return res.json(user);
  }).catch((err) => {
      if (err.original) res.send(err.original.detail);
      else res.send("Error de validación de datos");
    });
  }else{
    res.send("Error de validación de datos. El password tiene que contener números, letras y un mínimo de 8 caracteres");
  }
};

exports.signin = (req, res) => {

  const {
        email,
        password
    } = req.body;
//busca el user
   Users.findOne({
    where: {
      email: email
    }
  })
    .then(async user => {

const currency = await CurrencyList.findOne({
  where: {
    id: user.dataValues.preferedCurrency
  }
})
if(currency){
      if (!user) {
        return res.status(404).send({ message: "Este usuario no existe" });
      }
      const passwordIsValid = bcrypt.compareSync(password,user.dataValues.password);
      
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Password incorrecto!!!"
        });
      }
      const token = jwt.sign({ id: user.dataValues.id }, config.secret, {
        expiresIn: 3600 // 1 hora
      });

      res.status(200).send({
        idUser: user.dataValues.id,
        username: user.dataValues.email,
        preferedCurrency: user.dataValues.preferedCurrency,
        preferedCurrencyisoName: currency.dataValues.isoName, //Se podria incluir cualquier otro valor de la tabla o todos los valores
        accessToken: token
      });
    }else{
      return res.status(404).send({ message: "Error. Esta moneda no existe." });
    }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};