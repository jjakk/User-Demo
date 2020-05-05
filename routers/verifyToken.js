const app = require('express')();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

app.use(cookieParser());

module.exports = function(req, res, next){
  //const token = req.header('auth-token');
  const token = req.cookies['auth-token'];
  if(!token) return res.redirect('/login');//res.status(401).send('Access Denied');
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  }
  catch (e) {
    //res.status(400).send('Invalid Token');
    res.redirect('/login');
  }
}
