/* =========================================================
   BULACAN BUSINESS
   COMPLETE SCRIPT.JS
   ========================================================= */

/* =========================================================
   SUPABASE
   ========================================================= */

const SUPABASE_URL = "";
const SUPABASE_ANON_KEY = "";

let supabaseClient = null;

if (
    typeof window.supabase !== "undefined" &&
    SUPABASE_URL &&
    SUPABASE_ANON_KEY
) {
    supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );
}


/* =========================================================
   DATA
   ========================================================= */

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


/* =========================================================
   STATE
   ========================================================= */

let currentUser = null;
let selectedRegion = null;
let cart = [];
let toastTimer = null;
/* =========================================================
   SHIPPING FEE BY DISTANCE / REGION
   ========================================================= */

const SHIPPING_FEES = {
    "Malolos": 50,
    "Bulakan": 60,
    "Bocaue": 70,
    "Plaridel": 80,
    "Marilao": 90,
    "Meycauayan": 100,
    "Baliwag": 110,
    "San Jose del Monte": 120
};


function getShippingFee() {

    if (!selectedRegion) {
        return 50;
    }

    return SHIPPING_FEES[selectedRegion] || 100;
}

/* =========================================================
   LOCAL STORAGE
   ========================================================= */

const USERS_KEY = "bulacan_business_users";
const CURRENT_USER_KEY = "bulacan_business_current_user";
const CART_KEY = "bulacan_business_cart";
const PRODUCTS_KEY = "bulacan_business_products";


/* =========================================================
   INITIALIZE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeApp
);


function initializeApp() {

    loadUsers();
    loadProducts();
    loadCurrentUser();
    loadCart();

    updateNavbar();
    updateCartCount();

   if (currentUser) {

    selectedRegion = null;

    /* PALIT BACKGROUND KAPAG MAY SAVED LOGIN */
    document
        .getElementById("homeSection")
        ?.classList.add("logged-in");

    showLoggedInShopping();

        // ADMIN CHECK
        if (
            currentUser.role === "admin" ||
            currentUser.email === "admin@bulacan.com"
        ) {

            setTimeout(function () {

                showPage("admin");

            }, 300);

        }

    } else {

        hideShoppingSections();
    }

    setupAllButtons();
}


