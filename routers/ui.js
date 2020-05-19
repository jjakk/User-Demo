const router = require('express').Router();
const User = require('./../model/User.js');
const verify = require('./verifyToken');

router.get('/home', verify, async (req, res) => {
  const user = await User.findOne({_id: req.user._id});
  if(!user) return res.status(400).send('ID not found');
  res.render('home', {
    name: user.name
  });
})

router.get('/register', (req, res) => {
  res.render('register');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/forgotPassword', (req, res) => {
  res.render('forgotPassword');
});

router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      console.log('Password reset token is invalid or has expired.');
      return res.redirect('/');
    }
    res.render('reset', {token: req.params.token});
  });
});

module.exports = router;
