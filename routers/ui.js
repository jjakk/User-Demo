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

module.exports = router;
