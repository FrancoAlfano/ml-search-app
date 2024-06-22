import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL;
const ITEMS_SEARCH_PATH = process.env.ITEMS_SEARCH_PATH;

export const searchItemsService = async query => {
  const response = await axios.get(
    `${API_BASE_URL}${ITEMS_SEARCH_PATH}${query}`
  );
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

  return { categories, items };
};

export const getItemDetailsService = async id => {
  const [itemResponse, descriptionResponse] = await Promise.all([
    axios.get(`${API_BASE_URL}/items/${id}`),
    axios.get(`${API_BASE_URL}/items/${id}/description`)
  ]);

  const item = itemResponse.data;
  const description = descriptionResponse.data;

  let categories = [];
  if (item.category_id) {
    try {
      const categoryResponse = await axios.get(
        `${API_BASE_URL}/categories/${item.category_id}`
      );
      categories = categoryResponse.data.path_from_root.map(cat => cat.name);
    } catch (categoryError) {
      console.error('Error fetching category:', categoryError);
    }
  }

  const soldQuantity =
    item.sold_quantity !== undefined ? item.sold_quantity : 0;
  const condition = item.condition === 'new' ? 'Nuevo' : 'Usado';

  return {
    categories,
    item: {
      id: item.id,
      title: item.title,
      price: {
        currency: item.currency_id,
        amount: item.price,
        decimals: 0
      },
      picture: item.pictures[0].secure_url,
      condition: condition,
      free_shipping: item.shipping.free_shipping,
      sold_quantity: soldQuantity,
      description: description.plain_text,
      permalink: item.permalink
    }
  };
};
