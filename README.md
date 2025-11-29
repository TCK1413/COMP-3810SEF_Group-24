# **Fashion Shop Platform – README**

## **1. Project Information**

  **Project Name:** Fashion Shop Platform
  **Group No.:** 24
  
  **Group Members:**
  
  * Student Name (SID: XXXXXXXX)
  * Student Name (SID: XXXXXXXX)
  * Student Name (SID: XXXXXXXX)

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



