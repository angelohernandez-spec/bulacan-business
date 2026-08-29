/* =====================================================
   BULACAN BUSINESS
   COMPLETE SCRIPT
   ===================================================== */


/* =====================================================
   DATA
   ===================================================== */

const regions = [
    {
        name: "Malolos",
        icon: "🏛️",
        description: "City of Malolos"
    },
    {
        name: "Meycauayan",
        icon: "🏙️",
        description: "City of Meycauayan"
    },
    {
        name: "San Jose del Monte",
        icon: "🌆",
        description: "City of San Jose del Monte"
    },
    {
        name: "Baliwag",
        icon: "🏘️",
        description: "City of Baliwag"
    },
    {
        name: "Plaridel",
        icon: "🌾",
        description: "Municipality of Plaridel"
    },
    {
        name: "Bulakan",
        icon: "🌿",
        description: "Municipality of Bulakan"
    },
    {
        name: "Bocaue",
        icon: "🏡",
        description: "Municipality of Bocaue"
    },
    {
        name: "Marilao",
        icon: "🏘️",
        description: "Municipality of Marilao"
    }
];


/*
    SAMPLE PRODUCTS

    IMPORTANT:
    region MUST match one of the regions above.
*/

let products = [
    {
        id: 1,
        name: "Pastillas de Leche",
        region: "Malolos",
        price: 150,
        image:
            "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=900&q=80",
        description:
            "Traditional sweet milk candies perfect as pasalubong."
    },

    {
        id: 2,
        name: "Bulacan Ensaymada",
        region: "Malolos",
        price: 180,
        image:
            "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=900&q=80",
        description:
            "Soft and delicious local-style ensaymada."
    },

    {
        id: 3,
        name: "Local Leather Product",
        region: "Meycauayan",
        price: 650,
        image:
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
        description:
            "Locally crafted leather product from Meycauayan."
    },

    {
        id: 4,
        name: "Handmade Bag",
        region: "San Jose del Monte",
        price: 450,
        image:
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80",
        description:
            "Beautiful handmade bag made by local artisans."
    },

    {
        id: 5,
        name: "Traditional Rice Cakes",
        region: "Baliwag",
        price: 120,
        image:
            "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80",
        description:
            "Freshly prepared traditional Filipino rice cakes."
    },

    {
        id: 6,
        name: "Local Rice",
        region: "Plaridel",
        price: 900,
        image:
            "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=900&q=80",
        description:
            "Quality locally sourced rice from Bulacan farmers."
    },

    {
        id: 7,
        name: "Native Food Basket",
        region: "Bulakan",
        price: 350,
        image:
            "https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?auto=format&fit=crop&w=900&q=80",
        description:
            "Handmade native basket for food and household use."
    },

    {
        id: 8,
        name: "Local Snack Box",
        region: "Bocaue",
        price: 280,
        image:
            "https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=900&q=80",
        description:
            "A selection of delicious local snacks."
    },

    {
        id: 9,
        name: "Marilao Homemade Treats",
        region: "Marilao",
        price: 200,
        image:
            "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=80",
        description:
            "Homemade treats prepared by local sellers."
    }
];


/* =====================================================
   STATE
   ===================================================== */

let currentUser = null;

let selectedRegion = null;

let cart = [];

let toastTimer = null;


/* =====================================================
   LOCAL STORAGE KEYS
   ===================================================== */

const USERS_KEY = "bulacan_business_users";

const CURRENT_USER_KEY =
    "bulacan_business_current_user";

const CART_KEY =
    "bulacan_business_cart";

const PRODUCTS_KEY =
    "bulacan_business_products";


/* =====================================================
   INITIALIZATION
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    initializeApp
);


function initializeApp() {

    loadUsers();

    loadProducts();

    loadCurrentUser();

    loadCart();

    renderRegions();

    renderAdminRegionOptions();

    updateNavbar();

    updateCartCount();

    /*
        IMPORTANT:

        On initial page load:
        - If NOT logged in:
            Regions hidden
            Products hidden

        - If logged in:
            Regions visible
            Products hidden until region selected
    */

    if (currentUser) {

        selectedRegion = null;

        showLoggedInShopping();

    } else {

        hideShoppingSections();
    }


    setupForms();
}


