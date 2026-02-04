const express = require('express');
const router = express.Router();

// Simple mock AI recognize endpoint (M1 stub).
// Accepts JSON: { imageBase64: '<data...>' } and returns mock structured result.

router.post('/recognize', (req, res) => {
  const { imageBase64 } = req.body || {};
  // In stub mode we don't process image; return deterministic mock result.
  const mock = {
    plate: '粤A12345',
    plate_confidence: 0.92,
    vehicle_type: 'SUV',
    vehicle_confidence: 0.88,
    damages: [
      { part: '右前车门', label: '划痕', confidence: 0.76 },
      { part: '后杠', label: '凹陷', confidence: 0.65 }
    ],
    overall_confidence: 0.84,
    note: '这是后端 M1 stub 响应，真实接入请替换为云 OCR/模型服务'
  };

  // If client sends ?mode=low_conf, return lower confidences for testing
  if (req.query.mode === 'low_conf') {
    mock.plate_confidence = 0.55;
    mock.overall_confidence = 0.5;
  }

  return res.json({ success: true, data: mock });
});

router.get('/models', (req, res) => {
  // Simple static list for discovery/testing
  return res.json({ models: [ { id: 'ocr-v1', name: 'Cloud OCR v1' }, { id: 'damage-v1', name: 'Damage detector v1' } ] });
});

module.exports = router;
