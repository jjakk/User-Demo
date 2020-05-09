const router = require('express').Router();
const User = require('./../model/User.js');
const verify = require('./verifyToken');

router.get('/', verify, async (req, res) => {
  const user = await User.findOne({_id: req.user._id});
  if(!user) return res.status(400).send('ID not found');
  res.render('loggedIn', {
    name: user.name
  });
})

module.exports = router;
