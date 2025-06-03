import logo from './logo.svg';

import React, { useEffect, useState, createContext, useContext, useRef } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes, Router } from 'react-router-dom';
import Navbar from './Custom_Navbar.js';
import CustomFooter from './Custom_Footer.js';
import { DataContext } from './DataProvider.js';
import Shop from './Shop.js';

//Home component
const Home = () => {

    const servicesRef = useRef(null);


    return (
        <>
        <Navbar></Navbar>
        <Shop></Shop>
        <CustomFooter></CustomFooter>
        </>
    );
}

export default Home;
