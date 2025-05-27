import './Cart.css';
import { useState, useEffect, useContext } from 'react';
import Navbar from './Custom_Navbar.js';
import { DataContext } from './DataProvider.js';
import { useNavigate } from 'react-router-dom';



const Cart = () => {

    const navigate = useNavigate();
    const { deleteCart } = useContext(DataContext);
    const [ fetchedCartProducts, setFetchedCartProducts ] = useState([]);
    const stored = localStorage.getItem('cartProducts');

    
    const cartProducts = stored ? JSON.parse(stored) : [];
    
  

    const fetchCartData = async (e) => {
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

            const fullCart = cartProducts.map(([id]) => {
                return data.products.find(prod =>prod["Product ID"] === id);
            });
            setFetchedCartProducts(fullCart);
            

        } catch (error) {
            console.error("Could Not Fetch Cart Data: ", error);
        }
    }

    const total = () => {
        return fetchedCartProducts.reduce((sum, product) => sum + Number(product["Product Price"]), 0);
    };

    //Fetch Cart Data on page load
    useEffect(() => {
        fetchCartData();
    }, []);

    const cartDisplay = () => {
        return (
            <>{/*Integrate with Paypal???*/}
            <div className='cartmain'>
                <div className='paymentinfo'>
                    <form id='paymentinfoform'>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <label for="cardnumber">
                            Card Number:
                        </label>
                        <br/>
                        <input type='text' id="cardnumber" name='cardnumber'></input>
                        <br/>
                        <br/>
                        <label for="expiration">
                            Expiration Date:
                        </label>
                        <br/>
                        <input type='date' id="expiration" name='expiration'></input>
                        <br/>
                        <br/>
                        <label for='cvv'>
                            CVV:
                        </label>
                        <br/>
                        <input type='text' id="cvv" name='cvv'></input>
                        
                        
                    </form>
                </div>
                
                <div className="cartinfo">
                    <br/>
                    <br/>
                    {fetchedCartProducts.map((product, index) => (
                    <div key={index} className="cartproduct">
                        <p>{`${product["Product Name"]}`}</p>
                        <p>${`${product["Product Price"]}`}</p>
                        
                    </div>
                ))}
                    <br/>
                    <br/>
                    <div className='carttotal'>
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



    return (
    <>
    <Navbar></Navbar>
    {cartDisplay()}
    
    </>  );
}
 
export default Cart;