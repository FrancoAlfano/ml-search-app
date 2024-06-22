import { Fragment } from 'react';
import Link from 'next/link';
import { useSearch } from '../../contexts/SearchContext';
import styles from './breadcrumb.module.scss';

const Breadcrumb = ({ categories }) => {
  const { setSearchQuery } = useSearch();

  const handleBreadcrumbClick = category => {
    setSearchQuery(category);
  };

  return (
    <nav className={styles.breadcrumb}>
      {categories.map((category, index) => (
        <Fragment key={index}>
          <Link
            href={`/items?search=${category}`}
            onClick={() => handleBreadcrumbClick(category)}
          >
            {category}
          </Link>
          {index < categories.length - 1 && (
            <span className={styles.separator}>&gt;</span>
          )}
        </Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
