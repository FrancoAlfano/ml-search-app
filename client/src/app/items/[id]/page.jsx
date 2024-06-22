'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import Head from 'next/head';
import ItemImage from '../../../components/ItemImage/ItemImage';
import { formatCurrency } from '../../../utils/formatCurrency';
import LoadingSpinner from '../../../components/Spinner/LoadingSpinner';
import '../../../styles/product-detail.scss';
import ErrorMessage from '../../../components/Error/ErrorMessage';
import Breadcrumb from '../../../components/Breadcrumb/Breadcrumb';

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/items/${id}`);
        setProduct(response.data.item);
        setCategories(response.data.categories || []);
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
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!product) {
    return <ErrorMessage message="No product found." />;
  }

  return (
    <div className="container">
      <Breadcrumb categories={categories} />
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
            {product.price && (
              <p className="text-lg price">
                {formatCurrency(product.price.amount, product.price.currency)}
              </p>
            )}
            {product.permalink && (
              <Link href={product.permalink} className="buy-button">
                <button>Comprar</button>
              </Link>
            )}
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
