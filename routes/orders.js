const express = require('express');
const router = express.Router();
const db = require('../utils/db');

router.get('/', (req, res) =>{
  const data = db.readDb(); res.json(data.orders || []);
});

router.get('/pushed', (req, res) =>{
  const data = db.readDb(); res.json(data.pushed || []);
});

router.post('/', (req, res) =>{
  const data = db.readDb();
  const body = req.body || {};
  const order = {
    id: 'ORD-' + Date.now(),
    clueId: body.clueId || null,
    vehicle: body.vehicle || '',
    plate: body.plate || '',
    damage: body.damage || '',
    location: body.location || {},
    status: '待派单',
    createdAt: Date.now()
  };
  data.orders.unshift(order);
  db.writeDb(data);
  res.json(order);
});

router.post('/:id/push', (req, res) =>{
  const data = db.readDb();
  const id = req.params.id; const body = req.body || {};
  const order = data.orders.find(o=>o.id===id);
  if (!order) return res.status(404).json({ error: 'order not found' });
  const push = { order, dealerId: body.dealerId || 'D-001', t: Date.now(), confirmed:false };
  data.pushed.unshift(push);
  order.status = '已推送至店';
  db.writeDb(data);
  res.json(push);
});

router.post('/:id/confirm', (req, res) =>{
  const data = db.readDb();
  const id = req.params.id; const body = req.body || {};
  const idx = data.pushed.findIndex(p=>p.order && p.order.id===id);
  if (idx===-1) return res.status(404).json({ error: 'push not found' });
  data.pushed[idx].confirmed = true; data.pushed[idx].confirmedAt = Date.now();
  const orderIdx = data.orders.findIndex(o=>o.id===id);
  if (orderIdx!==-1){ data.orders[orderIdx].status = '门店已接收'; }
  db.writeDb(data);
  res.json(data.pushed[idx]);
});

router.post('/:id/progress', (req, res) =>{
  const data = db.readDb();
  const id = req.params.id; const body = req.body || {};
  const orderIdx = data.orders.findIndex(o=>o.id===id);
  if (orderIdx===-1) return res.status(404).json({ error: 'order not found' });
  data.orders[orderIdx].status = body.status || data.orders[orderIdx].status;
  data.orders[orderIdx].progressAt = Date.now();
  data.dealer_responses.unshift({ orderId: id, status: data.orders[orderIdx].status, t: Date.now() });
  db.writeDb(data);
  res.json(data.orders[orderIdx]);
});

module.exports = router;
