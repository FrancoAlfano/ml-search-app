'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import ItemImage from '../../../components/ItemImage/ItemImage';
import { formatCurrency } from '../../../utils/formatCurrency';
import Head from 'next/head';
import '../../../styles/ProductDetail.scss';

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/items/${id}`);
        setProduct(response.data.item);
      } catch (error) {
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!product) {
    return <p>No product found.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <Head>
        <title>{product.title} - Product Details</title>
        <meta name="description" content={product.description} />
      </Head>
      <div className="product-detail bg-white p-4 rounded shadow">
        <div className="product-main flex">
          <ItemImage src={product.picture} alt={product.title} size="large" />
          <div className="product-info ml-4">
            <p className="text-base">{product.condition}</p>
            <h1 className="text-2xl font-bold">{product.title}</h1>
            <p className="text-lg price">
              {formatCurrency(product.price.amount, product.price.currency)}
            </p>
            <button className="buy-button">Comprar</button>
          </div>
        </div>
        <div className="product-description mt-4">
          <h2 className="text-xl font-bold">Descripción del producto</h2>
          <p className="text-gray-500">{product.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
