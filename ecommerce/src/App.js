import './App.css';
import { useEffect, useRef, useState, useContext } from 'react';
import { Route, Routes, BrowserRouter as Router, useLocation, useNavigate } from 'react-router-dom';
import Home from './Home.js';
import Contact from './Contact.js';
import Login from './Login.js';
import SignUp from './SignUp.js';
import Profile from './Profile.js';
import Cart from './Cart.js';
import { DataContext } from './DataProvider.js';
import PrivateRoute from './PrivateRoute.js';



function App() {

  //Obtain userLoggedIn variable from DataProvider Component
  const { userLoggedIn, setUserLoggedIn } = useContext(DataContext);

  console.log("User Logged In: ", userLoggedIn);


  return (
        //Declare Routes
        <div className="App">
            <Routes>
              <Route path ='/' element = {
                <PrivateRoute>
                  <Home/>
                </PrivateRoute>
              }/>
              <Route path = '/Login' element = {<Login/>}/>
              <Route path = '/SignUp' element = {<SignUp/>}/>
              <Route path = '/Profile' element = {
                <PrivateRoute>
                  <Profile/>
                </PrivateRoute>
              } />
              <Route path = '/Cart' element= {
                <PrivateRoute>
                 <Cart/>
                </PrivateRoute>
                }
              />
              <Route path = '/Contact' element = {
                <PrivateRoute>
                  <Contact/>
                </PrivateRoute>
              }/>
            </Routes>
        </div>
  );
}

export default App;