/* =====================================================
   STORAGE HELPERS
   ===================================================== */

function getUsers() {

    try {

        return JSON.parse(
            localStorage.getItem(USERS_KEY)
        ) || [];

    } catch (error) {

        return [];
    }
}


function saveUsers(users) {

    localStorage.setItem(
        USERS_KEY,
        JSON.stringify(users)
    );
}


function loadUsers() {

    /*
        Just initialize storage if empty.
    */

    if (!localStorage.getItem(USERS_KEY)) {

        /*
            Demo admin account

            Email:
            admin@bulacan.com

            Password:
            admin123
        */

        const defaultUsers = [
            {
                id: 1,
                name: "Administrator",
                email: "admin@bulacan.com",
                password: "admin123",
                role: "admin"
            }
        ];

        saveUsers(defaultUsers);
    }
}


function loadCurrentUser() {

    try {

        currentUser = JSON.parse(
            localStorage.getItem(CURRENT_USER_KEY)
        );

    } catch (error) {

        currentUser = null;
    }
}


function saveCurrentUser() {

    if (currentUser) {

        localStorage.setItem(
            CURRENT_USER_KEY,
            JSON.stringify(currentUser)
        );

    } else {

        localStorage.removeItem(
            CURRENT_USER_KEY
        );
    }
}


function loadCart() {

    try {

        cart = JSON.parse(
            localStorage.getItem(CART_KEY)
        ) || [];

    } catch (error) {

        cart = [];
    }
}


function saveCart() {

    localStorage.setItem(
        CART_KEY,
        JSON.stringify(cart)
    );
}


/* =====================================================
   PRODUCTS STORAGE
   ===================================================== */

function loadProducts() {

    const savedProducts =
        localStorage.getItem(PRODUCTS_KEY);

    if (savedProducts) {

        try {

            products =
                JSON.parse(savedProducts);

        } catch (error) {

            console.log(
                "Using default products."
            );
        }
    }
}


function saveProducts() {

    localStorage.setItem(
        PRODUCTS_KEY,
        JSON.stringify(products)
    );
}


/* =====================================================
   NAVBAR
   ===================================================== */

function updateNavbar() {

    const guestArea =
        document.getElementById("guestArea");

    const loggedUserArea =
        document.getElementById("loggedUserArea");

    const welcomeUser =
        document.getElementById("welcomeUser");


    if (currentUser) {

        guestArea.classList.add("hidden");

        loggedUserArea.classList.remove("hidden");

        welcomeUser.textContent =
            `Hello, ${currentUser.name}`;

    } else {

        guestArea.classList.remove("hidden");

        loggedUserArea.classList.add("hidden");
    }
}


/* =====================================================
   PAGE NAVIGATION
   ===================================================== */

