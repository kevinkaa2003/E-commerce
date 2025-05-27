const express = require('express'); //Import Express
/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */

const axios = require('axios'); //Import axios
const jwt = require('jsonwebtoken'); //Web Token
const SECRET_KEY = process.env.JWT_SECRET || "Frambleton3!"; //Store secret key in .env file\
const dotenv = require('dotenv'); //Load Environment Variables
dotenv.config(); //Load Environment variables
const cookieParser = require('cookie-parser'); //Needed to parse cookies
const ALPHA_VANTAGE_KEY = 'UGI5N3WT6XJKZHYT'; //Alpha Vantage API Key
const { Pool } = require('pg'); //Database Connection
const cors = require('cors'); //Cross-Origin Requests
const corsOptions = {
    origin: 'http://localhost:3000',
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true, //Allow cookies
}; //Cross-Origin Request Parameters
const bodyParser = require('body-parser'); //Needed for middleware
const bcrypt = require('bcrypt'); //Encrypt data to send to Database

//Middleware to authenticate JWT tokens before allowing access to protected routes
/**
 * @tyedef {Object} AuthenticatedRequest
 * @property {Object} user
 * @property {number} user.User_ID
 * @property {string} user.username
 */


const app = express(); //Invoke express
const fs = require('fs'); //File system interaction
//Declare Products



//Middleware: Allow cross-origin requests from React front-end
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

//Products that get uploaded to the database upon launching the server.
const product1 = {
    Product_ID: 12345,
    Product_Name: 'product1',
    Product_Image: fs.readFileSync('./beijing2.jpeg'),
    Product_Video: '',
    Product_Price: 10.99,


};

const product2 = {
    Product_ID: 54321,
    Product_Name: 'product2',
    Product_Image: fs.readFileSync('./beijing3.jpeg'),
    Product_Video: '',
    Product_Price: 22.99,


};


//Insert products into database query. Create a more efficient query???
db.query(`INSERT INTO "Product Data Schema"."Product Data Table" ("Product ID", "Product Name", "Product Image", "Product Video", "Product Price") VALUES ($1, $2, $3, $4, $5), ($6, $7, $8, $9, $10) ON CONFLICT ("Product ID") DO NOTHING`,

    [product1.Product_ID,
    product1.Product_Name,
    product1.Product_Image,
    product1.Product_Video,
    product1.Product_Price,
    product2.Product_ID,
    product2.Product_Name,
    product2.Product_Image,
    product2.Product_Video,
    product2.Product_Price
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

        if (result.rows.length > 0) {

            const user = result.rows[0]; //Access first row in the result
            console.log("User found: ", user); //Check the user object to see if it contains Password

            //Debug
            console.log("Entered Password: ", password);

            //Trim extra spaces from the entered password

            const enteredPassword = password.trim();
            const storedPasswordHash = user.Password.trim();

            //Check if the Password field exists and compare it
            if (user && user.Password) {

                //Use bcrypt to compare entered password (plaintext) with hashed password (from DB)
                const passwordMatch = await bcrypt.compare(enteredPassword, storedPasswordHash);
                //Debug password match
                console.log('Password match: ', passwordMatch);

                if (passwordMatch) {
                    console.log("User ID to be signed: ", user.User_ID); //CHECK TO SEE IF THIS PRINTS??
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
            secure: process.env.NODE_ENV === 'production', //Set secure flag during production. Change to set 'secure' to 'true???
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


//Profile Handling ---> TOKENIZATION
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

        if(result.rowCount === 0) {
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
    const response = await db.query(`SELECT * FROM "Product Data Schema"."Product Data Table"`);



    if (response.rows.length > 0) {

        const formattedRows = response.rows.map(product => ({
            ...product,
            Product_Name: product["Product Name"],
            Product_Image: product["Product Image"] ? `data:image/jpeg;base64,${product["Product Image"].toString('base64')}` : '',
            Product_Video: product["Product_Video"] ? `data:video/mp4;base64,${product["Product Video"].toString('base64')}` : '',
            Product_Price: product["Product Price"]

        }));
        res.json({ success: true, message: "Product Data Query Successful", products: formattedRows })
        console.log("Product Data Received: ", response)
    } else {
        console.log("Could not query product schema.");
    }
});

app.post('/cart', authenticateToken, async (req, res) => {

    const cartProducts = req.body.cartProducts; //Access request body properly

    if (!Array.isArray(cartProducts) || cartProducts.length === 0) {
        return res.status(400).json({success: false, message: "No products in cart."})
    }

    const values = [];
    const conditions = cartProducts.map((product, index) => {
        const idParam = `$${values.length + 1}`; //Print values to test validity?
        const nameParam = `$${values.length + 2}`; //Print values to test validity?
        values.push(product[0], product[1]);
        return `("Product ID" = ${idParam} AND "Product Name" = ${nameParam})`;
    }).join(' OR ');

    const query = `SELECT * FROM "Product Data Schema"."Product Data Table" WHERE ${conditions}`;

    try {
        const response = await db.query(query, values); //Are values necessary here???
        res.json({success: true, message: "Cart Query Successful", products: response.rows });

    } catch (error) {
        console.error("Error Fetching Cart Products: ", error);
        res.status(500).json({success: false, message: "Database error" });
    }

});


//Start Server
app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});
