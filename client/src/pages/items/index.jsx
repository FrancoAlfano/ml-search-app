import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import ItemCard from '../../components/ItemCard/ItemCard';

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { search } = router.query;

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          process.env.NEXT_PUBLIC_ITEMS_URL + `${search}`
        );
        setResults(response.data.items);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (search) {
      fetchResults();
    }
  }, [search]);

  return (
    <div className="container mx-auto p-4">
      <main className="bg-white p-4 rounded shadow">
        {isLoading ? (
          <p>Cargando...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : (
          <ul>
            {results.map(item => (
              <li key={item.id}>
                <ItemCard item={item} />
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};

export default SearchResults;
