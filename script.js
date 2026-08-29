/* =====================================================
   BULACAN BUSINESS
   COMPLETE SCRIPT
   SUPABASE + AUTH + REGIONS + PRODUCTS + CART + CHECKOUT
===================================================== */


/* =====================================================
   SUPABASE CONNECTION
===================================================== */

const SUPABASE_URL =
    "https://clnsyeilgralccihuodd.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_JQmMkq37U8OsNPo1AGG-mg_7PcEdiVp";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


/* =====================================================
   STATE
===================================================== */

let allProducts = [];

let selectedRegion = "All";

let selectedProduct = null;

let editingProductId = null;

let cart = JSON.parse(
    localStorage.getItem("bulacanBusinessCart") || "[]"
);


/* =====================================================
   ELEMENTS
===================================================== */

const homeSection =
    document.getElementById("homeSection");

const authSection =
    document.getElementById("authSection");

const loginBox =
    document.getElementById("loginBox");

const signupBox =
    document.getElementById("signupBox");

const userSection =
    document.getElementById("userSection");

const adminSection =
    document.getElementById("adminSection");

const loggedOutArea =
    document.getElementById("loggedOutArea");

const loggedUserArea =
    document.getElementById("loggedUserArea");

const showLoginBtn =
    document.getElementById("showLoginBtn");

const showSignupBtn =
    document.getElementById("showSignupBtn");

const heroLoginBtn =
    document.getElementById("heroLoginBtn");

const heroExploreBtn =
    document.getElementById("heroExploreBtn");

const switchToSignup =
    document.getElementById("switchToSignup");

const switchToLogin =
    document.getElementById("switchToLogin");

const loginForm =
    document.getElementById("loginForm");

const signupForm =
    document.getElementById("signupForm");

const logoutBtn =
    document.getElementById("logoutBtn");

const usernameDisplay =
    document.getElementById("usernameDisplay");

const dashboardUsername =
    document.getElementById("dashboardUsername");

const loginMessage =
    document.getElementById("loginMessage");

const signupMessage =
    document.getElementById("signupMessage");

const productForm =
    document.getElementById("productForm");

const productMessage =
    document.getElementById("productMessage");

const productsContainer =
    document.getElementById("productsContainer");

const adminProductsContainer =
    document.getElementById("adminProductsContainer");

const regionsSection =
    document.getElementById("regionsSection");

const productsSection =
    document.getElementById("productsSection");

const productsTitle =
    document.getElementById("productsTitle");

const productsSubtitle =
    document.getElementById("productsSubtitle");

const productSearch =
    document.getElementById("productSearch");

const clearFilterBtn =
    document.getElementById("clearFilterBtn");

const cartSection =
    document.getElementById("cartSection");

const checkoutSection =
    document.getElementById("checkoutSection");

const successSection =
    document.getElementById("successSection");

const cartItems =
    document.getElementById("cartItems");

const cartEmpty =
    document.getElementById("cartEmpty");

const cartSummary =
    document.getElementById("cartSummary");

const cartItemCount =
    document.getElementById("cartItemCount");

const cartSubtotal =
    document.getElementById("cartSubtotal");

const cartTotal =
    document.getElementById("cartTotal");

const checkoutTotal =
    document.getElementById("checkoutTotal");

const checkoutForm =
    document.getElementById("checkoutForm");

const paymentMethod =
    document.getElementById("paymentMethod");

const gcashInfo =
    document.getElementById("gcashInfo");

const checkoutBtn =
    document.getElementById("checkoutBtn");

const cartBrowseBtn =
    document.getElementById("cartBrowseBtn");

const dashboardProductsBtn =
    document.getElementById("dashboardProductsBtn");

const dashboardCartBtn =
    document.getElementById("dashboardCartBtn");

const successBrowseBtn =
    document.getElementById("successBrowseBtn");

const successHomeBtn =
    document.getElementById("successHomeBtn");

const successOrderInfo =
    document.getElementById("successOrderInfo");

const toast =
    document.getElementById("toast");

const productModal =
    document.getElementById("productModal");

const modalOverlay =
    document.getElementById("modalOverlay");

const modalClose =
    document.getElementById("modalClose");

const modalProductImage =
    document.getElementById("modalProductImage");

const modalProductName =
    document.getElementById("modalProductName");

const modalProductPrice =
    document.getElementById("modalProductPrice");

const modalProductDescription =
    document.getElementById("modalProductDescription");

const modalProductRegion =
    document.getElementById("modalProductRegion");

const modalQuantity =
    document.getElementById("modalQuantity");

const modalAddToCartBtn =
    document.getElementById("modalAddToCartBtn");