function showPage(page) {

    /*
        SECURITY:
        Cart requires login.
    */

    if (
        page === "cart" &&
        !currentUser
    ) {

        showToast(
            "Please login first to access your cart."
        );

        page = "login";
    }


    /*
        SECURITY:
        Checkout requires login.
    */

    if (
        page === "checkout" &&
        !currentUser
    ) {

        showToast(
            "Please login first."
        );

        page = "login";
    }


    /*
        SECURITY:
        Admin requires admin account.
    */

    if (
        page === "admin" &&
        (
            !currentUser ||
            currentUser.role !== "admin"
        )
    ) {

        showToast(
            "Admin access required."
        );

        page = "login";
    }


    const pages = [
        "homePage",
        "loginPage",
        "registerPage",
        "cartPage",
        "checkoutPage",
        "successPage",
        "adminPage"
    ];


    pages.forEach(pageId => {

        document
            .getElementById(pageId)
            .classList.add("hidden");

    });


    const targetPage =
        document.getElementById(
            page + "Page"
        );


    if (targetPage) {

        targetPage.classList.remove("hidden");
    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    /*
        Home page behavior
    */

    if (page === "home") {

        if (currentUser) {

            showLoggedInShopping();

        } else {

            hideShoppingSections();
        }
    }


    /*
        Cart page
    */

    if (page === "cart") {

        renderCart();
    }


    /*
        Checkout
    */

    if (page === "checkout") {

        prepareCheckout();
    }


    /*
        Admin
    */

    if (page === "admin") {

        renderAdminProducts();
    }
}


/* =====================================================
   LOGIN / REGISTER FORMS
   ===================================================== */

function setupForms() {

    const loginForm =
        document.getElementById("loginForm");

    const registerForm =
        document.getElementById("registerForm");

    const checkoutForm =
        document.getElementById("checkoutForm");

    const productForm =
        document.getElementById("productForm");


    loginForm.addEventListener(
        "submit",
        handleLogin
    );


    registerForm.addEventListener(
        "submit",
        handleRegister
    );


    checkoutForm.addEventListener(
        "submit",
        handleCheckout
    );


    productForm.addEventListener(
        "submit",
        handleProductForm
    );
}


/* =====================================================
   LOGIN
   ===================================================== */

function handleLogin(event) {

    event.preventDefault();


    const email =
        document
            .getElementById("loginEmail")
            .value
            .trim()
            .toLowerCase();


    const password =
        document
            .getElementById("loginPassword")
            .value;


    const users = getUsers();


    const user =
        users.find(
            item =>
                item.email.toLowerCase() === email &&
                item.password === password
        );


    const message =
        document.getElementById(
            "loginMessage"
        );


    if (!user) {

        message.textContent =
            "Invalid email or password.";

        message.style.color =
            "#d62828";

        return;
    }


    /*
        LOGIN SUCCESS
    */

    currentUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || "user"
    };


    saveCurrentUser();


    selectedRegion = null;


    updateNavbar();

    updateCartCount();


    message.textContent =
        "Login successful!";

    message.style.color =
        "#0b7a3b";


    /*
        VERY IMPORTANT:

        After login:
        Regions = SHOW
        Products = HIDE

        User MUST click a region.
    */

    showLoggedInShopping();


    setTimeout(() => {

        showPage("home");

    }, 500);


    showToast(
        `Welcome, ${currentUser.name}!`
    );
}


/* =====================================================
   REGISTER
   ===================================================== */

function handleRegister(event) {

    event.preventDefault();


    const name =
        document
            .getElementById("registerName")
            .value
            .trim();


    const email =
        document
            .getElementById("registerEmail")
            .value
            .trim()
            .toLowerCase();


    const password =
        document
            .getElementById("registerPassword")
            .value;


    const confirmPassword =
        document
            .getElementById(
                "registerConfirmPassword"
            )
            .value;


    const message =
        document.getElementById(
            "registerMessage"
        );


    if (password !== confirmPassword) {

        message.textContent =
            "Passwords do not match.";

        message.style.color =
            "#d62828";

        return;
    }


    if (password.length < 6) {

        message.textContent =
            "Password must be at least 6 characters.";

        message.style.color =
            "#d62828";

        return;
    }


    const users = getUsers();


    const existingUser =
        users.find(
            user =>
                user.email.toLowerCase() === email
        );


    if (existingUser) {

        message.textContent =
            "Email is already registered.";

        message.style.color =
            "#d62828";

        return;
    }


    const newUser = {

        id: Date.now(),

        name,

        email,

        password,

        role: "user"
    };


    users.push(newUser);

    saveUsers(users);


    message.textContent =
        "Account created successfully! Redirecting to login...";

    message.style.color =
        "#0b7a3b";


    document
        .getElementById("registerForm")
        .reset();


    setTimeout(() => {

        showPage("login");

    }, 1000);
}


/* =====================================================
   LOGOUT
   ===================================================== */

function logout() {

    currentUser = null;

    selectedRegion = null;

    cart = [];


    localStorage.removeItem(
        CURRENT_USER_KEY
    );

    localStorage.removeItem(
        CART_KEY
    );


    updateNavbar();

    updateCartCount();


    /*
        IMPORTANT:

        Once logged out:
        Regions hidden
        Products hidden
    */

    hideShoppingSections();


    showPage("home");


    showToast(
        "You have been logged out."
    );
}


/* =====================================================
   SHOPPING VISIBILITY
   ===================================================== */

