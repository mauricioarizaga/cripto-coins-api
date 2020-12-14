const db = require("../models");
const User = db.user;

checkDuplicateEmail = (req, res, next) => {
    const {email} =req.body
    // Verificamos Email no exista
    User.findOne({
      where: {
        email: email
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