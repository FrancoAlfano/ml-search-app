'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import ItemCard from '../../components/ItemCard/ItemCard';
import LoadingSpinner from '../../components/Spinner/LoadingSpinner';
import ErrorMessage from '../../components/Error/ErrorMessage';
import styles from '../../styles/search-results.module.scss';

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

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (error) {
      return <ErrorMessage message={`Error: ${error}`} />;
    }

    if (results.length === 0) {
      return (
        <div className={styles.noResults}>
          <p>No hay publicaciones que coincidan con tu búsqueda</p>
          <p>Revisá la ortografía de la palabra.</p>
          <p>Utilizá palabras más genéricas o menos palabras.</p>
        </div>
      );
    }

    return (
      <ul>
        {results.map(item => (
          <li key={item.id}>
            <ItemCard item={item} />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className={`container bg-white ${styles.searchResults}`}>
      <main>{renderContent()}</main>
    </div>
  );
};

export default SearchResults;
