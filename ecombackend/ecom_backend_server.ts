require('dotenv').config(); //.env file processing



const express = require('express'); //Import Express with parameters
/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */

const axios = require('axios'); //Import axios
const router = express.Router(); //Express Router




//Paypal
const PAYPAL_API = 'https://api.sandbox.paypal.com';
const paypal = require('@paypal/checkout-server-sdk');

// Replace hardcoded credentials with environment variables
const CLIENT_ID = process.env.PAYPAL_CLIENT_ID; // Move to .env
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET; // Move to .env
console.log("PAYPAL_CLIENT_ID:", process.env.PAYPAL_CLIENT_ID);
console.log("PAYPAL_CLIENT_SECRET:", process.env.PAYPAL_CLIENT_SECRET);

// Proper PayPal client setup
const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);

const client = new paypal.core.PayPalHttpClient(environment);


//Web token
const jwt = require('jsonwebtoken'); //Web Token
const SECRET_KEY = process.env.JWT_SECRET || "Frambleton3!"; //Store secret key in .env file\
const cookieParser = require('cookie-parser'); //Needed to parse cookies

//Database Connection
const { Pool } = require('pg');

//Cross-Origin Requests
const cors = require('cors');
const corsOptions = {
  origin: ['http://localhost:3000', 'https://www.sandbox.paypal.com'],
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type, Authorization',
  credentials: true,
};

//Needed for middleware
const bodyParser = require('body-parser');

//Encrypt data to send to Database
const bcrypt = require('bcrypt');

//Middleware to authenticate JWT tokens before allowing access to protected routes
/**
 * @typedef {Object} AuthenticatedRequest
 * @property {Object} user
 * @property {number} user.User_ID
 * @property {string} user.username
 */

//Encrypt data to send to Database
const app = express();
app.use(express.json({ limit: '1gb' })); //Increase JSON payload size
app.use(express.urlencoded({ extended: true, limit: '1gb' }));
const fs = require('fs'); //File system reader


//Middleware: Allow cross-origin requests from React Front-end
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser()); //Middleware that parses cookies

//Middleware to Authenticate token before allowing access to protected routes
const authenticateToken = (req, res, next) => {
    console.log("Request Headers: ", req.headers);
    console.log("Received Cookies: ", req.cookies);

    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1]; //Get token from Bearer header.

    if(!token) {
        return res.status(401).json({message: 'Access Denied: No Token Provided'});
    }

    //Verify the token
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            console.log("JWT Verification failed: ", err.message);
            return res.status(403).json({ message: 'Token is invalid or expired' });
        }

        console.log("Decoded User: ", user);

        //If token is valid, attach user data to request object
        req.authUser = user; //This is the decoded token payload
        next(); //Proceed to the next middleware or route handler
    })
};

//Connect to the database
const db = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'Frambleton3!',
    database: process.env.DB_NAME || 'postgres',
    port: process.env.DB_PORT || 5432,
});

//Declare products
const product1 = {
    Product_ID: 11111,
    Product_Name: 'Phone',
    Product_Image: fs.readFileSync('./phone.jpg'),
    Product_Video: '',
    Product_Price: 1.11,


};

const product2 = {
    Product_ID: 22222,
    Product_Name: 'Shoe',
    Product_Image: fs.readFileSync('./shoe.jpg'),
    Product_Video: '',
    Product_Price: 2.22,


};

const product3 = {
    Product_ID: 33333,
    Product_Name: 'Smart Watch',
    Product_Image: fs.readFileSync('./smartwatch.jpg'),
    Product_Video: '',
    Product_Price: 3.33,

}

const product4 = {
    Product_ID: 44444,
    Product_Name: 'Hat',
    Product_Image: fs.readFileSync('./hat.jpg'),
    Product_Video: '',
    Product_Price: 4.44,

}

const product5 = {
    Product_ID: 55555,
    Product_Name: 'Speaker',
    Product_Image: fs.readFileSync('./speaker.jpg'),
    Product_Video: '',
    Product_Price: 5.55,

}

