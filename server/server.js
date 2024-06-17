const express = require('express');
const itemsRouter = require('./routes/items');
const app = express();
const port = 8080;
const cors = require('cors');

app.use(cors());

app.use(express.json());

app.use('/api/items', itemsRouter);

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});

module.exports = app;
