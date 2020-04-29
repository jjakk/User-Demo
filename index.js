const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 8000;
const mongoose = require('mongoose');
const verify = require('./routers/verifyToken');
// Import Routes
const authRouter = require('./routers/auth.js');
const postRouter = require('./routers/posts.js');
const loggedInRouter = require('./routers/loggedIn.js');
const loginRouter = require('./routers/login.js');
const registerRouter = require('./routers/register.js');

dotenv.config();

// Connect to DB
mongoose.connect(
  'mongodb://localhost:27017/userdb',
  {
    useUnifiedTopology: true,
    useNewUrlParser: true
  }
);

// App settings
app.set('view engine', 'pug');
app.set('views', './views');

// Middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

// Router Middlewares
app.use('/api/user', authRouter);
app.use('/api/posts', postRouter);
app.use('/loggedIn', loggedInRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);

app.get('/', (req, res) => {
  res.redirect('/login');
});

app.listen(port, () => {
  console.log('Running on port ' + port);
});
