const express = require('express');
const router = express.Router();
const db = require('../utils/db');

router.get('/', (req, res) =>{
  const data = db.readDb();
  res.json(data.locations || []);
});

router.post('/', (req, res) =>{
  const data = db.readDb();
  const body = req.body || {};
  const loc = { id: 'LOC-' + Date.now(), lat: body.lat || 0, lng: body.lng || 0, timestamp: body.timestamp || Date.now(), orderId: body.orderId || null };
  data.locations.unshift(loc);
  // 保持最近 1000 条
  if (!Array.isArray(data.locations)) data.locations = [];
  if (data.locations.length>1000) data.locations = data.locations.slice(0,1000);
  db.writeDb(data);
  res.json(loc);
});

module.exports = router;
