import '../src/index.css';

import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';
import WAFloat from '../src/components/WAFloat';
import { StoreProvider } from '../src/context/StoreContext';

export default function App({ Component, pageProps }) {
  return (
    <StoreProvider>
      <Navbar />
      <Component {...pageProps} />
      <Footer />
      <WAFloat />
    </StoreProvider>
  );
}

