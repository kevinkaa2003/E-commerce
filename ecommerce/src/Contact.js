import logo from './logo.svg';
import './Contact.css';
import React, { useEffect, useState, createContext, useContext } from 'react';
import ReactDOM from 'react-dom';

import ContactWidget from './Contact_Widget.js';
import Navbar from './Custom_Navbar.js';

import { DataProvider } from './DataProvider.js';

const Contact = () => {
  return (
    <>
      <DataProvider>
        <Navbar/>
        <div className='contactwidgetwrapper'>
          <ContactWidget/>
        </div>
      </DataProvider>
    </>
  );
}

export default Contact;
