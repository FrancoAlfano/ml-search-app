import express from 'express';
import cors from 'cors';
import itemsRouter from './routes/items.js';

const app = express();
const port = 8080;

app.use(cors());

app.use(express.json());

app.use('/api/items', itemsRouter);

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
