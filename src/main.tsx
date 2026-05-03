import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import { About } from './pages/About';
import { MaintenancePage } from './pages/MaintenancePage';
import { IS_MAINTENANCE } from './lib/maintenance';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={IS_MAINTENANCE ? <MaintenancePage /> : <App />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
);
