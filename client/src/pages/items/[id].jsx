import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import ItemImage from '../../components/ItemImage/ItemImage';
import { formatCurrency } from '../../utils/formatCurrency';

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/items/${id}`);
        setProduct(response.data.item);
      } catch (error) {
        console.error(error);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white p-4 rounded shadow">
        <div className="flex">
          <ItemImage src={product.picture} alt={product.title} size="large" />
          <div className="ml-4">
            <h1 className="text-2xl font-bold">{product.title}</h1>
            <p className="text-lg">
              {formatCurrency(product.price.amount, product.price.currency)}
            </p>
            <p>{product.condition}</p>
            <p>{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
