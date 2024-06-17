import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Image from 'next/image';

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      axios.get(`/api/items/${id}`).then(response => {
        setProduct(response.data.item);
      });
    }
  }, [id]);

  if (!product) {
    return (
      <div>
        <div>Loading...</div>;
      </div>
    );
  }

  return (
    <div>
      <main className="p-4">
        <h1 className="text-xl font-bold">{product.title}</h1>
        <div className="flex">
          <Image
            src={product.picture}
            alt={product.title}
            width={680}
            height={680}
            quality={100}
            className="object-cover mr-4"
          />
          <div>
            <h2 className="text-2xl font-bold">{product.title}</h2>
            <p className="text-xl">
              {product.price.amount} {product.price.currency}
            </p>
            <p>{product.condition}</p>
            <p>{product.description}</p>
            <p>Envío Gratis: {product.free_shipping ? 'Sí' : 'No'}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
