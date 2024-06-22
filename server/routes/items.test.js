import request from 'supertest';
import express from 'express';
import router from '../routes/items';
import * as itemsController from '../controllers/itemsController';

jest.mock('../controllers/itemsController');

const app = express();
app.use(router);

describe('Router Tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /', () => {
    it('should return search results', async () => {
      const mockSearchResults = {
        categories: ['Category 1', 'Category 2'],
        items: [
          {
            id: '1',
            title: 'Test Item',
            price: {
              currency: 'USD',
              amount: 100,
              decimals: 10
            },
            picture: 'http://example.com/image.jpg',
            condition: 'new',
            free_shipping: true,
            location: 'Test City, Test State'
          }
        ]
      };

      itemsController.searchItems.mockImplementation((req, res) => {
        res.json({
          author: {
            name: '',
            lastname: ''
          },
          ...mockSearchResults
        });
      });

      const response = await request(app).get('/?q=test');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('items');
      expect(response.body).toHaveProperty('categories');
      expect(response.body.items).toHaveLength(1);
      expect(response.body.categories).toEqual(['Category 1', 'Category 2']);
    });

    it('should handle errors', async () => {
      itemsController.searchItems.mockImplementation((req, res) => {
        res.status(500).json({ error: 'An error occurred' });
      });

      const response = await request(app).get('/?q=test');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'An error occurred' });
    });
  });

  describe('GET /:id', () => {
    it('should return item details', async () => {
      const mockItemDetails = {
        categories: ['Category 1', 'Category 2'],
        item: {
          id: '1',
          title: 'Test Item',
          price: {
            currency: 'USD',
            amount: 100,
            decimals: 0
          },
          picture: 'http://example.com/image.jpg',
          condition: 'Nuevo',
          free_shipping: true,
          sold_quantity: 5,
          description: 'Test description',
          permalink: 'http://example.com/item1'
        }
      };

      itemsController.getItemDetails.mockImplementation((req, res) => {
        res.json({
          author: {
            name: '',
            lastname: ''
          },
          ...mockItemDetails
        });
      });

      const response = await request(app).get('/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('item');
      expect(response.body).toHaveProperty('categories');
      expect(response.body.item.id).toBe('1');
      expect(response.body.categories).toEqual(['Category 1', 'Category 2']);
    });

    it('should handle errors', async () => {
      itemsController.getItemDetails.mockImplementation((req, res) => {
        res.status(500).json({ error: 'An error occurred' });
      });

      const response = await request(app).get('/1');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'An error occurred' });
    });
  });
});
