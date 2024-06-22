import { forwardRef, useImperativeHandle } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch } from 'react-icons/fa';
import { useSearch } from '../../contexts/SearchContext';
import styles from './searchbox.module.scss';

const SearchBox = forwardRef((props, ref) => {
  const { searchQuery, setSearchQuery } = useSearch();
  const router = useRouter();

  const handleSearch = e => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/items?search=${searchQuery}`);
    }
  };

  useImperativeHandle(ref, () => ({
    clearSearch() {
      setSearchQuery('');
    }
  }));

  return (
    <form onSubmit={handleSearch} className={styles['search-form']}>
      <input
        type="text"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
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