function showLoggedInShopping() {

    /*
        ONLY LOGGED USERS CAN SEE REGIONS.
    */

    if (!currentUser) {

        hideShoppingSections();

        return;
    }


    const regionSection =
        document.getElementById(
            "regionSection"
        );

    const productsSection =
        document.getElementById(
            "productsSection"
        );


    regionSection.classList.remove(
        "hidden"
    );


    /*
        Products remain HIDDEN
        until region is clicked.
    */

    productsSection.classList.add(
        "hidden"
    );


    selectedRegion = null;


    renderRegions();
}


function hideShoppingSections() {

    const regionSection =
        document.getElementById(
            "regionSection"
        );

    const productsSection =
        document.getElementById(
            "productsSection"
        );


    regionSection.classList.add(
        "hidden"
    );


    productsSection.classList.add(
        "hidden"
    );


    selectedRegion = null;
}


/* =====================================================
   REGIONS
   ===================================================== */

function renderRegions() {

    const regionGrid =
        document.getElementById(
            "regionGrid"
        );


    regionGrid.innerHTML = "";


    regions.forEach(region => {

        const button =
            document.createElement("button");


        button.className =
            "region-card";


        if (
            selectedRegion ===
            region.name
        ) {

            button.classList.add(
                "active"
            );
        }


        button.innerHTML = `

            <span class="region-icon">
                ${region.icon}
            </span>

            <span>
                ${region.name}
            </span>

            <small>
                ${region.description}
            </small>

        `;


        button.addEventListener(
            "click",
            () => {

                selectRegion(
                    region.name
                );

            }
        );


        regionGrid.appendChild(
            button
        );

    });
}


/* =====================================================
   SELECT REGION
   ===================================================== */

function selectRegion(regionName) {

    /*
        SECURITY CHECK
    */

    if (!currentUser) {

        showToast(
            "Please login first."
        );

        showPage("login");

        return;
    }


    selectedRegion =
        regionName;


    renderRegions();


    /*
        NOW AND ONLY NOW:
        SHOW PRODUCTS
    */

    const productsSection =
        document.getElementById(
            "productsSection"
        );


    productsSection.classList.remove(
        "hidden"
    );


    renderProductsByRegion(
        regionName
    );


    /*
        Scroll down to products
    */

    setTimeout(() => {

        productsSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }, 100);
}


/* =====================================================
   PRODUCTS BY REGION
   ===================================================== */

function renderProductsByRegion(
    regionName
) {

    const productsGrid =
        document.getElementById(
            "productsGrid"
        );


    const productsTitle =
        document.getElementById(
            "productsTitle"
        );


    const productsSubtitle =
        document.getElementById(
            "productsSubtitle"
        );


    productsTitle.textContent =
        `${regionName} Products`;


    productsSubtitle.textContent =
        `Products available from ${regionName}.`;


    const filteredProducts =
        products.filter(
            product =>
                product.region ===
                regionName
        );


    productsGrid.innerHTML = "";


    if (
        filteredProducts.length === 0
    ) {

        productsGrid.innerHTML = `

            <div class="no-products">

                <h3>
                    No products available
                </h3>

                <p>
                    There are no products available
                    in ${regionName} yet.
                </p>

            </div>

        `;

        return;
    }


    filteredProducts.forEach(
        product => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "product-card";


            card.innerHTML = `

                <div
                    class="product-image-wrapper"
                >

                    <img
                        src="${product.image}"
                        alt="${escapeHTML(product.name)}"
                        onerror="this.src='https://via.placeholder.com/600x400?text=Product'"
                    >

                    <span
                        class="product-region-badge"
                    >
                        ${escapeHTML(product.region)}
                    </span>

                </div>


                <div class="product-info">

                    <h3>
                        ${escapeHTML(product.name)}
                    </h3>


                    <div class="product-price">
                        ${formatPrice(product.price)}
                    </div>


                    <p class="product-description">
                        ${escapeHTML(product.description)}
                    </p>


                    <div class="product-actions">

                        <button
                            class="btn"
                            onclick="viewProduct(${product.id})"
                        >
                            View
                        </button>

                        <button
                            class="btn"
                            onclick="addToCart(${product.id})"
                        >
                            🛒 Add
                        </button>

                    </div>

                </div>

            `;


            productsGrid.appendChild(
                card
            );

        }
    );
}