const cancelEditBtn =
    document.getElementById("cancelEditBtn");

const productNameInput =
    document.getElementById("productName");

const productPriceInput =
    document.getElementById("productPrice");

const productImageInput =
    document.getElementById("productImage");

const productRegionInput =
    document.getElementById("productRegion");

const productDescriptionInput =
    document.getElementById("productDescription");


/* =====================================================
   HELPERS
===================================================== */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function formatPrice(value) {

    return Number(value || 0)
        .toLocaleString(
            "en-PH",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );
}


function saveCart() {

    localStorage.setItem(
        "bulacanBusinessCart",
        JSON.stringify(cart)
    );
}


function showToast(message) {

    if (!toast) {
        return;
    }

    toast.textContent = message;

    toast.classList.remove("hidden");

    clearTimeout(
        window.toastTimer
    );

    window.toastTimer =
        setTimeout(() => {

            toast.classList.add("hidden");

        }, 3000);
}


function scrollToProducts() {

    productsSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


/* =====================================================
   AUTH UI
===================================================== */

function showLogin() {

    authSection.classList.remove("hidden");

    loginBox.classList.remove("hidden");

    signupBox.classList.add("hidden");

    homeSection.classList.add("hidden");

    userSection.classList.add("hidden");

    adminSection.classList.add("hidden");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


function showSignup() {

    authSection.classList.remove("hidden");

    loginBox.classList.add("hidden");

    signupBox.classList.remove("hidden");

    homeSection.classList.add("hidden");

    userSection.classList.add("hidden");

    adminSection.classList.add("hidden");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


if (showLoginBtn) {

    showLoginBtn.addEventListener(
        "click",
        showLogin
    );

}


if (showSignupBtn) {

    showSignupBtn.addEventListener(
        "click",
        showSignup
    );

}


if (heroLoginBtn) {

    heroLoginBtn.addEventListener(
        "click",
        showLogin
    );

}


if (switchToSignup) {

    switchToSignup.addEventListener(
        "click",
        () => {

            loginBox.classList.add("hidden");

            signupBox.classList.remove("hidden");

            loginMessage.textContent = "";

        }
    );

}


if (switchToLogin) {

    switchToLogin.addEventListener(
        "click",
        () => {

            signupBox.classList.add("hidden");

            loginBox.classList.remove("hidden");

            signupMessage.textContent = "";

        }
    );

}


/* =====================================================
   PASSWORD TOGGLE
===================================================== */

document
    .querySelectorAll(".password-toggle")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const targetId =
                    button.dataset.target;

                const input =
                    document.getElementById(
                        targetId
                    );

                if (!input) {
                    return;
                }

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
        );

    });


/* =====================================================
   SIGN UP
===================================================== */

if (signupForm) {

    signupForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            const username =
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
                    .trim();

            const password =
                document
                    .getElementById(
                        "signupPassword"
                    )
                    .value;


            signupMessage.textContent =
                "Creating account...";


            try {

                const {
                    data,
                    error
                } =
                    await supabaseClient
                        .auth
                        .signUp({

                            email,

                            password,

                            options: {

                                data: {
                                    username
                                }

                            }

                        });


                if (error) {
                    throw error;
                }


                signupMessage.textContent =
                    "Account created successfully! " +
                    "Check your email if confirmation is required.";


                signupForm.reset();


                if (
                    data &&
                    data.session
                ) {

                    await loadUser();

                }

            } catch (error) {

                console.error(
                    "Signup error:",
                    error
                );

                signupMessage.textContent =
                    "Sign up failed: " +
                    error.message;

            }

        }
    );

}


/* =====================================================
   LOGIN
===================================================== */

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            const email =
                document
                    .getElementById(
                        "loginEmail"
                    )
                    .value
                    .trim();

            const password =
                document
                    .getElementById(
                        "loginPassword"
                    )
                    .value;


            loginMessage.textContent =
                "Logging in...";


            try {

                const {
                    error
                } =
                    await supabaseClient
                        .auth
                        .signInWithPassword({

                            email,

                            password

                        });


                if (error) {
                    throw error;
                }


                loginMessage.textContent =
                    "Login successful!";


                loginForm.reset();


                await loadUser();


            } catch (error) {

                console.error(
                    "Login error:",
                    error
                );

                loginMessage.textContent =
                    "Login failed: " +
                    error.message;

            }

        }
    );

}


/* =====================================================
   LOGOUT
===================================================== */

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async () => {

            const {
                error
            } =
                await supabaseClient
                    .auth
                    .signOut();


            if (error) {

                console.error(
                    "Logout error:",
                    error
                );

                showToast(
                    "Logout failed."
                );

                return;
            }


            cart = [];

            saveCart();

            location.reload();

        }
    );

}


