const express = require('express');
const authenticate = require('./middleware/authenticate').apiAuthenticate;
let router = express.Router();

/* GET /users */
router.get('/', authenticate, async(req, res) => {
  let model = req.app.models.get('ModelUser');
  let users = await model.getAllUsers();
  res.json(users);
});

/* GET /users/:id */
router.get('/:userId', authenticate, async(req, res) => {
  let model = req.app.models.get('ModelUser');
  let user = await model.getUserById(req.params.userId);
  if (user === null) {
    return res.status(404).json([{error:"User not found."}]);
  }
  res.json(user);
});

module.exports = router;
