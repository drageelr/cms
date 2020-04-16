'use strict'
/*
  ------------------ DEPENDENCIES --------------------
*/

// Models:
var Society = require('../models/society.model');

// Services:
var jwt = require('../services/jwt');

// Others:
var customError = require('../errors/errors');

/*
  ------------------ CODE BODY --------------------
*/

/*
  <<<<< EXPORT FUNCTIONS >>>>>
*/

/**
 * Logins the society if correct combination of "email" and password
 * is supplied in req.body object. Sends a response back with a jwt
 * token and user object containing user data.
 */
exports.societyLogin = async (req, res, next) => {
  // Variables:
  let params = req.body;

  try {
    let reqSociety = await Society.findOne({email: params.email, password: params.password}, '_id id name nameInitials presidentEmail patronEmail');
    if (reqSociety) {
      let token = jwt.signID(reqSociety._id, "12h");
      res.json({
        status: 200,
        message: "Login successful!",
        token: token,
        user: {
          id: reqSociety.id,
          name: reqSociety.name,
          nameInitials: reqSociety.nameInitials,
          patronEmail: reqSociety.patronEmail,
          presidentEmail: reqSociety.presidentEmail
        }
      });
    }
  } catch(err) {
    next(err);
  }
}