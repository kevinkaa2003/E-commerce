import React, { useState, useEffect, useContext } from 'react';
import './Custom_Navbar.css';
import { useNavigate } from 'react-router-dom';
import { DataContext } from './DataProvider.js';

//Navbar component
const Navbar = () => {

    //Declare Variables
    const[searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const[isInputFocused, setIsInputFocused] = useState(false);
    const { editProfile, setEditProfile, userLoggedIn, setUserLoggedIn } = useContext(DataContext);

    //Conditional Rendering of Search Results
    {isInputFocused && (searchTerm.length > 0 || searchResults.length > 0) && (
        <div className='search-results' id='search-results'>
            {renderSearchResults(searchResults, searchTerm)}
        </div>
    )}



    //Search Function
    function search(event) {

        const input = event.target.value.toLowerCase();
        setSearchTerm(input); //Update the state

        const searchItems = [
            { name: "Home", url: "/" },
            { name: "Cart", url: "/Cart" },
            { name: "Profile", url: "/Profile" },
            { name: "Info", url: "/Profile" },
            { name: "Contact", url: "/Contact" },
            { name: "Phone", url: "/Contact" },
            { name: "Address", url: "/Contact" },
            { name: "E-mail", url: "/Contact" },

         ];

         const filteredSearch = searchItems.filter(searchItems => searchItems.name.toLowerCase().includes(input));

         setSearchResults(filteredSearch);
    };

    //Render search results function
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
                <div className='noresultsdiv'>No Results Matched your Search</div>
            );
        }
        // If no search term is present, do not display anything
        else {

            return null ; //No need to render anything
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

    const goToProfile = () => {
        navigate('/Profile');
        setEditProfile(false); //Ensures Profile page refreshes on return
    };

    const goToCart = () => {
        navigate('/Cart');
    };


    //Logout function
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
                    onFocusCapture={() => setIsInputFocused(true)}
                    onBlur={() => setTimeout(() => setIsInputFocused(false), 200)}
                    type="text"
                    placeholder="Search..."/>
                    {isInputFocused && (searchTerm.length > 0 || searchResults.length > 0) && (
                        <div className="search-results" id="search-results">
                            {renderSearchResults(searchResults, searchTerm)}
                        </div>
                    )}
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
