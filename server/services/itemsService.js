import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL;
const ITEMS_SEARCH_PATH = process.env.ITEMS_SEARCH_PATH;
const MAX_ALLOWED_OFFSET = 1000;
const MAX_ITEMS_PER_PAGE = 4;

export const searchItemsService = async (
  query,
  page = 1,
  limit = MAX_ITEMS_PER_PAGE
) => {
  const offset = (page - 1) * limit;

  if (offset >= MAX_ALLOWED_OFFSET) {
    return {
      items: [],
      categories: [],
      totalResults: MAX_ALLOWED_OFFSET,
      totalPages: MAX_ALLOWED_OFFSET / limit,
      currentPage: page,
      error: 'Maximum allowed page reached'
    };
  }

  try {
    const response = await axios.get(
      `${API_BASE_URL}${ITEMS_SEARCH_PATH}${query}&offset=${offset}&limit=${limit}`
    );

    const items = response.data.results.map(item => ({
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

    const totalResults = Math.min(
      response.data.paging.total,
      MAX_ALLOWED_OFFSET
    );
    const totalPages = Math.min(
      Math.ceil(totalResults / limit),
      MAX_ALLOWED_OFFSET / limit
    );

    return { categories, items, totalResults, totalPages, currentPage: page };
  } catch (error) {
    console.error('Error in searchItemsService:', error);
    return {
      items: [],
      categories: [],
      totalResults: 0,
      totalPages: 0,
      currentPage: page,
      error: 'An error occurred while fetching results'
    };
  }
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
