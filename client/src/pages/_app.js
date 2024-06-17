import '../styles/globals.scss';
import Header from '../components/Header/Header';

function MlSearch({ Component, pageProps }) {
  return (
    <div>
      <Header />
      <Component {...pageProps} />
    </div>
  );
}

export default MlSearch;
