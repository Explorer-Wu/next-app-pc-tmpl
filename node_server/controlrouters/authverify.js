const fs = require('fs');
const jwt = require('jsonwebtoken');
const userdb = JSON.parse(fs.readFileSync(__dirname + '/users.json', 'UTF-8'))

const SECRET_KEY = 'testJwt' //撒盐：加密的时候混淆
const expiresIn = '1h'

// Create a token from a payload 
exports.createToken = function(payload){
  return jwt.sign(payload, SECRET_KEY, {expiresIn})
}

// Verify the token 
exports.verifyToken = function(token){
  return  jwt.verify(token, SECRET_KEY, (err, decode) => decode !== undefined ?  decode : err)
}

// Check if the user exists in database
exports.isAuthorized = function({username, password}){
  return userdb.users.findIndex(user => user.username === username && user.password === password) !== -1
}