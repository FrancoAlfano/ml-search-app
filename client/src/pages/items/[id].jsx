import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const ItemDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [item, setItem] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchItemDetails = async () => {
      try {
        const response = await fetch(`/api/items/${id}`);
        const data = await response.json();
        setItem(data.item);
      } catch (error) {
        console.error('Error fetching item details:', error);
      }
    };

    fetchItemDetails();
  }, [id]);

  if (!item) return <div>Loading...</div>;

  return (
    <div>
      <h1>{item.title}</h1>
      <img src={item.picture} alt={item.title} />
      <p>{item.price.amount} {item.price.currency}</p>
      <p>{item.condition}</p>
      <p>{item.description}</p>
      <p>Free Shipping: {item.free_shipping ? 'Yes' : 'No'}</p>
      <p>Sold Quantity: {item.sold_quantity}</p>
    </div>
  );
};

export default ItemDetail;