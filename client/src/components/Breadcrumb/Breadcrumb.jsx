import { Fragment } from 'react';
import Link from 'next/link';
import styles from './breadcrumb.module.scss';

const Breadcrumb = ({ categories }) => {
  return (
    <nav className={styles.breadcrumb}>
      {categories.map((category, index) => (
        <Fragment key={index}>
          <Link href={`/items?search=${category}`}>{category}</Link>
          {index < categories.length - 1 && (
            <span className={styles.separator}>&gt;</span>
          )}
        </Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