/* =====================================================
   CURRENT USER
===================================================== */

async function loadUser() {

    const {
        data: {
            user
        }
    } =
        await supabaseClient
            .auth
            .getUser();


    if (!user) {

        showLoggedOut();

        return;

    }


    const {
        data: profile,
        error
    } =
        await supabaseClient
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();


    if (error) {

        console.error(
            "Profile error:",
            error
        );

        /*
         * Huwag i-hide ang products.
         * User can still browse products.
         */

        showLoggedIn({
            username:
                user.user_metadata
                    ?.username ||
                "User",

            role:
                "user"
        });

        return;

    }


    showLoggedIn(profile);

}


/* =====================================================
   SHOW LOGGED OUT
===================================================== */

function showLoggedOut() {

    /*
     * IMPORTANT:
     *
     * HINDI natin hina-hide ang homeSection.
     *
     * Para visible ang:
     * Hero
     * Regions
     * Products
     */

    homeSection.classList.remove(
        "hidden"
    );

    authSection.classList.add(
        "hidden"
    );

    userSection.classList.add(
        "hidden"
    );

    adminSection.classList.add(
        "hidden"
    );

    cartSection.classList.add(
        "hidden"
    );

    checkoutSection.classList.add(
        "hidden"
    );

    successSection.classList.add(
        "hidden"
    );

    loggedOutArea.classList.remove(
        "hidden"
    );

    loggedUserArea.classList.add(
        "hidden"
    );

    loadProducts();

}


/* =====================================================
   SHOW LOGGED IN
===================================================== */

function showLoggedIn(profile) {

    /*
     * IMPORTANT FIX:
     *
     * Dating code:
     *
     * homeSection.classList.add("hidden")
     *
     * TINANGGAL NATIN.
     *
     * Dahil dito, visible pa rin ang
     * Regions at Products kapag naka-login.
     */


    homeSection.classList.remove(
        "hidden"
    );

    authSection.classList.add(
        "hidden"
    );

    userSection.classList.remove(
        "hidden"
    );

    loggedOutArea.classList.add(
        "hidden"
    );

    loggedUserArea.classList.remove(
        "hidden"
    );


    const username =
        profile?.username ||
        "User";


    usernameDisplay.textContent =
        username;

    dashboardUsername.textContent =
        username;


    if (
        profile?.role ===
        "admin"
    ) {

        adminSection.classList.remove(
            "hidden"
        );

        loadAdminProducts();

    } else {

        adminSection.classList.add(
            "hidden"
        );

    }


    loadProducts();

}


/* =====================================================
   LOAD PRODUCTS
===================================================== */

async function loadProducts() {

    if (!productsContainer) {
        return;
    }


    productsContainer.innerHTML = `

        <div class="loading-products">

            <div class="spinner"></div>

            <p>
                Loading products...
            </p>

        </div>

    `;


    const {
        data: products,
        error
    } =
        await supabaseClient
            .from("products")
            .select("*")
            .order(
                "id",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(
            "Products error:",
            error
        );

        productsContainer.innerHTML = `

            <div class="no-products">

                <h3>
                    Unable to load products
                </h3>

                <p>
                    ${escapeHTML(
                        error.message
                    )}
                </p>

            </div>

        `;

        return;
    }


    allProducts =
        products || [];


    renderProducts();

}


/* =====================================================
   RENDER PRODUCTS
===================================================== */

