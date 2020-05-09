const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 8000;
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/userdb';
const mongoose = require('mongoose');
const verify = require('./routers/verifyToken');
// Import Routes
const authRouter = require('./routers/auth.js');
const uiRouter = require('./routers/ui.js');

dotenv.config();

// Connect to DB
mongoose.connect(
  mongoURI,
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
app.use(cookieParser());

// Router Middlewares
app.use('/api/user', authRouter);
app.use(uiRouter);

app.get('/', (req, res) => {
  const token = req.cookies['auth-token'];
  if(!token) return res.redirect('/login');
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    res.redirect('/home');
  }
  catch (e) {
    res.redirect('/login');
  }
});

app.listen(port, () => {
  console.log('Running on port ' + port);
});
