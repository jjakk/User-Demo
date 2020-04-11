const express = require('express');
const app = express();

let signUpRouter = express.Router();

app.set('view engine', 'pug');
app.set('views', '../views');

signUpRouter.get('/', (req, res) => {
  res.render('signUp');
});

signUpRouter.post('/', (req, res) => {
  res.redirect('/');
});

module.exports = signUpRouter;
