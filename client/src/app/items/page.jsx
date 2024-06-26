'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import ItemCard from '../../components/ItemCard/ItemCard';
import LoadingSpinner from '../../components/Spinner/LoadingSpinner';
import ErrorMessage from '../../components/Error/ErrorMessage';
import Pagination from '../../components/Pagination/Pagination';
import styles from '../../styles/search-results.module.scss';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';

const SearchResultsContent = () => {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});

  const searchParams = useSearchParams();
  const router = useRouter();
  const search = searchParams.get('search');
  const page = searchParams.get('page') || '1';

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_ITEMS_URL}${search}&page=${page}`
        );
        if (response.data.error) {
          setError(response.data.error);
        } else {
          setResults(response.data.items);
          setCategories(response.data.categories || []);
          setPagination(response.data.pagination);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (search) {
      fetchResults();
    }
  }, [search, page]);

  const handlePageChange = newPage => {
    router.push(`/items?search=${search}&page=${newPage}`);
  };

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
      <>
        <ul className="global-list">
          {results.map(item => (
            <li className="global-item" key={item.id}>
              <ItemCard item={item} />
            </li>
          ))}
        </ul>
        {pagination.totalPages > 1 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </>
    );
  };

  return (
    <div className="container">
      <Breadcrumb categories={categories} />
      <div className={`bg-white ${styles.searchResults}`}>
        <main>{renderContent()}</main>
      </div>
    </div>
  );
};

const SearchResults = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <SearchResultsContent />
  </Suspense>
);

export default SearchResults;
