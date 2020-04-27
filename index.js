const express = require('express');
const dotenv = require('dotenv');
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

// Middlewares
app.use(express.json());

// Router Middlewares
app.use('/api/user', authRouter);
app.use('/api/posts', postRouter);

app.listen(port, () => {
  console.log('Running on port ' + port);
});
