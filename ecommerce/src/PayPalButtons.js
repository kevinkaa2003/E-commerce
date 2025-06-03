import './PayPalButtons.css';
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useState, useEffect } from 'react';
import axios from 'axios';
import emailjs from '@emailjs/browser';

//Declare base path for Paypal requests
const API_BASE_URL = 'http://localhost:5000/api';

//Checkout component
const Checkout = ({total, cartProducts, onPaymentSuccess}) => {

    //Declare variables
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);

    //Create order function
    const createOrder = async () => {
        //Check if order total is greater than zero
        if (Number(total) > 0) {

            //Declare response from post request
            const response = await axios.post(
                `${API_BASE_URL}/create-paypal-order`, // Full URL
                { amount: total.toString() }
            );

            return response.data.orderID; //Return OrderID from response
        } else {
            alert("Your Cart is Empty.");
        }
    };


    //Declare on approve function
    const onApprove = async (data) => {

        //Attempt Post request
        try {
            const captureResponse = await axios.post(
                `${API_BASE_URL}/capture-paypal-order`,
                {
                    orderID: data.orderID,
                    cartProducts: cartProducts
                }
            );

        const orderDetails = captureResponse.data.orderDetails; // Unpack Backend Response to obtain orderDetails

        // Prepare template params for EmailJS
        const templateParams = {
            payer_name: orderDetails.payerName,
            payer_email: orderDetails.emailEmail,
            orderID: orderDetails.paypalOrderId
        };

        //Send email.js message
        await emailjs.send(
            'service_nq9jxwl',
            'template_lvig8nl',
            templateParams,
            '5xgP6vguaJHGTQ-E4'
        );

        alert("Payment Successful!");
        onPaymentSuccess();
        setError(null);
        } catch (err) {
            console.error("Capture error:", err);
            throw err;
        }
    };


    return (
        <>
        <div className="checkout-container">
            {Number(total) === 0 && <div className="cartmessage">Cart is Empty</div>}
            <br/>
            <br/>
            <PayPalButtons
                style={{ layout: "vertical" }}
                createOrder = {createOrder}
                onApprove = {onApprove}
                onError={(err) => { console.error("Paypal Error: ", err);
                }}

                disabled={isProcessing}
            />
        </div>
     </>
    );
};

export default Checkout;
