import Link from 'next/link';
import Image from 'next/image';
import SearchBox from '../SearchBox/SearchBox';
import styles from './header.module.scss';

const Header = () => {
  return (
    <header className={styles.header}>
      <Link href="/">
        <Image
          className={styles.icon}
          src="/ml-icon.png"
          alt="Mercado Libre"
          width={50}
          height={35}
        />
      </Link>
      <SearchBox />
    </header>
  );
};

export default Header;