function renderProducts() {

    const searchText =
        productSearch
            ?.value
            .trim()
            .toLowerCase() ||
        "";


    let filtered =
        allProducts.filter(
            product => {

                const productRegion =
                    String(
                        product.region ||
                        ""
                    )
                    .trim();


                const matchesRegion =
                    selectedRegion ===
                    "All" ||
                    productRegion
                        .toLowerCase() ===
                    selectedRegion
                        .toLowerCase();


                const searchableText =
                    [
                        product.name,
                        product.description,
                        product.region
                    ]
                        .join(" ")
                        .toLowerCase();


                const matchesSearch =
                    !searchText ||
                    searchableText
                        .includes(
                            searchText
                        );


                return (
                    matchesRegion &&
                    matchesSearch
                );

            }
        );


    productsContainer.innerHTML = "";


    if (
        filtered.length ===
        0
    ) {

        productsContainer.innerHTML = `

            <div class="no-products">

                <h3>
                    No products found
                </h3>

                <p>
                    Try another region or search term.
                </p>

            </div>

        `;

        updateProductHeading();

        return;

    }


    filtered.forEach(
        product => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "product-card";


            const image =
                product.image ||
                "https://via.placeholder.com/500x300?text=Product";


            const region =
                product.region ||
                "Bulacan";


            card.innerHTML = `

                <div
                    class="product-image-wrapper"
                >

                    <img
                        src="${escapeHTML(image)}"
                        alt="${escapeHTML(product.name)}"
                        loading="lazy"
                    >

                    <span
                        class="product-region-badge"
                    >
                        📍 ${escapeHTML(region)}
                    </span>

                </div>


                <div class="product-info">

                    <h3>
                        ${escapeHTML(
                            product.name
                        )}
                    </h3>


                    <p class="product-price">
                        ₱${formatPrice(
                            product.price
                        )}
                    </p>


                    <p class="product-description">
                        ${escapeHTML(
                            product.description ||
                            ""
                        )}
                    </p>


                    <div
                        class="product-actions"
                    >

                        <button
                            class="btn"
                            data-action="view"
                            data-id="${product.id}"
                        >
                            View
                        </button>

                        <button
                            class="btn secondary"
                            data-action="cart"
                            data-id="${product.id}"
                        >
                            🛒 Add
                        </button>

                    </div>

                </div>

            `;


            productsContainer.appendChild(
                card
            );

        }
    );


    updateProductHeading();

}


/* =====================================================
   PRODUCT HEADING
===================================================== */

function updateProductHeading() {

    if (!productsTitle) {
        return;
    }


    if (
        selectedRegion ===
        "All"
    ) {

        productsTitle.textContent =
            "All Products";

        productsSubtitle.textContent =
            "Products from Bulacan businesses";

    } else {

        productsTitle.textContent =
            `${selectedRegion} Products`;

        productsSubtitle.textContent =
            `Products available from ${selectedRegion}`;

    }

}


/* =====================================================
   PRODUCT BUTTONS
===================================================== */

if (productsContainer) {

    productsContainer.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "button[data-action]"
                );


            if (!button) {
                return;
            }


            const id =
                Number(
                    button.dataset.id
                );


            const product =
                allProducts.find(
                    item =>
                        Number(item.id) ===
                        id
                );


            if (!product) {
                return;
            }


            if (
                button.dataset.action ===
                "view"
            ) {

                openProductModal(
                    product
                );

            }


            if (
                button.dataset.action ===
                "cart"
            ) {

                addToCart(
                    product,
                    1
                );

            }

        }
    );

}


/* =====================================================
   REGION FILTER
===================================================== */

document
    .querySelectorAll(
        ".region-card"
    )
    .forEach(card => {

        card.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".region-card"
                    )
                    .forEach(
                        item =>
                            item.classList.remove(
                                "active"
                            )
                    );


                card.classList.add(
                    "active"
                );


                selectedRegion =
                    card.dataset.region ||
                    "All";


                renderProducts();

                scrollToProducts();

            }
        );

    });


/* =====================================================
   SEARCH
===================================================== */

if (productSearch) {

    productSearch.addEventListener(
        "input",
        renderProducts
    );

}


if (clearFilterBtn) {

    clearFilterBtn.addEventListener(
        "click",
        () => {

            selectedRegion =
                "All";


            if (productSearch) {
                productSearch.value = "";
            }


            document
                .querySelectorAll(
                    ".region-card"
                )
                .forEach(
                    item =>
                        item.classList.remove(
                            "active"
                        )
                );


            const allRegion =
                document.querySelector(
                    '.region-card[data-region="All"]'
                );


            if (allRegion) {

                allRegion.classList.add(
                    "active"
                );

            }


            renderProducts();

        }
    );

}


/* =====================================================
   HERO EXPLORE
===================================================== */

if (heroExploreBtn) {

    heroExploreBtn.addEventListener(
        "click",
        scrollToProducts
    );

}


/* =====================================================
   DASHBOARD BUTTONS
===================================================== */

if (dashboardProductsBtn) {

    dashboardProductsBtn.addEventListener(
        "click",
        scrollToProducts
    );

}


if (dashboardCartBtn) {

    dashboardCartBtn.addEventListener(
        "click",
        openCart
    );

}


/* =====================================================
   PRODUCT MODAL
===================================================== */