const product6 = {
    Product_ID: 66666,
    Product_Name: 'Sweater',
    Product_Image: fs.readFileSync('./sweater.jpg'),
    Product_Video: '',
    Product_Price: 6.00,

}

const product7 = {
    Product_ID: 77777,
    Product_Name: 'TV',
    Product_Image: fs.readFileSync('./tv.jpg'),
    Product_Video: '',
    Product_Price: 28.99,

}

const product8 = {
    Product_ID: 88888,
    Product_Name: 'Monitor',
    Product_Image: fs.readFileSync('./monitor.jpg'),
    Product_Video: '',
    Product_Price: 8.88,

}

//Insert products database
db.query(`INSERT INTO "Product Data Schema"."Product Data Table" ("Product ID", "Product Name", "Product Image", "Product Video", "Product Price") VALUES ($1, $2, $3, $4, $5), ($6, $7, $8, $9, $10), ($11, $12, $13, $14, $15), ($16, $17, $18, $19, $20), ($21, $22, $23, $24, $25), ($26, $27, $28, $29, $30), ($31, $32, $33, $34, $35), ($36, $37, $38, $39, $40) ON CONFLICT ("Product ID") DO UPDATE SET "Product Name" = EXCLUDED."Product Name", "Product Image" = EXCLUDED."Product Image", "Product Video" = EXCLUDED."Product Video", "Product Price" = EXCLUDED."Product Price"`,

    [product1.Product_ID,
    product1.Product_Name,
    product1.Product_Image,
    product1.Product_Video,
    product1.Product_Price,

    product2.Product_ID,
    product2.Product_Name,
    product2.Product_Image,
    product2.Product_Video,
    product2.Product_Price,

    product3.Product_ID,
    product3.Product_Name,
    product3.Product_Image,
    product3.Product_Video,
    product3.Product_Price,

    product4.Product_ID,
    product4.Product_Name,
    product4.Product_Image,
    product4.Product_Video,
    product4.Product_Price,

    product5.Product_ID,
    product5.Product_Name,
    product5.Product_Image,
    product5.Product_Video,
    product5.Product_Price,

    product6.Product_ID,
    product6.Product_Name,
    product6.Product_Image,
    product6.Product_Video,
    product6.Product_Price,

    product7.Product_ID,
    product7.Product_Name,
    product7.Product_Image,
    product7.Product_Video,
    product7.Product_Price,

    product8.Product_ID,
    product8.Product_Name,
    product8.Product_Image,
    product8.Product_Video,
    product8.Product_Price

    ]

)
.then(res => console.log('Product Database Insert Successful!'))
.catch(err => console.log('Error Uploading Products: ', err));


