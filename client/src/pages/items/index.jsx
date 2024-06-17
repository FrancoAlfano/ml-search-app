import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const router = useRouter();
  const { search } = router.query;

  useEffect(() => {
    if (search) {
      axios.get(`/api/items?q=${search}`).then(response => {
        setResults(response.data.items);
      });
    }
  }, [search]);

  return (
    <div>
      <main className="p-4">
        <h1 className="text-xl font-bold">Resultados de la Búsqueda</h1>
        <ul className="mt-4">
          {results.map(item => (
            <li key={item.id} className="mb-4 border p-4 rounded">
              <Link href={`/items/${item.id}`} className="flex">
                <Image
                  src={item.picture}
                  alt={item.title}
                  width={180}
                  height={180}
                  quality={100}
                  priority
                  className="object-cover mr-4"
                />
                <div>
                  <div className="font-bold">{item.title}</div>
                  <div>
                    ${item.price.amount} {item.price.currency}
                  </div>
                  <div>{item.condition}</div>
                  free shipping: {item.free_shipping ? 'Sí' : 'No'}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default SearchResults;