/* =====================================================
   VIEW PRODUCT
   ===================================================== */

function viewProduct(productId) {

    /*
        Products are already hidden
        for guests, but keep security.
    */

    if (!currentUser) {

        showToast(
            "Please login first to view products."
        );

        showPage("login");

        return;
    }


    const product =
        products.find(
            item =>
                item.id === productId
        );


    if (!product) {

        showToast(
            "Product not found."
        );

        return;
    }


    document
        .getElementById(
            "modalProductImage"
        )
        .src = product.image;


    document
        .getElementById(
            "modalProductName"
        )
        .textContent =
        product.name;


    document
        .getElementById(
            "modalProductRegion"
        )
        .textContent =
        `📍 ${product.region}`;


    document
        .getElementById(
            "modalProductPrice"
        )
        .textContent =
        formatPrice(product.price);


    document
        .getElementById(
            "modalProductDescription"
        )
        .textContent =
        product.description;


    document
        .getElementById(
            "modalAddButton"
        )
        .onclick = () => {

            addToCart(product.id);

            closeProductModal();

        };


    document
        .getElementById(
            "productModal"
        )
        .classList.remove(
            "hidden"
        );
}


/* =====================================================
   CLOSE PRODUCT MODAL
   ===================================================== */

function closeProductModal() {

    document
        .getElementById(
            "productModal"
        )
        .classList.add(
            "hidden"
        );
}


/* =====================================================
   ADD TO CART
   ===================================================== */

function addToCart(productId) {

    /*
        VERY IMPORTANT SECURITY CHECK

        No login = NO PURCHASE
    */

    if (!currentUser) {

        showToast(
            "Please login first to purchase products."
        );

        showPage("login");

        return;
    }


    const product =
        products.find(
            item =>
                item.id === productId
        );


    if (!product) {

        showToast(
            "Product not found."
        );

        return;
    }


    const existingItem =
        cart.find(
            item =>
                item.id === productId
        );


    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            region: product.region,

            price: product.price,

            image: product.image,

            description:
                product.description,

            quantity: 1

        });
    }


    saveCart();

    updateCartCount();


    showToast(
        `${product.name} added to cart.`
    );
}


/* =====================================================
   CART COUNT
   ===================================================== */

function updateCartCount() {

    const count =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );


    document
        .getElementById(
            "cartCount"
        )
        .textContent =
        count;
}


/* =====================================================
   RENDER CART
   ===================================================== */

function renderCart() {

    if (!currentUser) {

        showPage("login");

        return;
    }


    const cartEmpty =
        document.getElementById(
            "cartEmpty"
        );

    const cartItems =
        document.getElementById(
            "cartItems"
        );

    const cartSummary =
        document.getElementById(
            "cartSummary"
        );


    if (cart.length === 0) {

        cartEmpty.classList.remove(
            "hidden"
        );

        cartItems.classList.add(
            "hidden"
        );

        cartSummary.classList.add(
            "hidden"
        );

        return;
    }


    cartEmpty.classList.add(
        "hidden"
    );

    cartItems.classList.remove(
        "hidden"
    );

    cartSummary.classList.remove(
        "hidden"
    );


    cartItems.innerHTML = "";


    cart.forEach(item => {

        const row =
            document.createElement(
                "div"
            );


        row.className =
            "cart-item";


        row.innerHTML = `

            <img
                class="cart-item-image"
                src="${item.image}"
                alt="${escapeHTML(item.name)}"
                onerror="this.src='https://via.placeholder.com/100x80?text=Product'"
            >


            <div class="cart-item-info">

                <h3>
                    ${escapeHTML(item.name)}
                </h3>

                <p>
                    ${formatPrice(item.price)}
                </p>

                <small>
                    ${escapeHTML(item.region)}
                </small>

            </div>


            <div class="quantity-controls">

                <button
                    class="quantity-btn"
                    onclick="changeQuantity(${item.id}, -1)"
                >
                    −
                </button>

                <span class="quantity-number">
                    ${item.quantity}
                </span>

                <button
                    class="quantity-btn"
                    onclick="changeQuantity(${item.id}, 1)"
                >
                    +
                </button>

            </div>


            <div class="cart-item-total">

                ${formatPrice(
                    item.price *
                    item.quantity
                )}

            </div>


            <button
                class="remove-cart-btn"
                onclick="removeFromCart(${item.id})"
            >
                Remove
            </button>

        `;


        cartItems.appendChild(row);

    });


    updateCartSummary();
}


