# **Fashion Shop Platform – README**

## **1. Project Information**

  **Project Name:** Fashion Shop Platform
  **Group No:** 24
  
  **Group Members:**
  
  * Tang Chi Kit (SID: 14139924)
  * CUI Tianlang (SID: 13509340)
  * Chen Weihua  (SID: 14143648)

--------------------------------------------------------------------------------------

## **2. Project File Introduction**

    The project follows an MVC-like structure, using **Node.js + Express + EJS** to build a fashion e-commerce web platform. Below is a full overview of the files and folders included in the project.

--------------------------------------------------------------------------------------

# **3. Main Files**

  ## **3.1 `server.js`**
  
    This is the main entry point of the application. It provides:
    
    * Initialization of Express server
    * Setup of middleware (body-parser, sessions, static files, etc.)
    * View engine configuration (EJS)
    * MongoDB connection and environment variable loading
    * Route mounting for all modules
    * Global error handling
    * Session management for login & cart handling
    
    This file essentially wires together all routes, controllers, models, and front-end EJS views to run the web platform.

--------------------------------------------------------------------------------------

  ## **3.2 `package.json`**
  
    Lists all project dependencies. Key packages include:
  
    * **express** – Web server framework
    * **mongoose** – Database operations with MongoDB
    * **bcryptjs** – Password hashing
    * **express-session** – Sessions for login and cart
    * **ejs** – View rendering engine
    * **dotenv** – Environment variable loading
    * **nodemailer** – Email sending (for order confirmation)
    * **body-parser / cookie-parser / method-override** – HTTP helpers
    * Other utilities for forms, logging, and request parsing

--------------------------------------------------------------------------------------

# **4. Folder-by-Folder Introduction**

--------------------------------------------------------------------------------------

# **4.1 `routes/` Folder**

  Contains all Express route definitions. Each file maps URL paths to controller logic.
  
  ### **• `addressRoutes.js`**
  
    Handles routes for managing user shipping addresses (list, create, edit, delete).
    Used by webpage interfaces.
  
  ### **• `authRoutes.js`**
  
    Manages login, registration, logout.
    Uses webpage-based forms and controllers.
  
  ### **• `cartRoutes.js`**
  
    Routes for:
    
    * Adding products to cart
    * Updating quantities
    * Removing items
    * Displaying cart page
  
  ### **• `checkoutRoutes.js`**
  
    Checkout page, payment confirmation, and order creation.
  
  ### **• `orderLookupRoutes.js`**
  
    Provides order tracking functionality based on Order ID + email.
  
  ### **• `ordersRoutes.js`**
  
    Logged-in user order history & order detail pages.
  
  ### **• `productRoutes.js`**
  
    Displays:
    
    * Product categories
    * Product detail page
    * Related product listings
  
  ### **• `userRoutes.js`**
  
    User profile page, updating personal information, and managing user-specific data.

--------------------------------------------------------------------------------------

# **4.2 `controllers/` Folder**

  Implements the business logic for each route. Most controllers return webpage views, while a few also support REST-like responses.
  
  ### **• `addressController.js`**
  
    Handles CRUD operations for user addresses:
    
    * Rendering list page
    * Rendering address form
    * Saving & deleting addresses
  
  ### **• `authController.js`**
  
    Login and registration logic:
    
    * Password hashing
    * Authentication check
    * Session handling
  
  ### **• `cartController.js`**
  
    Logic for:
    
    * Adding/removing items
    * Calculating totals
    * Rendering cart page
  
  ### **• `checkoutController.js`**
  
    Order creation, checkout page rendering, and sending confirmation emails.
  
  ### **• `orderLookupController.js`**
  
    Allows users to enter:
    
    * Order number
    * Email
      …to retrieve the status of an order.
  
  ### **• `ordersController.js`**
  
    Logic for user's order history and displaying full order details.
  
  ### **• `productController.js`**
  
    Reads product data from database:
  
    * Fetch all
    * Filter by category
    * Fetch single product
      Used by webpage rendering.
  
  ### **• `userController.js`**
  
    Displays user profile page and updates profile information.

--------------------------------------------------------------------------------------

# **4.3 `models/` Folder**

  Contains Mongoose schema models that define the database structure.
  
  ### **• `Address.js`**
  
    Stores:
    
    * User reference
    * Name
    * Phone
    * Region
    * Full address
  
  ### **• `Order.js`**
  
    Represents an order during checkout. Includes:
  
    * Items
    * Totals
    * Shipping info
    * Payment status
    * Created timestamp
  
  ### **• `Product.js`**
  
    Stores product information:
  
    * Name
    * Category
    * Price
    * Description
    * Image
    * Stock quantity
  
  ### **• `User.js`**
  
    User account model storing:
  
    * Username
    * Email
    * Password
    * Address references

