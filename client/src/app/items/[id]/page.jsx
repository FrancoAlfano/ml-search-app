'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import ItemImage from '../../../components/ItemImage/ItemImage';
import { formatCurrency } from '../../../utils/formatCurrency';
import Head from 'next/head';
import '../../../styles/product-detail.scss';
import Link from 'next/link';

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
    <div className="container">
      <Head>
        <title>{product.title} - Product Details</title>
        <meta name="description" content={product.description} />
      </Head>
      <div className="product-detail bg-white rounded shadow">
        <div className="product-main">
          <ItemImage src={product.picture} alt={product.title} size="large" />
          <div className="product-info">
            <p className="text-base">
              {product.condition} - {product.sold_quantity} vendidos
            </p>
            <h1 className="product-title">{product.title}</h1>
            <p className="text-lg price">
              {formatCurrency(product.price.amount, product.price.currency)}
            </p>
            <Link href={product.permalink} className="buy-button">
              <button>Comprar</button>
            </Link>
          </div>
        </div>
        <div className="product-description">
          <h2 className="text-xl">Descripción del producto</h2>
          <p className="text-gray-500">{product.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