//Login Handling
app.post('/login', async (req, res) => {

    const { username, password } = req.body; //Unpack request

    //Check for valid username and password in request
    if(!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });

    }

    try {
        //Query the "User Information" table within the "User Information" schema
        const sql = `SELECT "User ID", "Username", "Password" FROM "User Information"."User Information" WHERE "Username" = $1`; //Login Query

        const result = await db.query(sql, [username]); //Query Result

        //Log the result for debugging purposes
        console.log("Query Result: ", result.rows);

        if (result.rows.length > 0) { //If there is a successful result with data

            const user = result.rows[0]; //Access first row in the result
            console.log("User found: ", user); //Check the user object to see if it contains Password

            //Debug
            console.log("Entered Password: ", password);
            console.log("Stored Password Hash: ", user.Password);

            //Trim extra spaces from the entered password
            const enteredPassword = password.trim();
            const storedPasswordHash = user.Password.trim(); //Hashed password from database

            //Check if the Password field exists and compare it
            if (user && user.Password) {

                //Use bcrypt to compare entered password (plaintext) with hashed password (from DB)
                const passwordMatch = await bcrypt.compare(enteredPassword, storedPasswordHash);

                //Debug password match
                console.log('Password match: ', passwordMatch);

                if (passwordMatch) {
                    console.log("User ID to be signed: ", user.User_ID);

                    //Generate JWT Token
                    const token = jwt.sign(
                        {
                            User_ID: user["User ID"],
                            username: user.Username
                        },
                        SECRET_KEY,
                        {expiresIn: '1h'} //Token expires in 1 hour.

                    );

                    //Set the token in an HTTP-only cookie
                    res.cookie('token', token, {
                        httpOnly: true, //Cookie is inaccessible to Javascript
                        secure: true,
                        maxAge: 3600000, //1 hour
                        sameSite: 'Strict' //Helps Prevent CSRF Attacks
                    });

                    //Decode the token (DEBUG)
                    const decodedToken = jwt.decode(token);
                    console.log("Decoded Token: ", decodedToken);
                    res.status(200).json({ success: true, message: 'Login Successful' });
                } else {
                    res.status(401).json({ success: false, message: 'Incorrect Username or Password' });

                }
            } else {
                res.status(401).json({ success: false, message: "Password not found in database" });

            }
        } else {
            res.status(401).json({ success: false, message: 'Incorrect Username' });
        }
    } catch (error) {
        console.error('Login error: ', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
});

//Sign Up Handling
app.post('/signup', async (req, res) => {
    let { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and Password Required" });

    }

    //Trim submissions
    username = username.trim();
    password = password.trim();

    //Password Complexity (EXPAND FUNCTIONALITY)
    if(password.length < 6 ) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" })
    }

    try {

        //Check for existing users that match username input (NO DUPLICATES)
        const userExists = await db.query(
            `SELECT "Username" FROM "User Information"."User Information" WHERE "Username" = $1`,
             [username]
        );

        if (userExists.rows.length > 0) {

            return res.status(400).json({ success: false, message: "Username already exists." })
        }

        //Hash Password before sending to database
        const hashedPassword = await bcrypt.hash(password, 12);


        //Query the "User Information" table within the "User Information" Schema. Return the User ID and Username to generate the web token after successful query.
        const newUser = await db.query(
            `INSERT INTO "User Information"."User Information" ("Username", "Password") VALUES ($1, $2) RETURNING "User ID", "Username"`,
            [username, hashedPassword]
        );

        const user = newUser.rows[0] //Defined by query (Contains User ID)

        //Generate JWT Token upon successful signup
        const token = jwt.sign(
            {
                User_ID: user["User ID"],
                username: user.Username
            },
            SECRET_KEY,
            {expiresIn: '1h'} //Token expires in 1 hour.
        );

        //Set the token in an HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true, //Cookie is inaccessible to Javascript
            secure: process.env.NODE_ENV === 'production', //Set secure flag during production
            maxAge: 3600000, //1 hour
            sameSite: 'Strict' //Helps prevent CSRF
        });

        console.log("User Signed Up!");
        res.status(201).json({ success: true, message: "User signed up successfuly" });
    } catch (error) {
        console.error("Error Signing up User: ", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});


