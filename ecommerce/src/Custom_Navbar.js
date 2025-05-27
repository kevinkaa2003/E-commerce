import React, { useState, useEffect, useContext } from 'react';
import './Custom_Navbar.css';
import { useNavigate } from 'react-router-dom';
import { DataContext } from './DataProvider.js';
 

const Navbar = () => {

    const[searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const[isInputFocused, setIsInputFocused] = useState(false);
    const searchBar = document.getElementById('searchbar');
    const searchResultsDiv = document.getElementById('search-results');
    const { editProfile, setEditProfile, userLoggedIn, setUserLoggedIn } = useContext(DataContext);



    useEffect( () => {
        const searchBar = document.getElementById('searchbar');
        const searchResultsDiv = document.getElementById('search-results');
          
        const handleInput = (event) => {
            if (isInputFocused) {
               if (event.target.value.length > 0) {
                    searchResultsDiv.style.display = 'block';
               }
            
                else {
                    searchResultsDiv.style.display = 'none';
                }
            } else {
                searchResultsDiv.style.display = 'none';
            }
            
        };
         
        const handleFocus = () => {
            setIsInputFocused(true); //Set focus flag
           
            if(searchTerm.length > 0) {
                searchResultsDiv.style.display = 'block';
            }
                if(searchTerm.length > 0 && searchResults.length == 0) {
                searchResultsDiv.style.display = 'block';
            } else {
                searchResultsDiv.style.display = 'none';
            }

        };

        searchBar.addEventListener('input', handleInput);
        searchBar.addEventListener('focus', handleFocus);
        
    }, [isInputFocused, searchTerm, searchResults]);


   
    //Search Function
    function search(event) {

        const input = event.target.value.toLowerCase();
        setSearchTerm(input); //Update the state
       
        const searchItems = [
            { name: "Home", url: "/" },
            { name: "Contact", url: "/Contact" },
            { name: "Phone", url: "/Contact" },
            { name: "Address", url: "/Contact" },
            { name: "E-mail", url: "/Contact" },
            { name: "email", url: "/Contact" },
            { name: "Services", url: "/#services" },

         ];
         
         const filteredSearch = searchItems.filter(searchItems => searchItems.name.toLowerCase().includes(input));
            
         setSearchResults(filteredSearch);
    };
    
    
    function renderSearchResults(searchResults, searchTerm) {
        //Check if there are search results
        if (searchResults.length > 0) {
            return searchResults.map(function(result, index) {
                return (
                    <a key={index} onClick={() => navigate(result.url)}>{result.name}</a>
                )
            });
        }   
        
        
        //Check if the search term is present and no results were found
        else if (searchTerm.length > 0) {
            return (
                <div>No Results Matched your Search</div>
            );
        }
        // If no search term is present, do not display anything
        else {
            return null; //No need to render anything
        }
    };


    

    //Navigation 
    const navigate = useNavigate(); 

    const goToHome = () => {
        navigate('/');
        setEditProfile(false); //Ensures Profile page refreshes on return
    };

    const goToContact = () => {
        navigate('/Contact');
        setEditProfile(false);
    };
    const goToServices = () => {
        setEditProfile(false);
        navigate('/#services');//Navigate to Home, then scroll
        setTimeout(() => {
            const element = document.getElementById('services');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100); //Small delay to ensure navigation
    };

    const goToProfile = () => {
        navigate('/Profile');
        setEditProfile(false); //Ensures Profile page refreshes on return 
    };

    const goToCart = () => {
        navigate('/Cart');
    };

    const logout = () => {
        setUserLoggedIn(false);
        localStorage.setItem('userLoggedIn', 'false');
        console.log(userLoggedIn, localStorage.getItem('userLoggedIn'));
        navigate('/Login');
    }

    return ( 

        <> 
        <div className="navbar">
            <div className="navbarcomponents">
                <div className = "navbarhome">
                    <button className = "navbarhomebtn" onClick={goToHome}>
                        Home
                    </button>
                </div>
                <div className="search"> {/*Search Bar */}
                    <input id="searchbar" 
                    value = {searchTerm}
                    onChange= {search}
                    type="text"
                    placeholder="Search..."/>
                    <div className="search-results" id="search-results"> 
                        {renderSearchResults(searchResults, searchTerm)}
                    </div>
                </div>
                <div className='cart'>
                    <button onClick={goToCart}>Cart</button>
                </div>
                <div className='profile'>
                    <button onClick={goToProfile}>Profile</button>
                </div>
                <div className="dropdowncontact"> {/*Create link to contact form. Create Links to each social media and list phone,email, and office location in DIV*/}
                    <button className="dropdowncontactbtn" onClick={goToContact}><a>Contact</a>
                    </button>
                    <div className="dropdown-content-contact">
                        <br/>
                        <p>Phone: +X (XXX)-XXX-XXXX </p>
                        <br/>
                        <br/>
                        <p>E-mail: PLACEHOLDER </p>
                        <br/>
                        <br/>
                        <p>Address: PLACEHOLDER </p>
                        <br/>
                        <br/>
                        <a href="#" className="facebooknav">Facebook</a>
                        <a href="#" className="twitternav">Twitter</a>
                        <a href="#" className="instagramnav">Instagram</a>
                    </div>
                </div>
                <div className='logout'>
                    <button onClick={logout}>Logout</button>
                </div>
            </div>
        </div>
        </>

     );
}
 
export default Navbar;

