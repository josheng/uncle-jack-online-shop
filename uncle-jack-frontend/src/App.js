import './App.css';
import HeaderBar from './components/header/header';
import 'bootstrap/dist/css/bootstrap.min.css';
import CarouselBanner from './components/carousell/carousel';
import ProductCard from './components/products/products';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <HeaderBar />
      </header>
      <body>
        <CarouselBanner />
        <ProductCard />
      </body>
    </div>
  );
}

export default App;