//Profile Handling
app.post('/profile', authenticateToken, async (req, res) => {
    let { firstName, lastName, street, apartment, city, stateProvince, country, phone, email } = req.body; //Unpack request from frontend

    //Evaluate if any of the fields have an input and are not blank. If false, return an error.
    if (![firstName, lastName, street, apartment, city, stateProvince, country, phone, email].some(field => field && field.trim() !== "")) {
        return res.status(400).json({ success: false, message: "Please update at least one field within your peronal information" })
    }

    //Ensure User_ID exists
    if(!req.authUser?.User_ID) {
        return res.status(401).json({ success: false, message: "Unauthorized: User ID not found" })
    }
    console.log("User ID from token: ", req.authUser.User_ID);

    try {
        //Trim submissions before sending to database
            firstName = firstName.trim();
            lastName = lastName.trim();
            street = street.trim();
            apartment = apartment.trim();
            city = city.trim();
            stateProvince = stateProvince.trim();
            country = country.trim();
            phone = phone.trim();
            email = email.trim();


        //Insert Query for Profile Info
        const result = await db.query(`UPDATE "User Information"."User Information"
            SET "First Name" = $1, "Last Name" = $2, "Street" = $3, "Apartment" = $4, "City" = $5, "State/Province" = $6, "Country" = $7, "Phone" = $8, "Email" = $9
            WHERE "User ID" = $10 RETURNING *`,
            [firstName, lastName, street, apartment, city, stateProvince, country, phone, email, req.authUser.User_ID]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        res.status(201).json({ success: true, message: "User Profile Update Successfully" });

    } catch (error) {
        console.error("Error updating profile information: ", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});


//Retrieve profile data from database
app.get('/profile', authenticateToken, async (req, res) => {
    const response = await db.query(`SELECT * FROM "User Information"."User Information" WHERE "User ID" = $1`,
        [req.authUser.User_ID]
    );

    if (response.rows.length > 0) {
        res.json({ success: true, message: "Profile Data Query Successful", data: response.rows[0] })
        console.log("Profile Data Received: ", response.rows[0] );

    } else {
        console.log("Could not query profile data.");
    }
});

//Retrieve Product Data for Shop Component
app.get('/shop', authenticateToken, async (req, res) => {

    const response = await db.query(`SELECT * FROM "Product Data Schema"."Product Data Table"`); //Query to database to obtain products.



    if (response.rows.length > 0) { //If there is a successful product pull

        const formattedRows = response.rows.map(product => ({
            ...product,
            Product_Name: product["Product Name"],
            Product_Image: product["Product Image"] ? `data:image/jpeg;base64,${product["Product Image"].toString('base64')}` : '',
            Product_Video: product["Product Video"] ? `data:video/mp4;base64,${product["Product Video"].toString('base64')}` : '',
            Product_Price: product["Product Price"]

        }));
        res.json({ success: true, message: "Product Data Query Successful", products: formattedRows })
        console.log("Product Data Received: ", response)
    } else {
        console.log("Could not query product schema.");
    }
});


//Pull products from database after validating cartProducts
app.post('/cart', authenticateToken, async (req, res) => {

    const cartProducts = req.body.cartProducts; //Access request body properly

    if (!Array.isArray(cartProducts) || cartProducts.length === 0) {
        return res.status(400).json({success: false, message: "No products in cart."})
    }

    const values = []; //Declare array to push cart products into

    //Declare conditions for database query.
    const conditions = cartProducts.map((product, index) => {
        const idParam = `$${values.length + 1}`;
        const nameParam = `$${values.length + 2}`;
        values.push(product[0], product[1]);

        return `("Product ID" = ${idParam} AND "Product Name" = ${nameParam})`;
    }).join(' OR ');


    //Query to pull matching products from database
    const query = `SELECT * FROM "Product Data Schema"."Product Data Table" WHERE ${conditions}`;

    try {

        //Query Database
        const response = await db.query(query, values);
        res.json({success: true, message: "Cart Query Successful", products: response.rows });

    } catch (error) {
        console.error("Error Fetching Cart Products: ", error);
        res.status(500).json({success: false, message: "Database error" });
    }

});




//Helper function to get PayPal access token
const getPayPalAccessToken = async () => {
    try {
        const response = await axios.post(`${PAYPAL_API}/v1/oauth2/token`, 'grant_type=client_credentials',
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            auth: {
                username: CLIENT_ID,
                password: CLIENT_SECRET
            }

        }
    );

    return response.data.access_token;

    } catch (error) {
        console.error('Error getting PayPal access token:', error.response.data);
        throw error;
    }
};

// Create PayPal Order
app.post('/api/create-paypal-order', async (req, res) => {

  const { amount } = req.body; //Total amount of cart

  // Validate amount format (string representing a positive number)
  if (!amount || isNaN(amount)) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  else if (Number(amount) <=0) {
    return res.status(400).json({ error: 'Cart Empty' });
  }

  //Submit the create order request
  try {

    const request = new paypal.orders.OrdersCreateRequest(); //Declare request
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: amount,
          },
        },
      ],
      application_context: {
        shipping_preference: 'GET_FROM_FILE', //Shipping Info Returned
      }
    });

    //Declare order and send to frontend
    const order = await client.execute(request);
    res.json({

        orderID: order.result.id,
        shippingInfo: order.result.purchase_units?.[0]?.shipping || null

     });
  } catch (error) {
    console.error("Error creating PayPal order:", error);
    res.status(500).json({ success: 'false', message: "Failed to create PayPal order: ", error });
  }
});

