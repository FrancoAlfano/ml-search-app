import { useState } from 'react';
import { useRouter } from 'next/router';
import { FaSearch } from 'react-icons/fa';
import styles from './searchbox.module.scss';

const SearchBox = () => {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = e => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/items?search=${query}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className={styles['search-form']}>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Nunca dejes de buscar"
      />
      <button type="submit">
        <FaSearch className="text-gray-600" />
      </button>
    </form>
  );
};

export default SearchBox;
