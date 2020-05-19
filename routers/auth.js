const router = require('express').Router();
const app = require('express')();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
const async = require('async');
var crypto = require("crypto");
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
  res.cookie('auth-token', token).redirect('/home');
  //res.header('auth-token', token).send(token);
});

// Logout
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

// Sends Password Reset Email
router.post('/forgotPassword', (req, res) => {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          console.log('No account with that email address exists.');
          return res.redirect('/forgotPassword');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000;

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'noreply.jakinventions@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'noreply.jakinventions@gmail.com',
        subject: 'Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        console.log('An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) res.send(err);
    res.redirect('/');
  });
});


router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, async function(err, user) {
        if (!user) {
          console.log('Password reset token is invalid or has expired.');
          return res.redirect('/');
        }
        if(req.body.password === req.body.confirm) {
          // Hash the new password
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(req.body.password, salt);

          user.password = hashedPassword;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;

          user.save(function(err) {
            done(err, user);
          });
        }
        else {
            console.log("Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'noreply.jakinventions@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'noreply.jakinventions@gmail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/');
  });
});

module.exports = router;