--------------------------------------------------------------------------------------

# **4.4 `public/` Folder**

  Contains all static assets for the front-end.
  
  ### **• `images/`**
  
    Used throughout front-end pages.
    Many images are for **Home Page** banners, promotions, and product display.
  
  ### **• `css/`**
  
    CSS files for:
    
    * Layout
    * Colors & typography
    * Page-specific designs

--------------------------------------------------------------------------------------

# **4.5 `views/` Folder (EJS Templates)**

  Organized into subfolders for clarity. These files render HTML pages using EJS.
  
  * `index.ejs`: Main homepage (banner, categories, featured products)
  
  ### **• `auth/`**
  
  * `login.ejs`
  * `register.ejs`
  * `register-success.ejs`
  
  ### **• `cart/`**
  
  * `index.ejs` (cart page)
  
  ### **• `checkout/`**
  
  * `index.ejs`
  * `success.ejs`
  * `cancel.ejs`
  
  ### **• `orders/`**
  
  * `track.ejs` for order tracking results
  
  ### **• `partials/`**
  
  Reusable components:
  
  * `_top.ejs`
  * `_bottom.ejs`
  * `_loginModal.ejs`
  
  ### **• `products/`**
  
  * `index.ejs`: Product list
  * `detail.ejs`: Product detail page
  
  ### **• `user/`**
  
  * `profile.ejs`
  * Address pages
  * `address-form.ejs`
  * `address-list.ejs`
  
    * User’s own order list & detail pages
    ### **• `orders/`**
    * `detail.ejs`
    * `index.ejs`

--------------------------------------------------------------------------------------

# **4.6 `services/` Folder**

Contains background helper modules.

### **• `emailService.js`**

    Handles sending confirmation emails to users after checkout, using **Nodemailer**.
    Encapsulates sending logic so controllers can call it directly.

--------------------------------------------------------------------------------------

# **4.7 `.env` File**

Stores environment variables for local testing, such as:

    * MongoDB connection string
    * Session secret
    * Email service credentials

This file is **not part of deployment** and is only used for local development.

--------------------------------------------------------------------------------------

# **5. Cloud-Based Server URL**

```
https://comp3810sef-group24.onrender.com/
```

--------------------------------------------------------------------------------------


# **6. Operation Guides**

This section describes how to operate the Fashion Shop Platform, including login/logout steps, CRUD webpage usage, and RESTful CRUD API testing instructions.

--------------------------------------------------------------------------------------

# **6.1 Use of Login / Logout Pages**

  1. **Entering the Platform**
     ```
     Navigate to the **Cloud-Based Server URL** (https://comp3810sef-group24.onrender.com/).
     The system will load the **Home Page**.
  
  2. **Opening the Login Page**
     ```
     Click the **“Login / Sign Up”** button on the navigation bar.
     You will be redirected to the **Login Page**.
  
  3. **Navigating to the Registration Page**
     ```
     On the login page, you will see the text:
     *“Don't have an account? Register here”*
     Click **“Register here”** to go to the **Registration Page**.
  
  4. **Registering a New Account**
     ```
     Enter all required registration information correctly.
     Click **Register**, and you will be taken to the **“Registration Successful!”** page.
     *(Note: Email verification is disabled for demo purposes.)*
  
  5. **Returning to Login Page**
     ```
     Click **Login** on the success page to go back to the login form.
  
  6. **Logging In**
      ```
     Enter your registered **email** and **password** correctly.
     Upon successful login, the system redirects to the **Home Page**, and the navbar will now display:
     **“Welcome, xxx”** (showing your username).
  
  7. **Logging Out**
      ```
     Hover over **“Welcome, xxx”**, choose **Logout**, and you will be logged out of the system.

--------------------------------------------------------------------------------------

# **6.2 Use of Your CRUD Web Pages**
```
After logging in, hover over **“Welcome, xxx”**, and you will see a dropdown menu.
Click **User Profile** to open the **User Center**, where multiple CRUD operations are available.
```
--------------------------------------------------------------------------------------

## **A. Update Profile**
```
* On the **User Profile** page, you can update your personal information.
* Modify any fields you want, then click **“Save Changes”**.
* The system will update your profile information in the database.
```
--------------------------------------------------------------------------------------

## **B. Manage Addresses (Full CRUD)**

1. **Open Shipping Addresses Page**
   ```
   In the User Center, click **“Manage Addresses”**.

