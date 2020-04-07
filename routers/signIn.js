const express = require('express');
const app = express();

let signInRouter = express.Router();

app.set('view engine', 'pug');
app.set('views', '../views');

signInRouter.get('/', (req, res) => {
  res.render('signIn');
});

module.exports = signInRouter;