/* =========================================================
   STORAGE
   ========================================================= */

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

    let users = [];

    try {
        users =
            JSON.parse(
                localStorage.getItem(USERS_KEY)
            ) || [];
    } catch (error) {
        users = [];
    }

    const adminExists =
        users.some(
            user =>
                String(user.email)
                    .toLowerCase()
                    .trim() ===
                "admin@bulacan.com"
        );

    if (!adminExists) {

        users.push({
            id: 1,
            name: "Administrator",
            email: "admin@bulacan.com",
            password: "admin123",
            role: "admin"
        });

        saveUsers(users);
    }
}
function loadCurrentUser() {

    try {

        currentUser = JSON.parse(
            localStorage.getItem(
                CURRENT_USER_KEY
            )
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
            localStorage.getItem(
                CART_KEY
            )
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


function loadProducts() {

    const saved =
        localStorage.getItem(
            PRODUCTS_KEY
        );

    if (!saved) return;

    try {

        products = JSON.parse(saved);

    } catch (error) {

        console.log(
            "Using default products."
        );
    }
}


function saveProducts() {

    localStorage.setItem(
        PRODUCTS_KEY,
        JSON.stringify(products)
    );
}


/* =========================================================
   BUTTON SETUP
   ========================================================= */

function setupAllButtons() {

    /*
       Navbar
    */

    const showLoginBtn =
        document.getElementById(
            "showLoginBtn"
        );

    const showSignupBtn =
        document.getElementById(
            "showSignupBtn"
        );

    const logoutBtn =
        document.getElementById(
            "logoutBtn"
        );


    if (showLoginBtn) {

        showLoginBtn.onclick = function () {

            showAuth("login");
        };
    }


    if (showSignupBtn) {

        showSignupBtn.onclick = function () {

            showAuth("signup");
        };
    }


    if (logoutBtn) {

        logoutBtn.onclick = logout;
    }


    /*
       Hero buttons
    */

    const heroExploreBtn =
        document.getElementById(
            "heroExploreBtn"
        );

    const heroLoginBtn =
        document.getElementById(
            "heroLoginBtn"
        );


    if (heroExploreBtn) {

        heroExploreBtn.onclick =
            function () {

                if (!currentUser) {

                    showToast(
                        "Please login first to explore products."
                    );

                    showAuth("login");

                    return;
                }

                showLoggedInShopping();

                document
                    .getElementById(
                        "regionsSection"
                    )
                    ?.scrollIntoView({
                        behavior: "smooth"
                    });
            };
    }


    if (heroLoginBtn) {

        heroLoginBtn.onclick =
            function () {

                if (currentUser) {

                    showLoggedInShopping();

                    return;
                }

                showAuth("login");
            };
    }


    /*
       Dashboard
    */

    const dashboardProductsBtn =
        document.getElementById(
            "dashboardProductsBtn"
        );

    const dashboardCartBtn =
        document.getElementById(
            "dashboardCartBtn"
        );


    if (dashboardProductsBtn) {

        dashboardProductsBtn.onclick =
            function () {

                if (!currentUser) {

                    showAuth("login");

                    return;
                }

                document
                    .getElementById(
                        "regionsSection"
                    )
                    ?.scrollIntoView({
                        behavior: "smooth"
                    });
            };
    }


    if (dashboardCartBtn) {

        dashboardCartBtn.onclick =
            function () {

                openCart();
            };
    }


    /*
       Auth switching
    */

    const switchToSignup =
        document.getElementById(
            "switchToSignup"
        );

    const switchToLogin =
        document.getElementById(
            "switchToLogin"
        );


    if (switchToSignup) {

        switchToSignup.onclick =
            function () {

                showAuth("signup");
            };
    }


    if (switchToLogin) {

        switchToLogin.onclick =
            function () {

                showAuth("login");
            };
    }


    /*
       Forms
    */

    const loginForm =
        document.getElementById(
            "loginForm"
        );

    const signupForm =
        document.getElementById(
            "signupForm"
        );


    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            handleLogin
        );
    }


    if (signupForm) {

        signupForm.addEventListener(
            "submit",
            handleSignup
        );
    }


    /*
       Password toggle
    */

    document
        .querySelectorAll(
            ".password-toggle"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                function () {

                    togglePassword(
                        this.dataset.target,
                        this
                    );
                }
            );

        });


    /*
       Modal
    */

    const modalClose =
        document.getElementById(
            "modalClose"
        );

    const modalOverlay =
        document.getElementById(
            "modalOverlay"
        );

    const modalAddToCartBtn =
        document.getElementById(
            "modalAddToCartBtn"
        );


    if (modalClose) {

        modalClose.onclick =
            closeProductModal;
    }


    if (modalOverlay) {

        modalOverlay.onclick =
            closeProductModal;
    }


    if (modalAddToCartBtn) {

        modalAddToCartBtn.onclick =
            addModalProductToCart;
    }


    /*
       Cart
    */

    const checkoutBtn =
        document.getElementById(
            "checkoutBtn"
        );

    const cartBrowseBtn =
        document.getElementById(
            "cartBrowseBtn"
        );


    if (checkoutBtn) {

        checkoutBtn.onclick =
            openCheckout;
    }


    if (cartBrowseBtn) {

        cartBrowseBtn.onclick =
            function () {

                showPage("home");

                if (currentUser) {

                    showLoggedInShopping();
                }
            };
    }


    /*
       Checkout
    */

    const checkoutForm =
        document.getElementById(
            "checkoutForm"
        );

    const paymentMethod =
        document.getElementById(
            "paymentMethod"
        );


    if (checkoutForm) {

        checkoutForm.addEventListener(
            "submit",
            handleCheckout
        );
    }


    if (paymentMethod) {

        paymentMethod.addEventListener(
            "change",
            showPaymentInfo
        );
    }


    /*
       Success
    */

    const successBrowseBtn =
        document.getElementById(
            "successBrowseBtn"
        );

    const successHomeBtn =
        document.getElementById(
            "successHomeBtn"
        );


    if (successBrowseBtn) {

        successBrowseBtn.onclick =
            function () {

                selectedRegion = null;

                showPage("home");

                showLoggedInShopping();
            };
    }


    if (successHomeBtn) {

        successHomeBtn.onclick =
            function () {

                showPage("home");
            };
    }


    /*
       Search
    */

    const productSearch =
        document.getElementById(
            "productSearch"
        );

    const clearFilterBtn =
        document.getElementById(
            "clearFilterBtn"
        );


    if (productSearch) {

        productSearch.addEventListener(
            "input",
            function () {

                renderProductsByRegion(
                    selectedRegion
                );
            }
        );
    }


    if (clearFilterBtn) {

        clearFilterBtn.onclick =
            function () {

                if (selectedRegion) {

                    renderProductsByRegion(
                        selectedRegion
                    );
                }
            };
    }


    /*
       Admin
    */

    const productForm =
        document.getElementById(
            "productForm"
        );

    const cancelEditBtn =
        document.getElementById(
            "cancelEditBtn"
        );


    if (productForm) {

        productForm.addEventListener(
            "submit",
            handleProductForm
        );
    }


    if (cancelEditBtn) {

        cancelEditBtn.onclick =
            cancelProductEdit;
    }


    renderAdminRegionOptions();
    renderRegions();
}


/* =========================================================
   NAVBAR
   ========================================================= */

function updateNavbar() {

    /*
       Your HTML uses:
       loggedOutArea
       loggedUserArea
       usernameDisplay
    */

    const loggedOutArea =
        document.getElementById(
            "loggedOutArea"
        );

    const loggedUserArea =
        document.getElementById(
            "loggedUserArea"
        );

    const usernameDisplay =
        document.getElementById(
            "usernameDisplay"
        );


    if (currentUser) {

        loggedOutArea?.classList.add(
            "hidden"
        );

        loggedUserArea?.classList.remove(
            "hidden"
        );

        if (usernameDisplay) {

            usernameDisplay.textContent =
                currentUser.name ||
                "User";
        }

    } else {

        loggedOutArea?.classList.remove(
            "hidden"
        );

        loggedUserArea?.classList.add(
            "hidden"
        );
    }
}


/* =========================================================
   AUTH
   ========================================================= */

