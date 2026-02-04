const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../utils/db');

router.get('/', (req, res) => {
  const data = db.readDb();
  res.json(data.clues || []);
});

router.post('/', (req, res) => {
  const data = db.readDb();
  const body = req.body || {};
  const clue = {
    id: 'RS-' + Date.now(),
    photos: body.photos || [],
    location: body.location || {},
    plate: body.plate || '',
    vehicle: body.vehicle || '',
    damage: body.damage || '',
    status: '待派单',
    createdAt: Date.now()
  };
  data.clues.unshift(clue);
  db.writeDb(data);
  res.json(clue);
});

router.post('/:id/approve', (req, res) => {
  const data = db.readDb();
  const id = req.params.id;
  const idx = data.clues.findIndex(c=>c.id===id);
  if (idx===-1) return res.status(404).json({ error: 'not found' });
  data.clues[idx].status = '有效'; data.clues[idx].auditedAt = Date.now();
  db.writeDb(data);
  res.json(data.clues[idx]);
});

router.post('/:id/reject', (req, res) => {
  const data = db.readDb();
  const id = req.params.id;
  const idx = data.clues.findIndex(c=>c.id===id);
  if (idx===-1) return res.status(404).json({ error: 'not found' });
  data.clues[idx].status = '无效'; data.clues[idx].auditedAt = Date.now();
  db.writeDb(data);
  res.json(data.clues[idx]);
});

module.exports = router;