/* =====================================================
   CHANGE QUANTITY
   ===================================================== */

function changeQuantity(
    productId,
    amount
) {

    const item =
        cart.find(
            product =>
                product.id === productId
        );


    if (!item) {

        return;
    }


    item.quantity += amount;


    if (item.quantity <= 0) {

        cart =
            cart.filter(
                product =>
                    product.id !==
                    productId
            );
    }


    saveCart();

    updateCartCount();

    renderCart();
}


/* =====================================================
   REMOVE CART ITEM
   ===================================================== */

function removeFromCart(productId) {

    cart =
        cart.filter(
            item =>
                item.id !== productId
        );


    saveCart();

    updateCartCount();

    renderCart();


    showToast(
        "Product removed from cart."
    );
}


/* =====================================================
   CART SUMMARY
   ===================================================== */

function updateCartSummary() {

    const subtotal =
        cart.reduce(
            (total, item) =>
                total +
                (
                    item.price *
                    item.quantity
                ),
            0
        );


    const delivery =
        cart.length > 0
            ? 50
            : 0;


    const total =
        subtotal + delivery;


    document
        .getElementById(
            "cartSubtotal"
        )
        .textContent =
        formatPrice(subtotal);


    document
        .getElementById(
            "cartTotal"
        )
        .textContent =
        formatPrice(total);
}


/* =====================================================
   CHECKOUT
   ===================================================== */

function openCheckout() {

    /*
        LOGIN REQUIRED
    */

    if (!currentUser) {

        showToast(
            "Please login first."
        );

        showPage("login");

        return;
    }


    if (cart.length === 0) {

        showToast(
            "Your cart is empty."
        );

        return;
    }


    showPage("checkout");
}


function prepareCheckout() {

    if (!currentUser) {

        showPage("login");

        return;
    }


    if (cart.length === 0) {

        showToast(
            "Your cart is empty."
        );

        showPage("cart");

        return;
    }


    document
        .getElementById(
            "checkoutName"
        )
        .value =
        currentUser.name || "";


    updateCheckoutTotal();
}


function updateCheckoutTotal() {

    const subtotal =
        cart.reduce(
            (total, item) =>
                total +
                (
                    item.price *
                    item.quantity
                ),
            0
        );


    const delivery = 50;


    const total =
        subtotal + delivery;


    document
        .getElementById(
            "checkoutTotalPreview"
        )
        .textContent =
        `Total: ${formatPrice(total)}`;
}


/* =====================================================
   PAYMENT INFO
   ===================================================== */

function showPaymentInfo() {

    const payment =
        document
            .getElementById(
                "checkoutPayment"
            )
            .value;


    const gcashInfo =
        document.getElementById(
            "gcashInfo"
        );


    if (payment === "GCash") {

        gcashInfo.classList.remove(
            "hidden"
        );

    } else {

        gcashInfo.classList.add(
            "hidden"
        );
    }
}


/* =====================================================
   HANDLE CHECKOUT
   ===================================================== */

function handleCheckout(event) {

    event.preventDefault();


    /*
        SECURITY
    */

    if (!currentUser) {

        showToast(
            "Please login first."
        );

        showPage("login");

        return;
    }


    if (cart.length === 0) {

        showToast(
            "Your cart is empty."
        );

        showPage("cart");

        return;
    }


    const payment =
        document
            .getElementById(
                "checkoutPayment"
            )
            .value;


    if (!payment) {

        showToast(
            "Please select a payment method."
        );

        return;
    }


    /*
        Create order object.
    */

    const order = {

        id: Date.now(),

        userId:
            currentUser.id,

        customer:
            currentUser.name,

        items:
            [...cart],

        payment,

        date:
            new Date().toISOString(),

        total:
            cart.reduce(
                (sum, item) =>
                    sum +
                    (
                        item.price *
                        item.quantity
                    ),
                0
            ) + 50
    };


    /*
        Save orders.
    */

    let orders = [];


    try {

        orders =
            JSON.parse(
                localStorage.getItem(
                    "bulacan_business_orders"
                )
            ) || [];

    } catch (error) {

        orders = [];
    }


    orders.push(order);


    localStorage.setItem(
        "bulacan_business_orders",
        JSON.stringify(orders)
    );


    /*
        Clear cart after successful order.
    */

    cart = [];

    saveCart();

    updateCartCount();


    document
        .getElementById(
            "checkoutForm"
        )
        .reset();


    document
        .getElementById(
            "gcashInfo"
        )
        .classList.add(
            "hidden"
        );


    showPage("success");


    showToast(
        "Order successfully placed!"
    );
}


