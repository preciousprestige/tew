import Header from './components/Header';
import Footer from './components/Footer';
import Home from './Home';
import './App.css';
import "@fontsource/dancing-script";


function App() {
  return (
    <>
      <Header cartCount={2} />
      <Home />
      <Footer />
    </>
  );
}

export default App;