function openProductModal(
    product
) {

    selectedProduct =
        product;


    modalProductImage.src =
        product.image ||
        "https://via.placeholder.com/500x300?text=Product";


    modalProductImage.alt =
        product.name;


    modalProductName.textContent =
        product.name;


    modalProductPrice.textContent =
        `₱${formatPrice(
            product.price
        )}`;


    modalProductDescription.textContent =
        product.description ||
        "No description available.";


    modalProductRegion.textContent =
        `📍 ${
            product.region ||
            "Bulacan"
        }`;


    modalQuantity.value =
        1;


    productModal.classList.remove(
        "hidden"
    );


    document.body.style.overflow =
        "hidden";

}


function closeProductModal() {

    productModal.classList.add(
        "hidden"
    );

    document.body.style.overflow =
        "";

    selectedProduct =
        null;

}


if (modalClose) {

    modalClose.addEventListener(
        "click",
        closeProductModal
    );

}


if (modalOverlay) {

    modalOverlay.addEventListener(
        "click",
        closeProductModal
    );

}


document.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Escape"
        ) {

            closeProductModal();

        }

    }
);


if (modalAddToCartBtn) {

    modalAddToCartBtn.addEventListener(
        "click",
        () => {

            if (!selectedProduct) {
                return;
            }


            const quantity =
                Math.max(
                    1,
                    Number(
                        modalQuantity.value
                    ) || 1
                );


            addToCart(
                selectedProduct,
                quantity
            );


            closeProductModal();

        }
    );

}


/* =====================================================
   CART
===================================================== */

function addToCart(
    product,
    quantity = 1
) {

    const id =
        Number(product.id);


    const existing =
        cart.find(
            item =>
                Number(item.id) ===
                id
        );


    if (existing) {

        existing.quantity +=
            quantity;

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            price:
                Number(
                    product.price
                ),

            image:
                product.image || "",

            description:
                product.description ||
                "",

            region:
                product.region ||
                "Bulacan",

            quantity:
                quantity

        });

    }


    saveCart();

    renderCart();

    showToast(
        `${product.name} added to cart.`
    );

}


/* =====================================================
   RENDER CART
===================================================== */

function renderCart() {

    if (!cartItems) {
        return;
    }


    if (
        !cart ||
        cart.length ===
        0
    ) {

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


    let total =
        0;

    let count =
        0;


    cart.forEach(
        item => {

            const itemTotal =
                Number(item.price) *
                Number(item.quantity);


            total +=
                itemTotal;

            count +=
                Number(
                    item.quantity
                );


            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "cart-item";


            row.innerHTML = `

                <img
                    class="cart-item-image"
                    src="${escapeHTML(
                        item.image ||
                        "https://via.placeholder.com/100x100?text=Product"
                    )}"
                    alt="${escapeHTML(
                        item.name
                    )}"
                >


                <div
                    class="cart-item-info"
                >

                    <h3>
                        ${escapeHTML(
                            item.name
                        )}
                    </h3>

                    <p>
                        ₱${formatPrice(
                            item.price
                        )}
                    </p>

                    <p
                        class="cart-item-region"
                    >
                        📍 ${escapeHTML(
                            item.region ||
                            "Bulacan"
                        )}
                    </p>

                </div>


                <div
                    class="quantity-controls"
                >

                    <button
                        class="quantity-btn"
                        data-cart-action="minus"
                        data-id="${item.id}"
                    >
                        −
                    </button>

                    <span
                        class="quantity-number"
                    >
                        ${item.quantity}
                    </span>

                    <button
                        class="quantity-btn"
                        data-cart-action="plus"
                        data-id="${item.id}"
                    >
                        +
                    </button>

                </div>


                <div
                    class="cart-item-total"
                >
                    ₱${formatPrice(
                        itemTotal
                    )}
                </div>


                <button
                    class="remove-cart-btn"
                    data-cart-action="remove"
                    data-id="${item.id}"
                >
                    Remove
                </button>

            `;


            cartItems.appendChild(
                row
            );

        }
    );


    cartItemCount.textContent =
        count;


    cartSubtotal.textContent =
        `₱${formatPrice(
            total
        )}`;


    cartTotal.textContent =
        `₱${formatPrice(
            total
        )}`;


    checkoutTotal.textContent =
        `₱${formatPrice(
            total
        )}`;

}


/* =====================================================
   CART ACTIONS
===================================================== */

if (cartItems) {

    cartItems.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "button[data-cart-action]"
                );


            if (!button) {
                return;
            }


            const id =
                Number(
                    button.dataset.id
                );


            const item =
                cart.find(
                    cartItem =>
                        Number(
                            cartItem.id
                        ) === id
                );


            if (!item) {
                return;
            }


            const action =
                button.dataset.cartAction;


            if (
                action ===
                "plus"
            ) {

                item.quantity++;

            }


            if (
                action ===
                "minus"
            ) {

                item.quantity--;

                if (
                    item.quantity <=
                    0
                ) {

                    cart =
                        cart.filter(
                            cartItem =>
                                Number(
                                    cartItem.id
                                ) !== id
                        );

                }

            }


            if (
                action ===
                "remove"
            ) {

                cart =
                    cart.filter(
                        cartItem =>
                            Number(
                                cartItem.id
                            ) !== id
                    );

            }


            saveCart();

            renderCart();

        }
    );

}


