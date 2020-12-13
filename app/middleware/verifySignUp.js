const db = require("../models");
const User = db.user;

checkDuplicateEmail = (req, res, next) => {
    // Verificamos Email no exista
    console.log(req.body, "username")
    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(user => {
      if (user) {
        res.status(400).send({
          message: "Error. Este mail ya está en uso"
        });
        return;
      }
      next();
    });
  
};

const verifySignUp = {
  checkDuplicateEmail: checkDuplicateEmail,
};

module.exports = verifySignUp;