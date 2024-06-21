import express from 'express';
import axios from 'axios';
import validateQuery from '../middleware/validateQuery.js';
import validateParam from '../middleware/validateParam.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const API_BASE_URL = process.env.API_BASE_URL;
const ITEMS_SEARCH_PATH = process.env.ITEMS_SEARCH_PATH;

router.get('/', validateQuery, async (req, res) => {
  const { q } = req.query;

  try {
    const response = await axios.get(`${API_BASE_URL}${ITEMS_SEARCH_PATH}${q}`);
    const items = response.data.results.slice(0, 4).map(item => ({
      id: item.id,
      title: item.title,
      price: {
        currency: item.currency_id,
        amount: item.price,
        decimals: 10
      },
      picture: item.thumbnail.replace('I.jpg', 'O.jpg'),
      condition: item.condition,
      free_shipping: item.shipping.free_shipping,
      location: item.location
        ? `${item.location.city.name}, ${item.location.state.name}`
        : ''
    }));

    const categories =
      response.data.filters
        .find(filter => filter.id === 'category')
        ?.values[0].path_from_root.map(cat => cat.name) || [];

    res.json({
      author: {
        name: '',
        lastname: ''
      },
      categories,
      items
    });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

router.get('/:id', validateParam, async (req, res) => {
  const { id } = req.params;

  try {
    const [itemResponse, descriptionResponse] = await Promise.all([
      axios.get(`${API_BASE_URL}/items/${id}`),
      axios.get(`${API_BASE_URL}/items/${id}/description`)
    ]);

    const item = itemResponse.data;
    const description = descriptionResponse.data;

    res.json({
      author: {
        name: '',
        lastname: ''
      },
      item: {
        id: item.id,
        title: item.title,
        price: {
          currency: item.currency_id,
          amount: item.price,
          decimals: 0
        },
        picture: item.pictures[0].secure_url,
        condition: item.condition,
        free_shipping: item.shipping.free_shipping,
        sold_quantity: item.sold_quantity,
        description: description.plain_text
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

export default router;