const express = require('express');
const authenticate = require('./middleware/authenticate');
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
    res.status(404).send(JSON.stringify([{"error":"User not found."}]));
  }
  res.json(user);
});

module.exports = router;
