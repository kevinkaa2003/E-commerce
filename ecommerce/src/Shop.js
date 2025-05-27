import './Shop.css';
import city1 from './beijing.jpg';
import React, { useState, useEffect, useRef,  useContext } from 'react';
import { DataContext } from './DataProvider.js';

const Shop = () => {

  const [ products, setProducts ] = useState([]);
  const { cartProducts, setCartProducts, addProduct } = useContext(DataContext);
 


  const obtainProductData = async (e) => {
    
      try {

        const response = await fetch('http://localhost:5000/shop',
          {
            method: 'GET', //GET Method for obtaining product data
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include', //This allows cookies to be sent and received
          }
          );

          const data = await response.json();

          
          if (response.ok) {
            console.log('Product Data Obtained', data);

            setProducts(data.products);
            console.log('Shop products set: ', data.products);
          
            

          }
          else {
            console.log('Product Data Get Request to Server Failed.')
          }

        }
        catch (error) {
          console.error("Product Fetch Error:", error.response ? error.response.data : error.message);

        }

       
    };
    
    //Load Shop on page render
   useEffect(() => {
    obtainProductData();
   }, []);


  return (
  <>
  <div className='shopwrapper'>
    <br/>
    <br/>
    <br/>
      <strong>SHOP:</strong>
      <div className="product-grid">
          {products.map((product, index) => (
            <div key={index} className="product-card">
              <img src={product.Product_Image} alt={product.Product_Name} />
              <p>{product.Product_Name}</p>
              <p>Price: ${product.Product_Price}</p>
              <button className="addtocart" onClick={() => addProduct(product)}>Add to Cart</button>
            </div>
          ))}
      </div>
  </div>
  <div>
    
  </div>
  </>
  );
}
  
export default Shop;
  