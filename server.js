const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const cluesRouter = require('./routes/clues');
const ordersRouter = require('./routes/orders');
const dealerResponsesRouter = require('./routes/dealerResponses');
const locationsRouter = require('./routes/locations');
const aiRouter = require('./routes/ai');

const app = express();
app.use(cors());
app.use(bodyParser.json({limit: '5mb'}));

// Simple optional API token protection:
// If `API_TOKEN` is set in env (or default 'dev-token'), non-GET /api/* requests
// must provide the token via `x-api-key` header or `Authorization: Bearer <token>`.
const API_TOKEN = process.env.API_TOKEN || 'dev-token';
app.use((req, res, next) => {
	if (!req.path.startsWith('/api')) return next();
	if (req.method === 'GET') return next();
	const authHeader = req.headers['authorization'];
	const bearer = authHeader && authHeader.split && authHeader.split(' ')[1];
	const key = req.headers['x-api-key'] || bearer;
	if (key && key === API_TOKEN) return next();
	res.status(401).json({ error: 'Unauthorized: missing or invalid API token' });
});

app.use('/api/clues', cluesRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/dealer_responses', dealerResponsesRouter);
app.use('/api/locations', locationsRouter);
app.use('/api/ai', aiRouter);

app.get('/', (req, res) => res.send('事故车线索示例后端运行中'));

const port = process.env.PORT || 3000;
app.listen(port, ()=> console.debug('Server started on port', port));
