import request from 'supertest';
import express from 'express';
import router from './items.js';
import axios from 'axios';

jest.mock('axios');
jest.mock('dotenv', () => ({
  config: jest.fn()
}));

const app = express();
app.use(router);

describe('Router Tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    process.env.API_BASE_URL = 'http://api.example.com';
    process.env.ITEMS_SEARCH_PATH = '/search?q=';
  });

  describe('GET /', () => {
    it('should return search results', async () => {
      const mockResponse = {
        data: {
          results: [
            {
              id: '1',
              title: 'Test Item',
              currency_id: 'USD',
              price: 100,
              thumbnail: 'http://example.com/image.jpg',
              condition: 'new',
              shipping: { free_shipping: true },
              location: {
                city: { name: 'Test City' },
                state: { name: 'Test State' }
              }
            }
          ],
          filters: [
            {
              id: 'category',
              values: [
                {
                  path_from_root: [
                    { name: 'Category 1' },
                    { name: 'Category 2' }
                  ]
                }
              ]
            }
          ]
        }
      };

      axios.get.mockResolvedValue(mockResponse);

      const response = await request(app).get('/?q=test');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('items');
      expect(response.body).toHaveProperty('categories');
      expect(response.body.items).toHaveLength(1);
      expect(response.body.categories).toEqual(['Category 1', 'Category 2']);
    });

    it('should handle errors', async () => {
      axios.get.mockRejectedValue(new Error('API Error'));

      const response = await request(app).get('/?q=test');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'An error occurred' });
    });
  });

  describe('GET /:id', () => {
    it('should return item details', async () => {
      const mockItemResponse = {
        data: {
          id: '1',
          title: 'Test Item',
          currency_id: 'USD',
          price: 100,
          pictures: [{ secure_url: 'http://example.com/image.jpg' }],
          condition: 'new',
          shipping: { free_shipping: true },
          sold_quantity: 5,
          category_id: 'cat1',
          permalink: 'http://example.com/item1'
        }
      };

      const mockDescriptionResponse = {
        data: {
          plain_text: 'Test description'
        }
      };

      const mockCategoryResponse = {
        data: {
          path_from_root: [{ name: 'Category 1' }, { name: 'Category 2' }]
        }
      };

      axios.get.mockImplementation(url => {
        if (url.includes('/description'))
          return Promise.resolve(mockDescriptionResponse);
        if (url.includes('/categories'))
          return Promise.resolve(mockCategoryResponse);
        return Promise.resolve(mockItemResponse);
      });

      const response = await request(app).get('/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('item');
      expect(response.body).toHaveProperty('categories');
      expect(response.body.item.id).toBe('1');
      expect(response.body.categories).toEqual(['Category 1', 'Category 2']);
    });

    it('should handle errors', async () => {
      axios.get.mockRejectedValue(new Error('API Error'));

      const response = await request(app).get('/1');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'An error occurred' });
    });
  });
});
