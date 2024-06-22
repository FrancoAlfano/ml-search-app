import { useState, forwardRef, useImperativeHandle } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch } from 'react-icons/fa';
import styles from './searchbox.module.scss';

const SearchBox = forwardRef((props, ref) => {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = e => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/items?search=${query}`);
    }
  };

  useImperativeHandle(ref, () => ({
    clearSearch() {
      setQuery('');
    }
  }));

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
});

SearchBox.displayName = 'SearchBox';

export default SearchBox;
