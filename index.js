const express = require('express');
const dotenv = require('dotenv');
const app = express();
const port = process.env.PORT || 8000;
const mongoose = require('mongoose');
// Import Routes
const authRouter = require('./routers/auth.js');

dotenv.config();

// Connect to DB
mongoose.connect(
  'mongodb://localhost:27017/mydb',
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

app.listen(port, () => {
  console.log('Running on port ' + port);
});