/* =====================================================
   OPEN CART
===================================================== */

function openCart() {

    homeSection.classList.add(
        "hidden"
    );

    authSection.classList.add(
        "hidden"
    );

    userSection.classList.add(
        "hidden"
    );

    adminSection.classList.add(
        "hidden"
    );

    checkoutSection.classList.add(
        "hidden"
    );

    successSection.classList.add(
        "hidden"
    );

    cartSection.classList.remove(
        "hidden"
    );


    renderCart();


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


if (dashboardCartBtn) {

    dashboardCartBtn.addEventListener(
        "click",
        openCart
    );

}


if (cartBrowseBtn) {

    cartBrowseBtn.addEventListener(
        "click",
        () => {

            cartSection.classList.add(
                "hidden"
            );

            homeSection.classList.remove(
                "hidden"
            );

            scrollToProducts();

        }
    );

}


/* =====================================================
   CHECKOUT
===================================================== */

if (checkoutBtn) {

    checkoutBtn.addEventListener(
        "click",
        () => {

            if (
                !cart ||
                cart.length ===
                0
            ) {

                showToast(
                    "Your cart is empty."
                );

                return;

            }


            cartSection.classList.add(
                "hidden"
            );

            checkoutSection.classList.remove(
                "hidden"
            );


            updateCheckoutTotal();


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );

}


function updateCheckoutTotal() {

    const total =
        cart.reduce(
            (
                sum,
                item
            ) =>
                sum +
                Number(
                    item.price
                ) *
                Number(
                    item.quantity
                ),
            0
        );


    checkoutTotal.textContent =
        `₱${formatPrice(
            total
        )}`;

}


if (paymentMethod) {

    paymentMethod.addEventListener(
        "change",
        () => {

            if (
                paymentMethod.value ===
                "GCash"
            ) {

                gcashInfo.classList.remove(
                    "hidden"
                );

            } else {

                gcashInfo.classList.add(
                    "hidden"
                );

            }

        }
    );

}


/* =====================================================
   PLACE ORDER
===================================================== */

if (checkoutForm) {

    checkoutForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            if (
                !cart ||
                cart.length ===
                0
            ) {

                showToast(
                    "Your cart is empty."
                );

                return;

            }


            const {
                data: {
                    user
                }
            } =
                await supabaseClient
                    .auth
                    .getUser();


            const fullName =
                document
                    .getElementById(
                        "checkoutName"
                    )
                    .value
                    .trim();

            const phone =
                document
                    .getElementById(
                        "checkoutPhone"
                    )
                    .value
                    .trim();

            const address =
                document
                    .getElementById(
                        "checkoutAddress"
                    )
                    .value
                    .trim();

            const region =
                document
                    .getElementById(
                        "checkoutRegion"
                    )
                    .value;

            const payment =
                paymentMethod.value;


            const total =
                cart.reduce(
                    (
                        sum,
                        item
                    ) =>
                        sum +
                        Number(
                            item.price
                        ) *
                        Number(
                            item.quantity
                        ),
                    0
                );


            const orderNumber =
                "BB-" +
                Date.now()
                    .toString()
                    .slice(-8);


            /*
             * IMPORTANT:
             *
             * Kung wala ka pang orders table,
             * local success flow muna ito.
             *
             * Kapag may orders table ka na,
             * pwede natin i-save dito.
             */


            try {

                const {
                    error
                } =
                    await supabaseClient
                        .from("orders")
                        .insert({

                            user_id:
                                user?.id ||
                                null,

                            order_number:
                                orderNumber,

                            customer_name:
                                fullName,

                            phone:
                                phone,

                            address:
                                address,

                            region:
                                region,

                            payment_method:
                                payment,

                            total:
                                total,

                            status:
                                "Pending"

                        });


                if (error) {

                    /*
                     * Kung wala pang orders table,
                     * huwag pigilan ang checkout.
                     */

                    console.warn(
                        "Order table error:",
                        error.message
                    );

                }

            } catch (error) {

                console.warn(
                    "Order save skipped:",
                    error
                );

            }


            successOrderInfo.innerHTML = `

                <strong>
                    Order #: ${escapeHTML(
                        orderNumber
                    )}
                </strong>

                <br>

                Customer:
                ${escapeHTML(
                    fullName
                )}

                <br>

                Payment:
                ${escapeHTML(
                    payment
                )}

                <br>

                Total:
                <strong>
                    ₱${formatPrice(
                        total
                    )}
                </strong>

            `;


            cart = [];

            saveCart();

            checkoutForm.reset();

            gcashInfo.classList.add(
                "hidden"
            );


            checkoutSection.classList.add(
                "hidden"
            );

            successSection.classList.remove(
                "hidden"
            );


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );

}


/* =====================================================
   SUCCESS BUTTONS
===================================================== */

if (successBrowseBtn) {

    successBrowseBtn.addEventListener(
        "click",
        () => {

            successSection.classList.add(
                "hidden"
            );

            homeSection.classList.remove(
                "hidden"
            );

            renderCart();

            scrollToProducts();

        }
    );

}


if (successHomeBtn) {

    successHomeBtn.addEventListener(
        "click",
        () => {

            successSection.classList.add(
                "hidden"
            );

            homeSection.classList.remove(
                "hidden"
            );

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );

}


/* =====================================================
   ADMIN - ADD / EDIT PRODUCT
===================================================== */

if (productForm) {

    productForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const name =
                productNameInput
                    .value
                    .trim();

            const price =
                Number(
                    productPriceInput
                        .value
                );

            const image =
                productImageInput
                    .value
                    .trim();

            const region =
                productRegionInput
                    .value
                    .trim();

            const description =
                productDescriptionInput
                    .value
                    .trim();


            if (!name) {

                productMessage.textContent =
                    "Product name is required.";

                return;

            }


            if (
                !Number.isFinite(
                    price
                )
            ) {

                productMessage.textContent =
                    "Please enter a valid price.";

                return;

            }


            if (!region) {

                productMessage.textContent =
                    "Please select a region.";

                return;

            }


            productMessage.textContent =
                editingProductId
                    ? "Updating product..."
                    : "Adding product...";


            try {

                let error;


                if (
                    editingProductId
                ) {

                    const result =
                        await supabaseClient
                            .from(
                                "products"
                            )
                            .update({

                                name,

                                price,

                                image,

                                region,

                                description

                            })
                            .eq(
                                "id",
                                editingProductId
                            );


                    error =
                        result.error;

                } else {

                    const result =
                        await supabaseClient
                            .from(
                                "products"
                            )
                            .insert({

                                name,

                                price,

                                image,

                                region,

                                description

                            });


                    error =
                        result.error;

                }


                if (error) {
                    throw error;
                }


                productMessage.textContent =
                    editingProductId
                        ? "Product updated successfully!"
                        : "Product added successfully!";


                productForm.reset();

                editingProductId =
                    null;


                cancelEditBtn.classList.add(
                    "hidden"
                );


                productForm
                    .querySelector(
                        'button[type="submit"]'
                    )
                    .textContent =
                    "Add Product";


                await loadProducts();

                await loadAdminProducts();


                showToast(
                    "Product saved successfully."
                );


            } catch (error) {

                console.error(
                    "Product save error:",
                    error
                );


                productMessage.textContent =
                    "Failed to save product: " +
                    error.message;

            }

        }
    );

}


