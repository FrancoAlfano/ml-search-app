import {
  searchItemsService,
  getItemDetailsService
} from '../services/itemsService.js';

export const searchItems = async (req, res) => {
  const { q } = req.query;
  try {
    const { categories, items } = await searchItemsService(q);
    res.json({
      author: {
        name: '',
        lastname: ''
      },
      categories,
      items
    });
  } catch (error) {
    console.error('Error in searchItems:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

export const getItemDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const { categories, item } = await getItemDetailsService(id);
    res.json({
      author: {
        name: '',
        lastname: ''
      },
      categories,
      item
    });
  } catch (error) {
    console.error('Error in getItemDetails:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
};
