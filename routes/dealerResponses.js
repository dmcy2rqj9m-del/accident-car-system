const express = require('express');
const router = express.Router();
const db = require('../utils/db');

router.get('/', (req, res) =>{
  const data = db.readDb();
  res.json(data.dealer_responses || []);
});

module.exports = router;