/* =====================================================
   LOAD ADMIN PRODUCTS
===================================================== */

async function loadAdminProducts() {

    if (
        !adminProductsContainer
    ) {
        return;
    }


    adminProductsContainer.innerHTML =
        "<p>Loading products...</p>";


    const {
        data: products,
        error
    } =
        await supabaseClient
            .from("products")
            .select("*")
            .order(
                "id",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(
            "Admin products error:",
            error
        );


        adminProductsContainer.innerHTML = `

            <p>
                Unable to load products.
                ${escapeHTML(
                    error.message
                )}
            </p>

        `;

        return;

    }


    adminProductsContainer.innerHTML = "";


    if (
        !products ||
        products.length ===
        0
    ) {

        adminProductsContainer.innerHTML = `

            <div class="no-products">

                <p>
                    No products available.
                </p>

            </div>

        `;

        return;

    }


    products.forEach(
        product => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "admin-product-item";


            const image =
                product.image ||
                "https://via.placeholder.com/100x100?text=Product";


            item.innerHTML = `

                <div
                    class="admin-product-left"
                >

                    <img
                        class="admin-product-image"
                        src="${escapeHTML(
                            image
                        )}"
                        alt="${escapeHTML(
                            product.name
                        )}"
                    >


                    <div
                        class="admin-product-info"
                    >

                        <h4>
                            ${escapeHTML(
                                product.name
                            )}
                        </h4>


                        <p>
                            ₱${formatPrice(
                                product.price
                            )}
                        </p>


                        <span
                            class="admin-product-region"
                        >
                            📍 ${escapeHTML(
                                product.region ||
                                "Bulacan"
                            )}
                        </span>

                    </div>

                </div>


                <div
                    class="admin-product-actions"
                >

                    <button
                        class="btn edit-btn"
                        data-admin-action="edit"
                        data-id="${product.id}"
                    >
                        Edit
                    </button>


                    <button
                        class="btn delete-btn"
                        data-admin-action="delete"
                        data-id="${product.id}"
                    >
                        Delete
                    </button>

                </div>

            `;


            adminProductsContainer.appendChild(
                item
            );

        }
    );

}


