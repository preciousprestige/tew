import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Account from './pages/Account';
import Login from './pages/Login';
import CartPage from './components/CartPage';
import { CartProvider } from './context/CartContext';
import Checkout from './components/Checkout';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import "@fontsource/dancing-script";

function App() {
  return (
    <CartProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/account" element={<Account />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
        <Footer />
      </Router>
    </CartProvider>
  );
}

export default App;
