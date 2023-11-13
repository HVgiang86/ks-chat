const express = require('express');

const router = express.Router();

router.post('/api/login', (req, res) => {
  console.log('login requested');
  console.log(req.header);
  res.send('Dev');
});

module.exports = router;
