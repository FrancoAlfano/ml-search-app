'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import ItemCard from '../../components/ItemCard/ItemCard';

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const search = searchParams.get('search');

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
    <div className="container bg-white">
      <main>
        {isLoading ? (
          <p>Cargando...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : results.length === 0 ? (
          <div>
            <p>No hay publicaciones que coincidan con tu búsqueda</p>
            <ul>
              <li>Revisá la ortografía de la palabra.</li>
              <li>Utilizá palabras más genéricas o menos palabras.</li>
            </ul>
          </div>
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
