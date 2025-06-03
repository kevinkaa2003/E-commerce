import './Cart.css';
import { useState, useEffect, useContext } from 'react';
import Navbar from './Custom_Navbar.js';
import CustomFooter from './Custom_Footer.js';
import { DataContext } from './DataProvider.js';
import { useNavigate } from 'react-router-dom';
import { PayPalScriptProvider } from "@paypal/react-paypal-js"; //PayPal Import
import Checkout from './PayPalButtons.js';
import emailjs from '@emailjs/browser';


//Cart component
const Cart = () => {

    //Declare Variables
    const navigate = useNavigate();
    const { deleteCart } = useContext(DataContext);
    const [ fetchedCartProducts, setFetchedCartProducts ] = useState([]);
    const stored = localStorage.getItem('cartProducts');
    const cartProducts = stored ? JSON.parse(stored) : [];




    //Function for fetching cart data
    const fetchCartData = async (e) => {

        //POST request to obtain cart data using cartProducts
        try {

            const response = await fetch('http://localhost:5000/cart',
                {
                    mode: 'cors',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include', //Allow cookies to be sent and received
                    body: JSON.stringify({cartProducts})
            });

            if (!response.ok) {
                console.error("Cart Data Fetch Error: ", response.statusText);
                return;
            }

            const data = await response.json(); //Properly parse response
            console.log("Cart Data Received: ", data);

            //Declare fullCart variable that is a map of the data returned from the POST request
            const fullCart = cartProducts.map(([id]) => {
                return data.products.find(prod =>prod["Product ID"] === id);
            });
            setFetchedCartProducts(fullCart);


        } catch (error) {
            console.error("Could Not Fetch Cart Data: ", error);
        }
    }

    //Calculate total function
    const total = () => {

        const rawTotal = fetchedCartProducts.reduce((sum, product) => sum + Number(product["Product Price"]), 0);

        return rawTotal.toFixed(2); //Reduce total to two decimal places
    };

    //Fetch Cart Data on page load
    useEffect(() => {
        fetchCartData();
    }, []);


    //Cart display function
    const cartDisplay = () => {
        return (
            <>
            <div className='cartmain'>
                <div className='paymentinfo'>
                    <div className='paymenttitle'>Payment</div>
                    <br/>
                   <PayPalScriptProvider
                        options={{
                            "client-id": "AflkHTwJg57QfgHe6h9UeGlTmTQqky4v1zvIfox_YLbprrMa9dwL-pg2mH0qqQIApalZX7S8BMqhQBsR", // Get this from PayPal Developer Dashboard
                            currency: "USD",  // Corrected parameter name
                            intent: "capture",
                            // Add components if using advanced features
                            components: "buttons,hosted-fields"
                        }}
                        >
                    <Checkout total={total()} onPaymentSuccess={handlePaymentSuccess} cartProducts={fetchedCartProducts}/>
                    </PayPalScriptProvider>
                </div>
                <div className="cartinfo">
                    <div className='carttitle'>Cart</div>
                    <br/>
                    {fetchedCartProducts.map((product, index) => (
                    <>
                    <div key={index} className="cartproduct">
                        <span>{`${product["Product Name"]}: `} ${`${product["Product Price"]}`}</span>
                    </div>
                    <br/>
                    </>
                ))}
                    <br/>
                    <br/>
                    <div className='carttotal'>
                        <br/>
                        Total: ${total()}
                    </div>
                    <br/>
                    <br/>
                    <div className='deletecart'>
                        <button onClick={() => {
                            deleteCart();
                            setFetchedCartProducts([]);
                            }}>Delete Cart</button>
                    </div>
                </div>
            </div>
            </>
        );
    }


    //Successful payment function
    const handlePaymentSuccess = () => {
        //Clear cart, show success message, etc.
        setFetchedCartProducts([]);
        localStorage.setItem('cartProducts', JSON.stringify([]));
        alert('Payement successful! Thank you.');

    };


    return (
        <>
        <Navbar></Navbar>
        {cartDisplay()}
        <CustomFooter/>
        </>
    );
}

export default Cart;
