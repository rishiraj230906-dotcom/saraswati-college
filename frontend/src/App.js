import logo from './logo.svg';
import './App.css';
import Index from './Pages/Index';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Credential from './Pages/Credential';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/register" element={<Credential />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
