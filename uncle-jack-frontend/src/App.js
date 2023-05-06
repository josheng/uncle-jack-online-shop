import './App.css';
import HeaderBar from './components/header/header';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProductPage from './components/products/productpage';
import { Route, Routes } from 'react-router-dom';
import AdminPage from './components/admin/adminpage';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <HeaderBar />
      </header>
      <body>
        <Routes>
          <Route path='/' element={<ProductPage />} />
          <Route path='/admin' element={<AdminPage />} />
        </Routes>
      </body>
    </div>
  );
}

export default App;