2. **Create (Add Address)**
   ```
   * If you have no addresses, the list is empty.
   * Click **“Add Address”** to go to the address creation form.
   * Fill in correct information and click **“Create”**.
   * The system will save the address and return to the Shipping Addresses page.

3. **Read (View Address List)**
   ```
   * All your saved shipping addresses will be displayed in the list.

4. **Update (Edit Address)**
   ```
   * Click **Edit** next to an address.
   * Modify the form fields and click **Save**.
   * The information will be updated.

5. **Delete (Remove Address)**
   ```
   * Click **Delete** next to any address.
   * The address will be permanently removed.

--------------------------------------------------------------------------------------

### **Additional Address Entry During Checkout**
```
The **Checkout Page** also allows users to create a new address directly, ensuring that users can always add a valid shipping address before paying.
```
--------------------------------------------------------------------------------------

## **C. Order Lookup**
```
* Navigate to **Order Lookup** from the navbar.
* Enter:

  * **Order Number**, and
  * **Email**
* Click **Track**.
* The system redirects you to the **Order Details Page**, displaying full order information.
```
This feature supports Read functionality for public order viewing.

--------------------------------------------------------------------------------------

# **6.3 Use of Your RESTful CRUD Services**
```
The project includes four cart-related RESTful APIs, implemented in `cartController.js`.
These APIs support full Create, Read, Update, Delete operations for shopping cart items.
```
--------------------------------------------------------------------------------------

## **A. List of RESTful APIs**

| API Name              | Function (CRUD) | Description                            |
| --------------------- | --------------- | -------------------------------------- |
| **apiGetCart**        | **R – Read**    | Retrieve the current user's cart items |
| **apiAddCartItem**    | **C – Create**  | Add a new product to the cart          |
| **apiUpdateCartItem** | **U – PUT**     | Modify cart item quantity              |
| **apiRemoveCartItem** | **D – Delete**  | Remove a product from the cart         |

--------------------------------------------------------------------------------------

## **B. HTTP Request Types**

Here is a standard mapping based on your controllers (I filled this part for you):

| API Name              | HTTP Method |
| --------------------- | ----------- |
| **apiGetCart**        | GET         |
| **apiAddCartItem**    | POST        |
| **apiUpdateCartItem** | PUT         |
| **apiRemoveCartItem** | DELETE      |

--------------------------------------------------------------------------------------

## **C. Path URI**

This depends on your deployed website domain.
Here is the general structure with placeholders:

```
GET     https://comp3810sef-group24.onrender.com/cart/items
POST    https://comp3810sef-group24.onrender.com/cart/items
PUT     https://comp3810sef-group24.onrender.com/cart/items/(product-id)
DELETE  https://comp3810sef-group24.onrender.com/cart/items/(product-id)
```

--------------------------------------------------------------------------------------

## **D. How to Test Them**

For testing REST APIs, I used **Windows CMD** with **curl** commands.

The method:
```
1. Prepare all curl commands.
2. Run them one by one in the same command prompt window.
3. You will clearly see:

   * Retrieve cart items
   * Add an item
   * Update the item
   * Delete the item
   * Retrieve again to confirm
```
This demonstrates the complete CRUD cycle.

--------------------------------------------------------------------------------------

## **E. CURL Testing Commands**

*(Reserved for you to fill in your own curl commands.)*

```
curl -s -X GET "https://comp3810sef-group24.onrender.com/cart/items" --cookie cookie.txt | powershell -Command "ConvertFrom-Json | ConvertTo-Json -Depth 10" & ^
curl -s -X POST "https://comp3810sef-group24.onrender.com/cart/items" -H "Content-Type: application/json" -d "{\"productId\":\"691b0fc142d100f864773d6d\",\"quantity\":1}" --cookie cookie.txt --cookie-jar cookie.txt | powershell -Command "ConvertFrom-Json | ConvertTo-Json -Depth 10" & ^
curl -s -X PUT "https://comp3810sef-group24.onrender.com/cart/items/691b0fc142d100f864773d6d" -H "Content-Type: application/json" -d "{\"quantity\":2}" --cookie cookie.txt --cookie-jar cookie.txt | powershell -Command "ConvertFrom-Json | ConvertTo-Json -Depth 10" & ^
curl -s -X GET "https://comp3810sef-group24.onrender.com/cart/items" --cookie cookie.txt | powershell -Command "ConvertFrom-Json | ConvertTo-Json -Depth 10" & ^
curl -s -X DELETE "https://comp3810sef-group24.onrender.com/cart/items/691b0fc142d100f864773d6d" --cookie cookie.txt --cookie-jar cookie.txt | powershell -Command "ConvertFrom-Json | ConvertTo-Json -Depth 10" & ^
del cookie.txt
```

--------------------------------------------------------------------------------------