function showAuth(type) {

    const homeSection =
        document.getElementById(
            "homeSection"
        );

    const authSection =
        document.getElementById(
            "authSection"
        );

    const loginBox =
        document.getElementById(
            "loginBox"
        );

    const signupBox =
        document.getElementById(
            "signupBox"
        );


    homeSection?.classList.add(
        "hidden"
    );

    authSection?.classList.remove(
        "hidden"
    );


    if (type === "signup") {

        loginBox?.classList.add(
            "hidden"
        );

        signupBox?.classList.remove(
            "hidden"
        );

    } else {

        signupBox?.classList.add(
            "hidden"
        );

        loginBox?.classList.remove(
            "hidden"
        );
    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


function showHome() {

    document
        .getElementById(
            "authSection"
        )
        ?.classList.add("hidden");

    document
        .getElementById(
            "cartSection"
        )
        ?.classList.add("hidden");

    document
        .getElementById(
            "checkoutSection"
        )
        ?.classList.add("hidden");

    document
        .getElementById(
            "successSection"
        )
        ?.classList.add("hidden");

    document
        .getElementById(
            "adminSection"
        )
        ?.classList.add("hidden");

    document
        .getElementById(
            "homeSection"
        )
        ?.classList.remove("hidden");
}


/* =========================================================
   LOGIN
   ========================================================= */

function handleLogin(event) {

    event.preventDefault();

    const emailInput =
        document.getElementById("loginEmail");

    const passwordInput =
        document.getElementById("loginPassword");

    const message =
        document.getElementById("loginMessage");

    if (!emailInput || !passwordInput) {
        console.error("Login fields not found.");
        return;
    }

    const email =
        emailInput.value
            .trim()
            .toLowerCase();

    const password =
        passwordInput.value;

    const users = getUsers();

    const user =
        users.find(
            item =>
                String(item.email)
                    .trim()
                    .toLowerCase() === email &&
                String(item.password) === password
        );

    if (!user) {

        if (message) {
            message.textContent =
                "Invalid email or password.";
            message.style.color =
                "#d62828";
        }

        return;
    }

    currentUser = {
        id: user.id,
        name:
            user.name ||
            user.username ||
            "User",
        email: user.email,
        role:
            user.role ||
            "user"
    };

    saveCurrentUser();

    selectedRegion = null;

    document
        .getElementById("loginForm")
        ?.reset();

    if (message) {
        message.textContent =
            "Login successful!";
        message.style.color =
            "#0b7a3b";
    }

 updateNavbar();
updateCartCount();

/* ================================
   PAG LOGIN:
   ITAGO ANG HERO
   IPAKITA ANG MY ACCOUNT
================================ */

const homeSection =
    document.getElementById("homeSection");

const hero =
    document.querySelector("#homeSection .hero");

const userSection =
    document.getElementById("userSection");

const regionsSection =
    document.getElementById("regionsSection");

const productsSection =
    document.getElementById("productsSection");

/* Logged-in mode */
homeSection?.classList.add("logged-in");

/* ITAGO ANG WELCOME TO HEAVENS PRODUCT */
hero?.classList.add("hidden");

/* IPAKITA ANG MY ACCOUNT */
userSection?.classList.remove("hidden");

/* LOCATION IPAPAKITA DIN */
regionsSection?.classList.remove("hidden");

/* PRODUCTS HIDDEN MUNA */
productsSection?.classList.add("hidden");

/* Render locations */
selectedRegion = null;
renderRegions();

showHome();

window.scrollTo({
    top: 0,
    behavior: "smooth"
});
    showToast(
        `Welcome, ${currentUser.name}!`
    );

    /*
       If admin, open admin dashboard
    */

    if (currentUser.role === "admin") {

        showToast(
            "Welcome, Administrator!"
        );

        setTimeout(() => {
            showPage("admin");
        }, 500);
    }
}

/* =========================================================
   SIGN UP
   ========================================================= */

function handleSignup(event) {

    event.preventDefault();


    const name =
        document
            .getElementById(
                "signupUsername"
            )
            .value
            .trim();


    const email =
        document
            .getElementById(
                "signupEmail"
            )
            .value
            .trim()
            .toLowerCase();


    const password =
        document
            .getElementById(
                "signupPassword"
            )
            .value;


    const message =
        document.getElementById(
            "signupMessage"
        );


    if (password.length < 6) {

        if (message) {

            message.textContent =
                "Password must be at least 6 characters.";

            message.style.color =
                "#d62828";
        }

        return;
    }


    const users = getUsers();


    const existing =
        users.find(
            user =>
                String(user.email)
                    .toLowerCase() === email
        );


    if (existing) {

        if (message) {

            message.textContent =
                "Email is already registered.";

            message.style.color =
                "#d62828";
        }

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


    if (message) {

        message.textContent =
            "Account created! You can now login.";

        message.style.color =
            "#0b7a3b";
    }


    document
        .getElementById(
            "signupForm"
        )
        ?.reset();


    setTimeout(
        () => showAuth("login"),
        800
    );
}


/* =========================================================
   LOGOUT
   ========================================================= */

function logout() {

    currentUser = null;

    selectedRegion = null;

    cart = [];

    /* BALIK SA NORMAL BACKGROUND PAG LOGOUT */
    document
        .getElementById("homeSection")
        ?.classList.remove("logged-in");

    localStorage.removeItem(
        CURRENT_USER_KEY
    );

    localStorage.removeItem(
        CART_KEY
    );


    updateNavbar();

    updateCartCount();

    hideShoppingSections();

    showHome();


    showToast(
        "You have been logged out."
    );
}function hideShoppingSections() {

    const homeSection =
        document.getElementById("homeSection");

    const hero =
        document.querySelector("#homeSection .hero");

    const userSection =
        document.getElementById("userSection");

    const regionsSection =
        document.getElementById("regionsSection");

    const productsSection =
        document.getElementById("productsSection");

    // NORMAL / LOGGED OUT MODE
    homeSection?.classList.remove("logged-in");

    // IBALIK ANG HERO
    hero?.classList.remove("hidden");

    // ITAGO ANG MY ACCOUNT
    userSection?.classList.add("hidden");

    // ITAGO ANG LOCATIONS
    regionsSection?.classList.add("hidden");

    // ITAGO ANG PRODUCTS
    productsSection?.classList.add("hidden");

    selectedRegion = null;
}


/* =========================================================
   SHOPPING VISIBILITY
   ========================================================= */
function showLoggedInShopping() {

    if (!currentUser) {

        hideShoppingSections();

        return;
    }

    const homeSection =
        document.getElementById("homeSection");

    const hero =
        document.querySelector("#homeSection .hero");

    const userSection =
        document.getElementById("userSection");

    const regionsSection =
        document.getElementById("regionsSection");

    const productsSection =
        document.getElementById("productsSection");


    /* ================================
       LOGGED IN MODE
    ================================= */

    homeSection?.classList.add("logged-in");


    /* ITAGO ANG WELCOME HERO */
    hero?.classList.add("hidden");


    /* IPAKITA ANG MY ACCOUNT */
    userSection?.classList.remove("hidden");


    /* IPAKITA ANG CHOOSE A LOCATION */
    regionsSection?.classList.remove("hidden");


    /* PRODUCTS HIDDEN HANGGA'T
       WALANG PINIPILING LOCATION */
    productsSection?.classList.add("hidden");


    selectedRegion = null;

    renderRegions();
}

/* =========================================================
   REGIONS
   ========================================================= */

function renderRegions() {

    const grid =
        document.querySelector(
            ".region-grid"
        );


    if (!grid) return;


    grid.innerHTML = "";


    regions.forEach(region => {

        const button =
            document.createElement(
                "button"
            );


        button.type = "button";

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
                ${escapeHTML(region.name)}
            </span>

            <small>
                ${escapeHTML(region.description)}
            </small>

        `;


        button.addEventListener(
            "click",
            function () {

                selectRegion(
                    region.name
                );
            }
        );


        grid.appendChild(
            button
        );
    });
}


/* =========================================================
   SELECT REGION
   ========================================================= */

function selectRegion(regionName) {

    if (!currentUser) {

        showToast(
            "Please login first."
        );

        showAuth("login");

        return;
    }


    selectedRegion =
        regionName;


    renderRegions();


    const productsSection =
        document.getElementById(
            "productsSection"
        );


    productsSection?.classList.remove(
        "hidden"
    );


    renderProductsByRegion(
        regionName
    );


    setTimeout(
        () => {

            productsSection?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        },
        100
    );
}


/* =========================================================
   PRODUCTS
   ========================================================= */

function renderProductsByRegion(
    regionName
) {

    if (!currentUser) {

        return;
    }


    if (!regionName) {

        return;
    }


    const container =
        document.getElementById(
            "productsContainer"
        );


    if (!container) return;


    const title =
        document.getElementById(
            "productsTitle"
        );

    const subtitle =
        document.getElementById(
            "productsSubtitle"
        );


    if (title) {

        title.textContent =
            `${regionName} Products`;
    }


    if (subtitle) {

        subtitle.textContent =
            `Products available from ${regionName}.`;
    }


    const searchInput =
        document.getElementById(
            "productSearch"
        );


    const search =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    let filtered =
        products.filter(
            product =>
                product.region ===
                regionName
        );


    if (search) {

        filtered =
            filtered.filter(
                product =>

                    product.name
                        .toLowerCase()
                        .includes(search)

                    ||

                    product.description
                        .toLowerCase()
                        .includes(search)
            );
    }


    container.innerHTML = "";


    if (filtered.length === 0) {

        container.innerHTML = `

            <div class="no-products">

                <h3>
                    No products available
                </h3>

                <p>
                    There are no products available
                    in ${escapeHTML(regionName)} yet.
                </p>

            </div>

        `;

        return;
    }


    filtered.forEach(product => {

        const card =
            document.createElement(
                "div"
            );


        card.className =
            "product-card";


        card.innerHTML = `

            <div class="product-image-wrapper">

                <img
                    src="${escapeAttribute(product.image)}"
                    alt="${escapeAttribute(product.name)}"
                    onerror="this.src='https://via.placeholder.com/600x400?text=Product'"
                >

                <span class="product-region-badge">
                    📍 ${escapeHTML(product.region)}
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
                        type="button"
                        class="btn"
                        data-view-product="${product.id}"
                    >
                        View
                    </button>

                    <button
                        type="button"
                        class="btn"
                        data-add-product="${product.id}"
                    >
                        🛒 Add
                    </button>

                </div>

            </div>
        `;


        const viewBtn =
            card.querySelector(
                "[data-view-product]"
            );

        const addBtn =
            card.querySelector(
                "[data-add-product]"
            );


        viewBtn.onclick =
            () => viewProduct(product.id);

        addBtn.onclick =
            () => addToCart(product.id);


        container.appendChild(card);
    });
}


/* =========================================================
   VIEW PRODUCT
   ========================================================= */

let modalProductId = null;


function viewProduct(productId) {

    if (!currentUser) {

        showToast(
            "Please login first to view products."
        );

        showAuth("login");

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


    modalProductId =
        productId;


    document
        .getElementById(
            "modalProductImage"
        )
        .src =
        product.image;


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
            "modalQuantity"
        )
        .value = 1;


    document
        .getElementById(
            "productModal"
        )
        .classList.remove(
            "hidden"
        );
}


/* =========================================================
   MODAL ADD TO CART
   ========================================================= */

function addModalProductToCart() {

    if (!modalProductId) {

        return;
    }


    const quantityInput =
        document.getElementById(
            "modalQuantity"
        );


    const quantity =
        Math.max(
            1,
            Number(
                quantityInput?.value || 1
            )
        );


    addToCart(
        modalProductId,
        quantity
    );


    closeProductModal();
}


/* =========================================================
   CLOSE MODAL
   ========================================================= */

function closeProductModal() {

    document
        .getElementById(
            "productModal"
        )
        ?.classList.add(
            "hidden"
        );


    modalProductId = null;
}


/* =========================================================
   CART
   ========================================================= */

function addToCart(
    productId,
    quantity = 1
) {

    if (!currentUser) {

        showToast(
            "Please login first to purchase products."
        );

        showAuth("login");

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


    const existing =
        cart.find(
            item =>
                item.id === productId
        );


    if (existing) {

        existing.quantity +=
            Number(quantity);

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            region: product.region,

            price: product.price,

            image: product.image,

            description:
                product.description,

            quantity:
                Number(quantity)
        });
    }


    saveCart();

    updateCartCount();


    showToast(
        `${product.name} added to cart.`
    );
}


function updateCartCount() {

    const count =
        cart.reduce(
            (
                total,
                item
            ) =>
                total +
                Number(
                    item.quantity || 0
                ),
            0
        );


    /*
       If cartCount exists
    */

    const cartCount =
        document.getElementById(
            "cartCount"
        );


    if (cartCount) {

        cartCount.textContent =
            count;
    }


    /*
       If no cart count element exists,
       no error.
    */
}


/* =========================================================
   OPEN CART
   ========================================================= */

function openCart() {

    if (!currentUser) {

        showToast(
            "Please login first to access your cart."
        );

        showAuth("login");

        return;
    }


    showPage("cart");
}


/* =========================================================
   SHOW PAGE
   ========================================================= */

function showPage(page) {

    if (
        page === "cart" &&
        !currentUser
    ) {

        showAuth("login");

        return;
    }


    if (
        page === "checkout" &&
        !currentUser
    ) {

        showAuth("login");

        return;
    }


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

        showAuth("login");

        return;
    }


    const home =
        document.getElementById(
            "homeSection"
        );

    const auth =
        document.getElementById(
            "authSection"
        );

    const cartSection =
        document.getElementById(
            "cartSection"
        );

    const checkout =
        document.getElementById(
            "checkoutSection"
        );

    const success =
        document.getElementById(
            "successSection"
        );

    const admin =
        document.getElementById(
            "adminSection"
        );


    home?.classList.add("hidden");
    auth?.classList.add("hidden");
    cartSection?.classList.add("hidden");
    checkout?.classList.add("hidden");
    success?.classList.add("hidden");
    admin?.classList.add("hidden");


    if (page === "home") {

        home?.classList.remove(
            "hidden"
        );

        if (currentUser) {

            showLoggedInShopping();

        } else {

            hideShoppingSections();
        }
    }


    if (page === "cart") {

        cartSection?.classList.remove(
            "hidden"
        );

        renderCart();
    }


    if (page === "checkout") {

        checkout?.classList.remove(
            "hidden"
        );

        prepareCheckout();
    }


    if (page === "success") {

        success?.classList.remove(
            "hidden"
        );
    }


   if (page === "admin") {
    admin?.classList.remove("hidden");
    renderAdminProducts();
    renderAdminOrders();
}


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================================
   RENDER CART
   ========================================================= */

function renderCart() {

    if (!currentUser) {

        showAuth("login");

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


    if (!cartEmpty ||
        !cartItems ||
        !cartSummary
    ) {

        return;
    }


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
                src="${escapeAttribute(item.image)}"
                alt="${escapeAttribute(item.name)}"
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
                    📍 ${escapeHTML(item.region)}
                </small>

            </div>


            <div class="quantity-controls">

                <button
                    type="button"
                    class="quantity-btn"
                    data-minus
                >
                    −
                </button>

                <span class="quantity-number">
                    ${item.quantity}
                </span>

                <button
                    type="button"
                    class="quantity-btn"
                    data-plus
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
                type="button"
                class="remove-cart-btn"
                data-remove
            >
                Remove
            </button>

        `;


        row.querySelector(
            "[data-minus]"
        ).onclick =
            () =>
                changeQuantity(
                    item.id,
                    -1
                );


        row.querySelector(
            "[data-plus]"
        ).onclick =
            () =>
                changeQuantity(
                    item.id,
                    1
                );


        row.querySelector(
            "[data-remove]"
        ).onclick =
            () =>
                removeFromCart(
                    item.id
                );


        cartItems.appendChild(row);
    });


    updateCartSummary();
}


/* =========================================================
   QUANTITY
   ========================================================= */

function changeQuantity(
    productId,
    amount
) {

    const item =
        cart.find(
            product =>
                product.id ===
                productId
        );


    if (!item) return;


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


/* =========================================================
   REMOVE
   ========================================================= */

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


/* =========================================================
   CART SUMMARY
   ========================================================= */

function updateCartSummary() {

    const subtotal =
        cart.reduce(
            (
                total,
                item
            ) =>
                total +
                (
                    Number(item.price) *
                    Number(item.quantity)
                ),
            0
        );


   const delivery =
    cart.length > 0
        ? getShippingFee()
        : 0;


    const total =
        subtotal + delivery;


    const subtotalElement =
        document.getElementById(
            "cartSubtotal"
        );

    const totalElement =
        document.getElementById(
            "cartTotal"
        );

    const itemCountElement =
        document.getElementById(
            "cartItemCount"
        );


    if (subtotalElement) {

        subtotalElement.textContent =
            formatPrice(subtotal);
    }


    if (totalElement) {

        totalElement.textContent =
            formatPrice(total);
    }


    if (itemCountElement) {

        itemCountElement.textContent =
            cart.reduce(
                (
                    total,
                    item
                ) =>
                    total +
                    Number(
                        item.quantity
                    ),
                0
            );
    }
}


/* =========================================================
   CHECKOUT
   ========================================================= */

function openCheckout() {

    if (!currentUser) {

        showToast(
            "Please login first."
        );

        showAuth("login");

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

        showAuth("login");

        return;
    }


    if (cart.length === 0) {

        showToast(
            "Your cart is empty."
        );

        showPage("cart");

        return;
    }


    const name =
        document.getElementById(
            "checkoutName"
        );


    if (name) {

        name.value =
            currentUser.name || "";
    }
    /* =====================================================
       DELIVERY LOCATION
    ===================================================== */

    const checkoutForm =
        document.getElementById("checkoutForm");

    if (checkoutForm) {

        let locationBox =
            document.getElementById("deliveryLocationBox");

        if (!locationBox) {

            locationBox =
                document.createElement("div");

            locationBox.id =
                "deliveryLocationBox";

            locationBox.className =
                "delivery-location-box";

            locationBox.innerHTML = `

                <h3>📍 Delivery Location</h3>

                <p>
                    Please enter the complete address
                    where you want your order delivered.
                </p>

                <label>
                    Complete Address
                </label>

                <textarea
                    id="deliveryAddress"
                    placeholder="House/Building No., Street, Subdivision..."
                    rows="3"
                    required
                ></textarea>

                <label>
                    Barangay
                </label>

                <input
                    type="text"
                    id="deliveryBarangay"
                    placeholder="Enter your barangay"
                    required
                >

                <label>
                    City / Municipality
                </label>

                <input
                    type="text"
                    id="deliveryCity"
                    placeholder="Enter your city or municipality"
                    required
                >

                <label>
                    Contact Number
                </label>

                <input
                    type="tel"
                    id="deliveryContact"
                    placeholder="09XXXXXXXXX"
                    required
                >

                <button
                    type="button"
                    id="getLocationBtn"
                    class="btn"
                >
                    📍 Use My Current Location
                </button>

                <p
                    id="locationStatus"
                    class="location-status"
                >
                    Current location not selected.
                </p>

                <input
                    type="hidden"
                    id="deliveryLatitude"
                >

                <input
                    type="hidden"
                    id="deliveryLongitude"
                >

            `;

            /*
               Ilalagay ang location box
               bago ang payment section.
            */

            const paymentMethod =
                document.getElementById(
                    "paymentMethod"
                );

            if (paymentMethod) {

                paymentMethod
                    .closest("div")
                    ?.before(locationBox);

            } else {

                checkoutForm.prepend(
                    locationBox
                );
            }


            /* CURRENT LOCATION BUTTON */

            const getLocationBtn =
                document.getElementById(
                    "getLocationBtn"
                );

            if (getLocationBtn) {

                getLocationBtn.onclick =
                    getCurrentLocation;
            }
        }
    }

    updateCheckoutTotal();
}


function updateCheckoutTotal() {

    const subtotal =
        cart.reduce(
            (
                total,
                item
            ) =>
                total +
                (
                    Number(item.price) *
                    Number(item.quantity)
                ),
            0
        );


   const total =
    subtotal + getShippingFee();


    /*
       Your HTML uses checkoutTotal
    */

    const checkoutTotal =
        document.getElementById(
            "checkoutTotal"
        );


    if (checkoutTotal) {

        checkoutTotal.textContent =
            formatPrice(total);
    }
}
/* =========================================================
   DELIVERY LOCATION
   ========================================================= */

function getCurrentLocation() {

    const status =
        document.getElementById(
            "locationStatus"
        );

    const latitude =
        document.getElementById(
            "deliveryLatitude"
        );

    const longitude =
        document.getElementById(
            "deliveryLongitude"
        );

    if (!navigator.geolocation) {

        if (status) {

            status.textContent =
                "❌ Your browser does not support location.";
        }

        return;
    }


    if (status) {

        status.textContent =
            "📡 Getting your current location...";
    }


    navigator.geolocation.getCurrentPosition(

        function (position) {

            const lat =
                position.coords.latitude;

            const lng =
                position.coords.longitude;


            if (latitude) {

                latitude.value =
                    lat;
            }


            if (longitude) {

                longitude.value =
                    lng;
            }


            if (status) {

                status.textContent =
                    `✅ Location selected: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            }


            showToast(
                "Delivery location selected."
            );
        },

        function (error) {

            console.error(
                "Location error:",
                error
            );


            if (status) {

                status.textContent =
                    "❌ Unable to get your location. Please enter your address manually.";
            }


            showToast(
                "Please allow location access."
            );
        },

        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

/* =========================================================
   PAYMENT
   ========================================================= */

function showPaymentInfo() {

    const payment =
        document.getElementById(
            "paymentMethod"
        );

    const gcashInfo =
        document.getElementById(
            "gcashInfo"
        );

    if (!payment || !gcashInfo) {
        return;
    }

    if (payment.value === "GCash") {

        gcashInfo.classList.remove("hidden");

        updateGCashAmount();

    } else {

        gcashInfo.classList.add("hidden");
    }
}
function updateGCashAmount() {

    const gcashAmount =
        document.getElementById(
            "gcashAmount"
        );

    if (!gcashAmount) {
        return;
    }

    const subtotal =
        cart.reduce(
            (total, item) =>
                total +
                (
                    Number(item.price) *
                    Number(item.quantity)
                ),
            0
        );

    const total =
    subtotal + getShippingFee();

    gcashAmount.textContent =
        formatPrice(total);
}

/* =========================================================
   HANDLE CHECKOUT
   ========================================================= */

function handleCheckout(event) {

    event.preventDefault();


    if (!currentUser) {

        showToast(
            "Please login first."
        );

        showAuth("login");

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
        document.getElementById(
            "paymentMethod"
        )?.value;

    /* =====================================================
       DELIVERY INFORMATION
    ===================================================== */

    const deliveryAddress =
        document.getElementById(
            "deliveryAddress"
        )?.value.trim() || "";

    const deliveryBarangay =
        document.getElementById(
            "deliveryBarangay"
        )?.value.trim() || "";

    const deliveryCity =
        document.getElementById(
            "deliveryCity"
        )?.value.trim() || "";

    const deliveryContact =
        document.getElementById(
            "deliveryContact"
        )?.value.trim() || "";

    const deliveryLatitude =
        document.getElementById(
            "deliveryLatitude"
        )?.value || "";

    const deliveryLongitude =
        document.getElementById(
            "deliveryLongitude"
        )?.value || "";


    if (
        !deliveryAddress ||
        !deliveryBarangay ||
        !deliveryCity ||
        !deliveryContact
    ) {

        showToast(
            "Please complete your delivery location."
        );

        return;
    }
    if (!payment) {

        showToast(
            "Please select a payment method."
        );

        return;
    }


    const subtotal =
        cart.reduce(
            (
                sum,
                item
            ) =>
                sum +
                (
                    Number(item.price) *
                    Number(item.quantity)
                ),
            0
        );


   const gcashReference =
    document.getElementById("gcashReference")?.value.trim() || "";

if (payment === "GCash" && !gcashReference) {
    showToast("Please enter your GCash reference number.");
    return;
}

const shippingFee = getShippingFee();

const order = {

    id: Date.now(),

    userId: currentUser.id,

    customer: currentUser.name,

    email: currentUser.email,

    items: [...cart],

    payment: payment,

    gcashReference: gcashReference,

    /* DELIVERY INFORMATION */

    deliveryAddress: deliveryAddress,

    deliveryBarangay: deliveryBarangay,

    deliveryCity: deliveryCity,

    deliveryContact: deliveryContact,

    deliveryLatitude:
        deliveryLatitude || null,

    deliveryLongitude:
        deliveryLongitude || null,

    /* PAYMENT */

    subtotal: subtotal,

    shippingFee: shippingFee,

    total:
        subtotal + shippingFee,

    status:
        payment === "GCash"
            ? "Pending Verification"
            : "Approved",

    date:
        new Date().toISOString()
};


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


    cart = [];

    saveCart();

    updateCartCount();


    document
        .getElementById(
            "checkoutForm"
        )
        ?.reset();


    document
        .getElementById(
            "gcashInfo"
        )
        ?.classList.add(
            "hidden"
        );


    const successInfo =
        document.getElementById(
            "successOrderInfo"
        );


 if (successInfo) {

    successInfo.innerHTML = `

        <strong>
            Order #${order.id}
        </strong>

        <br><br>

        <strong>📍 Delivery Address</strong>

        <br>

        ${escapeHTML(order.deliveryAddress)}

        <br>

        ${escapeHTML(order.deliveryBarangay)},
        ${escapeHTML(order.deliveryCity)}

        <br>

        📱 ${escapeHTML(order.deliveryContact)}

        <br><br>

        <strong>💰 Total:</strong>
        ${formatPrice(order.total)}

        <br>

        <strong>💳 Payment:</strong>
        ${escapeHTML(payment)}

    `;
}

    showPage("success");


    showToast(
        "Order successfully placed!"
    );
}


/* =========================================================
   ADMIN REGIONS
   ========================================================= */

function renderAdminRegionOptions() {

    const select =
        document.getElementById(
            "productRegion"
        );


    if (!select) return;


    select.innerHTML = `

        <option value="">
            Select product region
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


/* =========================================================
   ADMIN PRODUCT FORM
   ========================================================= */

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


    const productName =
        document.getElementById(
            "productName"
        );

    const productPrice =
        document.getElementById(
            "productPrice"
        );

    const productImage =
        document.getElementById(
            "productImage"
        );

    const productRegion =
        document.getElementById(
            "productRegion"
        );

    const productDescription =
        document.getElementById(
            "productDescription"
        );


    const name =
        productName.value.trim();

    const price =
        Number(
            productPrice.value
        );

    const image =
        productImage.value.trim();

    const region =
        productRegion.value;

    const description =
        productDescription.value.trim();


    if (
        !name ||
        !price ||
        !image ||
        !region ||
        !description
    ) {

        showToast(
            "Please complete all product fields."
        );

        return;
    }


    /*
       Check if editing
    */

    const productId =
        document.getElementById(
            "productId"
        );


    const id =
        productId
            ? Number(productId.value)
            : 0;


    if (id) {

        const product =
            products.find(
                item =>
                    item.id === id
            );


        if (product) {

            product.name =
                name;

            product.price =
                price;

            product.image =
                image;

            product.region =
                region;

            product.description =
                description;
        }


        showToast(
            "Product updated successfully."
        );

    } else {

        products.push({

            id: Date.now(),

            name,

            price,

            image,

            region,

            description
        });


        showToast(
            "Product added successfully."
        );
    }


    saveProducts();

    cancelProductEdit();

    renderAdminProducts();


    if (
        selectedRegion &&
        currentUser
    ) {

        renderProductsByRegion(
            selectedRegion
        );
    }
}


/* =========================================================
   ADMIN PRODUCT LIST
   ========================================================= */

function renderAdminProducts() {

    const container =
        document.getElementById(
            "adminProductsContainer"
        );


    if (!container) return;


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
                    src="${escapeAttribute(product.image)}"
                    alt="${escapeAttribute(product.name)}"
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
                    type="button"
                    class="btn edit-btn"
                >
                    Edit
                </button>

                <button
                    type="button"
                    class="btn delete-btn"
                >
                    Delete
                </button>

            </div>
        `;


        item
            .querySelector(
                ".edit-btn"
            )
            .onclick =
            () =>
                editProduct(
                    product.id
                );


        item
            .querySelector(
                ".delete-btn"
            )
            .onclick =
            () =>
                deleteProduct(
                    product.id
                );


        container.appendChild(
            item
        );
    });
}


/* =========================================================
   EDIT PRODUCT
   ========================================================= */

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


    if (!product) return;


    const productIdInput =
        document.getElementById(
            "productId"
        );


    if (productIdInput) {

        productIdInput.value =
            product.id;
    }


    document
        .getElementById(
            "productName"
        )
        .value =
        product.name;


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
            "productRegion"
        )
        .value =
        product.region;


    document
        .getElementById(
            "productDescription"
        )
        .value =
        product.description;


    const title =
        document.getElementById(
            "adminFormTitle"
        );


    if (title) {

        title.textContent =
            "Edit Product";
    }


    const cancel =
        document.getElementById(
            "cancelEditBtn"
        );


    cancel?.classList.remove(
        "hidden"
    );


    document
        .getElementById(
            "adminSection"
        )
        ?.scrollIntoView({
            behavior: "smooth"
        });
}


/* =========================================================
   DELETE PRODUCT
   ========================================================= */

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


    if (!product) return;


    const confirmed =
        confirm(
            `Delete "${product.name}"?`
        );


    if (!confirmed) return;


    products =
        products.filter(
            item =>
                item.id !== productId
        );


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


/* =========================================================
   CANCEL EDIT
   ========================================================= */

function cancelProductEdit() {

    const form =
        document.getElementById(
            "productForm"
        );


    form?.reset();


    const productId =
        document.getElementById(
            "productId"
        );


    if (productId) {

        productId.value = "";
    }


    const title =
        document.getElementById(
            "adminFormTitle"
        );


    if (title) {

        title.textContent =
            "Add Product";
    }


    const cancel =
        document.getElementById(
            "cancelEditBtn"
        );


    cancel?.classList.add(
        "hidden"
    );
}


/* =========================================================
   TOAST
   ========================================================= */

function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );


    if (!toast) {

        alert(message);

        return;
    }


    toast.textContent =
        message;


    toast.classList.remove(
        "hidden"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                toast.classList.add(
                    "hidden"
                );

            },
            3000
        );
}


/* =========================================================
   PASSWORD
   ========================================================= */

function togglePassword(
    inputId,
    button
) {

    const input =
        document.getElementById(
            inputId
        );


    if (!input) return;


    if (
        input.type ===
        "password"
    ) {

        input.type = "text";

        button.textContent =
            "🙈";

    } else {

        input.type =
            "password";

        button.textContent =
            "👁️";
    }
}


/* =========================================================
   PRICE
   ========================================================= */

function formatPrice(price) {

    return (
        "₱" +
        Number(price)
            .toLocaleString(
                "en-PH",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            )
    );
}


/* =========================================================
   HTML ESCAPE
   ========================================================= */

function escapeHTML(value) {

    return String(value)
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );
}


function escapeAttribute(value) {

    return escapeHTML(value);
}


/* =========================================================
   BACK TO SHOPPING
   ========================================================= */

function backToShopping() {

    if (!currentUser) {

        showAuth("login");

        return;
    }


    selectedRegion = null;

    showPage("home");

    showLoggedInShopping();
}


/* =========================================================
   FORGOT PASSWORD
   ========================================================= */

function forgotPassword() {

    showToast(
        "Password reset requires a backend/email system."
    );
}


/* =========================================================
   ADMIN QUICK ACCESS
   ========================================================= */

/*
   Admin:

   Email:
   admin@bulacan.com

   Password:
   admin123

   To open admin from browser console:

   showPage("admin");
*/


/* =========================================================
   END
   ========================================================= */
