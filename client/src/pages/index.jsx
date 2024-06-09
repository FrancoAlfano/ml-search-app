import { useState } from 'react';
import { useRouter } from 'next/router';

const Index = () => {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (event) => {
    event.preventDefault();
    if (query) {
      router.push(`/items?search=${query}`);
    }
  };

  return (
    <div>
      <h1>Caja de búsqueda</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar productos..."
        />
        <button type="submit">Buscar</button>
      </form>
    </div>
  );
};

export default Index;