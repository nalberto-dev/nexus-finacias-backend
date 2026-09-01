const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({ origin: '*' }));
app.options('*', cors());
app.use(express.json());

const CLIENT_ID     = '2f081294-6690-414a-a3da-75943d97c721';
const CLIENT_SECRET = 'gdpNcICjohN5M3HYOHeFJzaK_dAp6a46hHtKThpAcko';

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Nexus Backend rodando!' });
});

app.post('/pluggy/token', async (req, res) => {
  try {
    const r = await fetch('https://api.pluggy.ai/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId: CLIENT_ID, clientSecret: CLIENT_SECRET }),
    });
    const data = await r.json();
    console.log('Pluggy response:', data);
    res.json({ apiKey: data.apiKey });
  } catch (e) {
    console.error('Erro:', e);
    res.status(500).json({ error: e.message });
  }
});

app.get('/pluggy/accounts/:itemId', async (req, res) => {
  try {
    const r = await fetch(
      `https://api.pluggy.ai/accounts?itemId=${req.params.itemId}`,
      { headers: { 'X-API-KEY': req.query.apiKey } }
    );
    res.json(await r.json());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/pluggy/transactions/:accountId', async (req, res) => {
  try {
    const r = await fetch(
      `https://api.pluggy.ai/transactions?accountId=${req.params.accountId}&pageSize=100`,
      { headers: { 'X-API-KEY': req.query.apiKey } }
    );
    res.json(await r.json());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/pluggy/item/:itemId', async (req, res) => {
  try {
    const r = await fetch(
      `https://api.pluggy.ai/items/${req.params.itemId}`,
      { headers: { 'X-API-KEY': req.query.apiKey } }
    );
    res.json(await r.json());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ Backend rodando na porta ${PORT}`));