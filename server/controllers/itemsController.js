import {
  searchItemsService,
  getItemDetailsService
} from '../services/itemsService.js';

export const searchItems = async (req, res) => {
  const { q, page = 1, limit = 4 } = req.query;
  try {
    const { categories, items, totalResults, totalPages, currentPage, error } =
      await searchItemsService(q, parseInt(page), parseInt(limit));

    if (error) {
      res.status(400).json({ error });
    } else {
      res.json({
        author: {
          name: '',
          lastname: ''
        },
        categories,
        items,
        pagination: {
          totalResults,
          totalPages,
          currentPage: parseInt(currentPage),
          limit: parseInt(limit)
        }
      });
    }
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
