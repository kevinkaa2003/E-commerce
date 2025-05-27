import React, { useState, useEffect, useRef, useContext } from 'react';
import Navbar from './Custom_Navbar';
import { DataContext } from './DataProvider.js';
import axios from 'axios';
import './Profile.css'; //CSS


const Profile = () => {
    
    const { userLoggedIn, setUserLoggedIn } = useContext(DataContext); 
    const { editProfile, setEditProfile } = useContext(DataContext);
    const [ firstName, setFirstName ] = useState('');
    const [ lastName, setLastName ] = useState('');
    const [ street, setStreet ] = useState('');
    const [ apartment, setApartment ] = useState('');
    const [ city, setCity ] = useState('');
    const [ stateProvince, setStateProvince ] = useState(''); 
    const [ country, setCountry ] = useState('');
    const [ phone, setPhone ] = useState('');
    const [ email, setEmail ] = useState(''); 

    //Edit button switch handler
    const editProfileHandler = () => {
        if (editProfile === false) {
            setEditProfile(true);
            localStorage.setItem('editProfile', 'true');
            console.log("Editing Profile.")
        } else {
            setEditProfile(false);
            localStorage.setItem('editProfile', 'false');
            console.log("Editing Completed.")
        }
    }

    const populateProfile = async (e) => {
       

        try {

            const response = await fetch('http://localhost:5000/profile',
                {
                    mode: 'cors',
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }, 
                    credentials: 'include', //Allow cookies to be sent and received
                })

            if (!response.ok) {
                console.error("Profile Data Response Error: ", response.statusText);
                return;
            }

            const data = await response.json(); //Properly parse response
            console.log("Profile Data Received: ", data);
            
            if (data.success) {

                //Set states for the received profile data
                    Promise.all([
                    setFirstName(data.data["First Name"]),
                    setLastName(data.data["Last Name"]),
                    setStreet(data.data["Street"]),
                    setApartment(data.data["Apartment"]), 
                    setCity(data.data["City"]),
                    setStateProvince(data.data["State/Province"]),
                    setCountry(data.data["Country"]),
                    setPhone(data.data["Phone"]),
                    setEmail(data.data["Email"]), 
                    ])
            } else {
                console.error("Profile data retrieval failed: ", data.message);
            }     
        } catch (error) {
            console.error("Could not Populate Profile Data: ", error); 
            
        }
    };
        
        
        
    

    //Call Populate Profile only when not editing
    if (editProfile === false) {
        populateProfile()
    }

    const sendProfileInfo = async (e) => {
        e.preventDefault(); //Prevent page reload

        try {
            const response = await fetch('http://localhost:5000/profile', 
            {
                mode: 'cors',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', //Allow cookies to be sent and received
                body: JSON.stringify({
                    firstName, 
                    lastName, 
                    street, 
                    apartment, 
                    city, 
                    stateProvince, 
                    country,
                    phone,
                    email 
                })
            });
         
            if(response.ok) {
                setEditProfile(false);
                console.log("Profile Updated Successfully!");

            } else {
                console.log("Profile Could Not be Updated.")

            } 
        } catch (error) {
            console.error("Error updating profile: ", error);
        }
    }

    return (
    
    <>
    <Navbar/>
    <div className='mainwrapper'>
        {editProfile === true ? ( //Check to see if user is editing profile
            <div className="profilemain">
                    <div className='profilewrapper'>
                        <strong>Profile</strong>
                        <br/>
                        <br/>
                        <button onClick = {editProfileHandler}>Edit Profile</button> 
                        <button onClick={sendProfileInfo}>Save Profile</button>
                        <br/>
                        <br/>
                        <div className='personalinfo'>
                            <strong>Personal Information</strong>
                            <br/>
                            <br/>
                            <div>
                                <label for='firstname' className='label-above'>First Name</label>
                                <input type='text' id='firstname' value={firstName} onChange={(e) => setFirstName(e.target.value)}></input>
                            </div>
                            <br/>
                            <br/>
                            <label for='lastname' className='label-above'>Last Name</label>
                            <input type='text' id='lastname'value={lastName} onChange={(e) => setLastName(e.target.value)}></input>
                            <br/>
                            <br/>
                            <label for='street' className='label-above'>Street</label>
                            <input type='text' id='street' value={street} onChange={(e) => setStreet(e.target.value)}></input>
                            <br/>
                            <br/>
                            <label for='apartment' className='label-above'>Apartment</label>
                            <input type='text' id='apartment' value={apartment} onChange={(e) => setApartment(e.target.value)}></input>
                            <br/>
                            <br/>
                            <label for='city' className='label-above'>City</label>
                            <input type='text' id='city' value={city} onChange={(e) => setCity(e.target.value)}></input>
                            <br/>
                            <br/>
                            <label for='stateprovince' className='label-above'>State/Province</label>
                            <input type='text' id='stateprovince' value={stateProvince} onChange={(e) => setStateProvince(e.target.value)}></input>
                            <br/>
                            <br/>
                            <label for='country' className='label-above'>Country</label>
                            <input type='text' id='country' value={country} onChange={(e) => setCountry(e.target.value)}></input>
                            <br/>
                            <br/>
                            <br/>
                        </div>
                        <div className='contactinfo'>
                            <strong>Contact Information</strong>
                            <br/>
                            <br/>
                            <label for='phone' className='label-above'>Phone</label>
                            <input type='phone' id='phone' value={phone} onChange={(e) => setPhone(e.target.value)}></input>
                            <br/>
                            <br/>
                            <label for='email' className='label-above'>E-mail</label>
                            <input type='email' id='email' value={email} onChange={(e) => setEmail(e.target.value)}></input>
                            <br/>
                            <br/>
                        </div>
                    </div>
            </div> 
        ) : ( 
            <div className="profilemain">
                <div className="profilewrapper">
                    <strong>Profile</strong>
                    <br/>
                    <br/>
                    <button onClick = {editProfileHandler}>Edit Profile</button>
                    <br/>
                    <br/>
                    <strong>Personal Information</strong>
                    <br/>
                    <br/>
                    <label>First Name</label>
                    <p>{firstName}</p>{/*RETRIEVED FROM BACKEND QUERY*/}
                    <br/>
                    <br/>
                    <label>Last Name</label>
                    <p>{lastName}</p> {/*RETRIEVED FROM BACKEND QUERY*/}
                    <br/>
                    <br/>
                    <label>Street</label>
                    <p>{street}</p> {/*RETRIEVED FROM BACKEND QUERY*/}
                    <br/>
                    <br/>
                    <label>Apartment</label>
                    <p>{apartment}</p> {/*RETRIEVED FROM BACKEND QUERY*/}
                    <br/>
                    <br/>
                    <label>City</label> 
                    <p>{city}</p> {/*RETRIEVED FROM BACKEND QUERY*/}
                    <br/>
                    <br/>
                    <label>State/Province</label>
                    <p>{stateProvince}</p> {/*RETRIEVED FROM BACKEND QUERY*/}
                    <br/>
                    <br/>
                    <label>Country</label>
                    <p>{country}</p> {/*RETRIEVED FROM BACKEND QUERY*/}
                    <br/>
                    <br/>
                    <br/>
                    <strong>Contact Information</strong>
                    <br/>
                    <br/>
                    <label>Phone</label>
                    <p>{phone}</p>{/*RETRIEVED FROM BACKEND QUERY*/}
                    <br/>
                    <br/>
                    <label>E-mail</label>
                    <p>{email}</p>{/*RETRIEVED FROM BACKEND QUERY*/}
                </div>
            </div>
        )}
    </div>
    </>  );
}
 
export default Profile;