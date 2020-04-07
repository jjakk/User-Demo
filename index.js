const express = require('express');
const app = express();
const port = process.env.PORT || 8000;

let signInRouter = require('./routers/signIn.js');
let signUpRouter = require('./routers/signUp.js');

app.use('/signin', signInRouter);
app.use('/signup', signUpRouter);

app.set('view engine', 'pug');
app.set('views', './views');

app.listen(port, () => {
  console.log('Running on port ' + port);
});

app.get('/', (req, res) => {
  res.render('index');
});