/* =====================================================
   BACK TO SHOPPING
   ===================================================== */

function backToShopping() {

    if (!currentUser) {

        showPage("login");

        return;
    }


    selectedRegion = null;


    showPage("home");


    showLoggedInShopping();
}


/* =====================================================
   PASSWORD TOGGLE
   ===================================================== */

function togglePassword(
    inputId,
    button
) {

    const input =
        document.getElementById(
            inputId
        );


    if (
        input.type ===
        "password"
    ) {

        input.type = "text";

        button.textContent = "🙈";

    } else {

        input.type = "password";

        button.textContent = "👁️";
    }
}


/* =====================================================
   FORGOT PASSWORD
   ===================================================== */

function forgotPassword() {

    showToast(
        "Password reset would be handled by your backend/email system."
    );
}


/* =====================================================
   ADMIN REGION OPTIONS
   ===================================================== */

function renderAdminRegionOptions() {

    const select =
        document.getElementById(
            "productRegion"
        );


    if (!select) {

        return;
    }


    select.innerHTML = `

        <option value="">
            Select region
        </option>

    `;


    regions.forEach(region => {

        const option =
            document.createElement(
                "option"
            );


        option.value =
            region.name;


        option.textContent =
            region.name;


        select.appendChild(
            option
        );

    });
}


/* =====================================================
   ADMIN PRODUCT FORM
   ===================================================== */

function handleProductForm(event) {

    event.preventDefault();


    if (
        !currentUser ||
        currentUser.role !== "admin"
    ) {

        showToast(
            "Admin access required."
        );

        return;
    }


    const idValue =
        document
            .getElementById(
                "productId"
            )
            .value;


    const name =
        document
            .getElementById(
                "productName"
            )
            .value
            .trim();


    const region =
        document
            .getElementById(
                "productRegion"
            )
            .value;


    const price =
        Number(
            document
                .getElementById(
                    "productPrice"
                )
                .value
        );


    const image =
        document
            .getElementById(
                "productImage"
            )
            .value
            .trim();


    const description =
        document
            .getElementById(
                "productDescription"
            )
            .value
            .trim();


    if (
        !name ||
        !region ||
        !price ||
        !image ||
        !description
    ) {

        showToast(
            "Please complete all product fields."
        );

        return;
    }


    /*
        EDIT PRODUCT
    */

    if (idValue) {

        const id =
            Number(idValue);


        const product =
            products.find(
                item =>
                    item.id === id
            );


        if (product) {

            product.name =
                name;

            product.region =
                region;

            product.price =
                price;

            product.image =
                image;

            product.description =
                description;
        }


        showToast(
            "Product updated successfully."
        );

    } else {

        /*
            ADD PRODUCT
        */

        const newProduct = {

            id: Date.now(),

            name,

            region,

            price,

            image,

            description
        };


        products.push(
            newProduct
        );


        showToast(
            "Product added successfully."
        );
    }


    saveProducts();

    cancelProductEdit();

    renderAdminProducts();


    /*
        If user currently selected
        this region, refresh products.
    */

    if (
        currentUser &&
        selectedRegion
    ) {

        renderProductsByRegion(
            selectedRegion
        );
    }
}


/* =====================================================
   ADMIN PRODUCT LIST
   ===================================================== */

