import logo from './logo.svg';

import React, { useEffect, useState, createContext, useContext, useRef } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes, Router } from 'react-router-dom';
import Navbar from './Custom_Navbar.js';
import News from './News.js';
import StockCarousel from './StockCarousel.js';
import { DataContext } from './DataProvider.js';
import Shop from './Shop.js';


const Home = () => {

    const servicesRef = useRef(null);


    return (
        <>
            <Navbar></Navbar>
            <Shop></Shop> 
        </> 
    );
}
 
export default Home;