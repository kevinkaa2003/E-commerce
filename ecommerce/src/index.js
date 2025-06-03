import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { DataProvider } from './DataProvider.js';


//Page refresh handling
if (!sessionStorage.getItem('appHasLaunched')) {
  sessionStorage.setItem('appHasLaunched', 'true'); //Set 'appHasLaunched' to 'true' when website launches
  localStorage.setItem('userLoggedIn', 'false'); //Set userLoggedIn to false on render
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <DataProvider>
        <App />
      </DataProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
