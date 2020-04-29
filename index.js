const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 8000;
const mongoose = require('mongoose');
// Import Routes
const authRouter = require('./routers/auth.js');
const postRouter = require('./routers/posts.js')

dotenv.config();

// Connect to DB
mongoose.connect(
  'mongodb://localhost:27017/userdb',
  {
    useUnifiedTopology: true,
    useNewUrlParser: true
  },
  () => {
    console.log('connected to DB');
});

// App settings
app.set('view engine', 'pug');
app.set('views', './views');

// Middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}))

// Router Middlewares
app.use('/api/user', authRouter);
app.use('/api/posts', postRouter);

app.get('/', (req, res) => {
  res.render('login');
});

app.listen(port, () => {
  console.log('Running on port ' + port);
});
