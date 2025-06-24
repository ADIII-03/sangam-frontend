import React from 'react';
import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import App from './App.jsx';

import { store } from './store.js';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast'; // ✅ Import Toaster

ReactDOM.createRoot(document.getElementById('root')).render(
  
    <BrowserRouter>
      <Provider store={store}>
        <App />
        <Toaster position="top-centre" reverseOrder={false} /> {/* ✅ Mount globally */}
      </Provider>
    </BrowserRouter>
  
);