/* =====================================================
   ADMIN PRODUCT ACTIONS
===================================================== */

if (
    adminProductsContainer
) {

    adminProductsContainer.addEventListener(
        "click",
        async event => {

            const button =
                event.target.closest(
                    "button[data-admin-action]"
                );


            if (!button) {
                return;
            }


            const id =
                Number(
                    button.dataset.id
                );


            const action =
                button.dataset.adminAction;


            if (
                action ===
                "edit"
            ) {

                await editProduct(
                    id
                );

            }


            if (
                action ===
                "delete"
            ) {

                await deleteProduct(
                    id
                );

            }

        }
    );

}


/* =====================================================
   EDIT PRODUCT
===================================================== */

async function editProduct(
    id
) {

    const product =
        allProducts.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


    if (!product) {

        /*
         * If not in allProducts,
         * get directly from Supabase.
         */

        const {
            data,
            error
        } =
            await supabaseClient
                .from("products")
                .select("*")
                .eq(
                    "id",
                    id
                )
                .single();


        if (error) {

            alert(
                "Unable to load product: " +
                error.message
            );

            return;

        }


        editingProductId =
            data.id;

        fillEditForm(
            data
        );

        return;

    }


    editingProductId =
        product.id;


    fillEditForm(
        product
    );

}


function fillEditForm(
    product
) {

    productNameInput.value =
        product.name || "";


    productPriceInput.value =
        product.price || "";


    productImageInput.value =
        product.image || "";


    productRegionInput.value =
        product.region || "";


    productDescriptionInput.value =
        product.description || "";


    cancelEditBtn.classList.remove(
        "hidden"
    );


    productForm
        .querySelector(
            'button[type="submit"]'
        )
        .textContent =
        "Update Product";


    adminSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });


    productMessage.textContent =
        "Editing product...";

}


/* =====================================================
   CANCEL EDIT
===================================================== */

if (cancelEditBtn) {

    cancelEditBtn.addEventListener(
        "click",
        () => {

            editingProductId =
                null;

            productForm.reset();

            cancelEditBtn.classList.add(
                "hidden"
            );

            productForm
                .querySelector(
                    'button[type="submit"]'
                )
                .textContent =
                "Add Product";

            productMessage.textContent =
                "";

        }
    );

}


/* =====================================================
   DELETE PRODUCT
===================================================== */

async function deleteProduct(
    id
) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this product?"
        );


    if (!confirmed) {
        return;
    }


    const {
        error
    } =
        await supabaseClient
            .from("products")
            .delete()
            .eq(
                "id",
                id
            );


    if (error) {

        alert(
            "Failed to delete product: " +
            error.message
        );

        return;

    }


    showToast(
        "Product deleted successfully."
    );


    await loadProducts();

    await loadAdminProducts();

}


/* =====================================================
   PROFILE / ROLE SAFETY
===================================================== */

async function refreshAdminIfNeeded() {

    const {
        data: {
            user
        }
    } =
        await supabaseClient
            .auth
            .getUser();


    if (!user) {
        return;
    }


    const {
        data: profile
    } =
        await supabaseClient
            .from("profiles")
            .select("role")
            .eq(
                "id",
                user.id
            )
            .maybeSingle();


    if (
        profile?.role ===
        "admin"
    ) {

        adminSection.classList.remove(
            "hidden"
        );

        loadAdminProducts();

    } else {

        adminSection.classList.add(
            "hidden"
        );

    }

}


/* =====================================================
   AUTH STATE LISTENER
===================================================== */

supabaseClient.auth.onAuthStateChange(
    async (
        event,
        session
    ) => {

        if (session) {

            await loadUser();

        } else {

            showLoggedOut();

        }

    }
);


/* =====================================================
   INITIAL LOAD
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        renderCart();

        await loadProducts();

        await loadUser();

    }
);
