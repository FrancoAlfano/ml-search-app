const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');

app.use(cors());

app.get('/api/greet', (req, res) => {
  res.send('Hello from server!');
});

app.listen(port, () => {
  console.log('Listening on http://localhost:${port}');
});
