import React, { createContext, useContext, useState, useEffect } from 'react';


//Create Context
export const DataContext = createContext();


//Create Provider Element
export const DataProvider = ({children}) => {


    //userLoggedIn variable handling
    const [ userLoggedIn, setUserLoggedIn ] = useState(()=> {
        return JSON.parse(localStorage.getItem('userLoggedIn') || 'false');
    });

    //editProfile variable
    const [ editProfile, setEditProfile ] = useState(false);

    //State to store cart product IDs for use on Cart Page
    const [ cartProducts, setCartProducts ] = useState([]);

    //Function For Filtering Product Object Key Value Pairs
    const getValues = (obj, keys) => {
        return keys.map(key => obj[key]);
    }

    //Function for adding a product to the local storage 'cartProducts' variable
    const addProduct = (product) => {
            const keys = ['Product ID', 'Product Name']
            const stored = localStorage.getItem('cartProducts');
            const existingCart = stored ? JSON.parse(stored) : [];
            const filtered = getValues(product, keys);
            existingCart.push(filtered);

            localStorage.setItem('cartProducts', JSON.stringify(existingCart));
            console.log("Cart Products from Data Provider: ", JSON.parse(localStorage.getItem('cartProducts')));
            setCartProducts(existingCart); //Optional???


        };


    //set cartProducts to the local storage data for 'cartProducts' on page load
    useEffect(() => {
        const stored = localStorage.getItem('cartProducts');
        const savedCart = stored ? JSON.parse(stored) : [];
        setCartProducts(savedCart);
    }, []);

    //Delete cart function
    const deleteCart = () => {
        const existingCart = JSON.parse(localStorage.getItem('cartProducts') || []);
        existingCart.splice(0, existingCart.length)
        localStorage.setItem('cartProducts', JSON.stringify(existingCart));
        console.log('Cart Deleted', existingCart);


    }

    //Values to be passed to children
    const values = {userLoggedIn, setUserLoggedIn, editProfile, setEditProfile, cartProducts, setCartProducts, addProduct, deleteCart}


    return (<DataContext.Provider value ={values}>{/*Pass States to Children*/}
                {children}
            </DataContext.Provider>
    );
};