// Capture PayPal Order
app.post('/api/capture-paypal-order', async (req, res) => {

//Submit order request
  try {
    const { orderID } = req.body;
    const { cartProducts } = req.body;
    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    const response = await client.execute(request);
    const result = response.result

    // Get payer and shipping info
    const payer = result.payer;
    const purchaseUnit = result.purchase_units?.[0]; // Only using first unit (usually only one)
    const shipping = purchaseUnit?.shipping;
    const address = shipping?.address;

    // Construct order details
    const orderDetails = {
      paypalOrderId: result.id,
      status: result.status,
      payerEmail: payer?.email_address,
      payerName: `${payer?.name?.given_name || ''} ${payer?.name?.surname || ''}`.trim(),
      shippingAddress: {
        name: shipping?.name?.full_name,
        address_line_1: address?.address_line_1,
        address_line_2: address?.address_line_2,
        admin_area_1: address?.admin_area_1, // state/province/region
        admin_area_2: address?.admin_area_2, // city/town
        postal_code: address?.postal_code,
        country_code: address?.country_code,
      },
      cartProducts: cartProducts,
    };

    //Debug
    console.log("Order Details: ", orderDetails);
    console.log("Cart products: ", orderDetails["cartProducts"]);

    // Save to database
    const orderquery = `INSERT INTO "Order Documentation"."Order Documentation Table" ("Order ID", "Shipping Address", "Product ID", "Product Name", "Payer Name", "Payer Email") VALUES ($1, $2, $3, $4, $5, $6)`

    //For loop to insert order data into database for each product
    for (const product of cartProducts) {
        await db.query(orderquery, [orderDetails["paypalOrderId"], JSON.stringify(orderDetails["shippingAddress"]), product["Product ID"], product["Product Name"], orderDetails["payerName"], orderDetails["payerEmail"]]);
    }


    //Send response to frontend
    res.json({
      status: 'COMPLETED',
      details: response.result,
      orderDetails: orderDetails
    });

  } catch (err) {
    console.error('PayPal capture order error:', err);
    res.status(500).json({ error: err.message });
  }
});


//Delete Profile Processing
app.post('/deleteprofile', authenticateToken, (req, res) => {

    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1]; //Obtain token from cookies or request header

    if (!token) {
        return res.status(401).json({ success: false, message: "No token provided" });
    }

    let decoded; //Declare decoded variable to be used

    //Verify token and assign to decoded variable
    try {
        decoded = jwt.verify(token, SECRET_KEY); //Decode Token to obtain User ID

    } catch (err) {
        return res.status(403).json({ success: false, message: 'Invalid Token' });
    }

    //Obtain userID from token
    const userId = decoded.User_ID;

    //Delete query
    const deleteQuery = `DELETE FROM "User Information"."User Information" WHERE "User ID" = $1`;

    //Query database to delete profile
    db.query(deleteQuery, [userId])
        .then(() => {
            res.status(200).json({ success: true, message: 'Profile Deleted Successfully' });
        })
        .catch(err => {
            console.error("Database error: ", err);
            res.status(500).json({ success: false, message: err });
        });
});

//Declare port number
const PORT = process.env.PORT || 5000;
//Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
