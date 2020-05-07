const router = require('express').Router();
const app = require('express')();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const User = require('../model/User');
const verify = require('./verifyToken');
const {registerValidation, loginValidation} = require('../validation.js');

app.use(cookieParser());

// Register
router.post('/register', async (req, res) => {
  // Validates the data before creating a user
  const {error} = registerValidation(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  // Checking if user is already in the database
  const emailExists = await User.findOne({email: req.body.email});
  if(emailExists) return res.status(400).send('Email already exists');

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // Creates a new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
  });
  try{
    const savedUser = await user.save();
    //res.send({user: user.id});
    res.redirect('/login');
  }
  catch(err){
    res.status(400).send(err);
  }

});

// Login
router.post('/login', async (req, res) => {
  // Validates the data before logging in a user
  const {error} = loginValidation(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  // Checking if user is already in the database
  const user = await User.findOne({email: req.body.email});
  if(!user) return res.status(400).send('Email not found');

  // Check if password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if(!validPass) return res.status(400).send('Invalid password');

  // Create and assign a token
  const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
  res.cookie('auth-token', token).redirect('/loggedIn');
  //res.header('auth-token', token).send(token);
});

router.post('/logout', (req, res) => {
  res.cookie('auth-token', '').redirect('/login');
});

router.post('/delete', verify, async (req, res) => {
  const token = req.cookies['auth-token'];
  try{
    // Checking if user is already in the database
    const user = await User.deleteOne({_id: req.user._id});
    if(!user) return res.status(400).send("User doesn't exits");
    res.cookie('auth-token', '').redirect('/');
  }
  catch(err){
    res.status(400).send(err);
  }
  res.send('ToDo');
});

module.exports = router;
