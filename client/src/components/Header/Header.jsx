'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';
import SearchBox from '../SearchBox/SearchBox';
import styles from './header.module.scss';

const Header = () => {
  const searchBoxRef = useRef();

  const handleHomeClick = () => {
    if (searchBoxRef.current) {
      searchBoxRef.current.clearSearch();
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" onClick={handleHomeClick}>
          <Image
            className={styles.icon}
            src="/ml-icon.png"
            alt="Mercado Libre"
            width={50}
            height={35}
          />
        </Link>
        <SearchBox ref={searchBoxRef} />
      </div>
    </header>
  );
};

export default Header;
