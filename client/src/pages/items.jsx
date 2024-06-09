import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Items = () => {
  const [items, setItems] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    const { search } = router.query;

    if (search) {
      fetch(`/api/items?q=${search}`)
        .then(response => response.json())
        .then(data => setItems(data.items))
        .catch(error => console.error('Error fetching items:', error));
    }
  }, [router.isReady, router.query]);

  return (
    <div>
      <h1>Resultados de la búsqueda</h1>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            <a href={`/items/${item.id}`}>
              <img src={item.picture} alt={item.title} />
              <h2>{item.title}</h2>
              <p>{item.price.amount} {item.price.currency}</p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Items;
