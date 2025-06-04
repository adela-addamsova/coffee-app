const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend is working!');
});

// Example reservation endpoint
app.post('/api/reserve', (req, res) => {
  const reservation = req.body;
  console.log('Reservation received:', reservation);
  res.status(200).json({ message: 'Reservation successful' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
