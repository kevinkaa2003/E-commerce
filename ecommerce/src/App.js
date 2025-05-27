import './App.css';
import { useEffect, useRef, useState, useContext } from 'react';
import { Route, Routes, BrowserRouter as Router, useLocation, useNavigate } from 'react-router-dom';
import Home from './Home.js';
import Contact from './Contact.js';
import Login from './Login.js';
import SignUp from './SignUp.js';
import Profile from './Profile.js';
import Cart from './Cart.js';
import { DataContext } from './DataProvider.js'


function App() {
  const { userLoggedIn, setUserLoggedIn } = useContext(DataContext);
 
   
  const navigate = useNavigate();
  const goToHome = () => {
    navigate('/');
  };
  const goToLogin = () => {
    navigate('/Login');

  };

  useEffect(() => {
    if (userLoggedIn) {
      goToHome();
      
    } else {
      goToLogin();
      
    }
  }, [userLoggedIn]);

  const location = useLocation();
  

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);


  
  return (
      
        <div className="App">
            <Routes>
              <Route path ='/' element = {<Home/>}/>
              <Route path = '/Contact' element = {<Contact/>}/>
              <Route path = '/Login' element = {<Login/>}/>
              <Route path = '/SignUp' element = {<SignUp/>}/>
              <Route path = '/Profile' element = {<Profile/>}/>
              <Route path = '/Cart' element= {<Cart/>}/>
            </Routes>
        </div>
  );
}

export default App;