function renderAdminProducts() {

    const container =
        document.getElementById(
            "adminProductsList"
        );


    if (!container) {

        return;
    }


    container.innerHTML = "";


    if (products.length === 0) {

        container.innerHTML = `

            <div class="no-products">
                No products found.
            </div>

        `;

        return;
    }


    products.forEach(product => {

        const item =
            document.createElement(
                "div"
            );


        item.className =
            "admin-product-item";


        item.innerHTML = `

            <div class="admin-product-left">

                <img
                    class="admin-product-image"
                    src="${product.image}"
                    alt="${escapeHTML(product.name)}"
                    onerror="this.src='https://via.placeholder.com/100x80?text=Product'"
                >


                <div class="admin-product-info">

                    <h4>
                        ${escapeHTML(product.name)}
                    </h4>

                    <p>
                        ${formatPrice(product.price)}
                    </p>

                    <span class="admin-product-region">
                        📍 ${escapeHTML(product.region)}
                    </span>

                </div>

            </div>


            <div class="admin-product-actions">

                <button
                    class="btn edit-btn"
                    onclick="editProduct(${product.id})"
                >
                    Edit
                </button>

                <button
                    class="btn delete-btn"
                    onclick="deleteProduct(${product.id})"
                >
                    Delete
                </button>

            </div>

        `;


        container.appendChild(item);

    });
}


/* =====================================================
   EDIT PRODUCT
   ===================================================== */

function editProduct(productId) {

    if (
        !currentUser ||
        currentUser.role !== "admin"
    ) {

        showToast(
            "Admin access required."
        );

        return;
    }


    const product =
        products.find(
            item =>
                item.id === productId
        );


    if (!product) {

        return;
    }


    document
        .getElementById(
            "productId"
        )
        .value =
        product.id;


    document
        .getElementById(
            "productName"
        )
        .value =
        product.name;


    document
        .getElementById(
            "productRegion"
        )
        .value =
        product.region;


    document
        .getElementById(
            "productPrice"
        )
        .value =
        product.price;


    document
        .getElementById(
            "productImage"
        )
        .value =
        product.image;


    document
        .getElementById(
            "productDescription"
        )
        .value =
        product.description;


    document
        .getElementById(
            "adminFormTitle"
        )
        .textContent =
        "Edit Product";


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =====================================================
   DELETE PRODUCT
   ===================================================== */

function deleteProduct(productId) {

    if (
        !currentUser ||
        currentUser.role !== "admin"
    ) {

        showToast(
            "Admin access required."
        );

        return;
    }


    const product =
        products.find(
            item =>
                item.id === productId
        );


    if (!product) {

        return;
    }


    const confirmed =
        confirm(
            `Delete "${product.name}"?`
        );


    if (!confirmed) {

        return;
    }


    products =
        products.filter(
            item =>
                item.id !== productId
        );


    /*
        Also remove deleted product
        from cart.
    */

    cart =
        cart.filter(
            item =>
                item.id !== productId
        );


    saveProducts();

    saveCart();

    updateCartCount();

    renderAdminProducts();


    if (selectedRegion) {

        renderProductsByRegion(
            selectedRegion
        );
    }


    showToast(
        "Product deleted."
    );
}


/* =====================================================
   CANCEL PRODUCT EDIT
   ===================================================== */

function cancelProductEdit() {

    const form =
        document.getElementById(
            "productForm"
        );


    if (form) {

        form.reset();
    }


    document
        .getElementById(
            "productId"
        )
        .value = "";


    document
        .getElementById(
            "adminFormTitle"
        )
        .textContent =
        "Add Product";
}


/* =====================================================
   TOAST
   ===================================================== */

function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );


    toast.textContent =
        message;


    toast.classList.remove(
        "hidden"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(() => {

            toast.classList.add(
                "hidden"
            );

        }, 3000);
}


/* =====================================================
   PRICE FORMAT
   ===================================================== */

function formatPrice(price) {

    return (
        "₱" +
        Number(price).toLocaleString(
            "en-PH",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        )
    );
}


/* =====================================================
   HTML ESCAPE
   ===================================================== */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =====================================================
   ADMIN QUICK ACCESS
   ===================================================== */

/*
    You can open the admin page from browser console:

    showPage("admin");

    Demo admin:
    Email: admin@bulacan.com
    Password: admin123
*/


/* =====================================================
   END
   ===================================================== */
