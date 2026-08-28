/* =====================================================
   BULACAN BUSINESS
   COMPLETE JAVASCRIPT
   SUPABASE
   ===================================================== */


/* =====================================================
   SUPABASE CONFIG
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

const resetPasswordSection =
    document.getElementById("resetPasswordSection");

const userSection =
    document.getElementById("userSection");

const regionSection =
    document.getElementById("regionSection");

const productsSection =
    document.getElementById("productsSection");

const cartSection =
    document.getElementById("cartSection");

const adminSection =
    document.getElementById("adminSection");

const orderSuccessSection =
    document.getElementById("orderSuccessSection");


const showLoginBtn =
    document.getElementById("showLoginBtn");

const showSignupBtn =
    document.getElementById("showSignupBtn");

const heroLoginBtn =
    document.getElementById("heroLoginBtn");

const heroSignupBtn =
    document.getElementById("heroSignupBtn");

const switchToSignup =
    document.getElementById("switchToSignup");

const switchToLogin =
    document.getElementById("switchToLogin");

const forgotPasswordBtn =
    document.getElementById("forgotPasswordBtn");

const logoutBtn =
    document.getElementById("logoutBtn");

const navLogoutBtn =
    document.getElementById("navLogoutBtn");

const shopNowBtn =
    document.getElementById("shopNowBtn");

const cartShopBtn =
    document.getElementById("cartShopBtn");

const continueShoppingBtn =
    document.getElementById(
        "continueShoppingBtn"
    );


const loginForm =
    document.getElementById("loginForm");

const signupForm =
    document.getElementById("signupForm");

const resetPasswordForm =
    document.getElementById(
        "resetPasswordForm"
    );

const checkoutForm =
    document.getElementById(
        "checkoutForm"
    );

const productForm =
    document.getElementById(
        "productForm"
    );


const loginMessage =
    document.getElementById(
        "loginMessage"
    );

const signupMessage =
    document.getElementById(
        "signupMessage"
    );

const resetPasswordMessage =
    document.getElementById(
        "resetPasswordMessage"
    );

const checkoutMessage =
    document.getElementById(
        "checkoutMessage"
    );

const productMessage =
    document.getElementById(
        "productMessage"
    );


const usernameDisplay =
    document.getElementById(
        "usernameDisplay"
    );

const navUsername =
    document.getElementById(
        "navUsername"
    );


const productsContainer =
    document.getElementById(
        "productsContainer"
    );

const selectedRegion =
    document.getElementById(
        "selectedRegion"
    );

const cartItems =
    document.getElementById(
        "cartItems"
    );

const cartSubtotal =
    document.getElementById(
        "cartSubtotal"
    );

const cartTotal =
    document.getElementById(
        "cartTotal"
    );

const deliveryFee =
    document.getElementById(
        "deliveryFee"
    );

const checkoutTotalPreview =
    document.getElementById(
        "checkoutTotalPreview"
    );

const gcashInfo =
    document.getElementById(
        "gcashInfo"
    );

const paymentMethod =
    document.getElementById(
        "paymentMethod"
    );

const cartEmpty =
    document.getElementById(
        "cartEmpty"
    );

const cartContent =
    document.getElementById(
        "cartContent"
    );


const adminProductsContainer =
    document.getElementById(
        "adminProductsContainer"
    );

const productFormTitle =
    document.getElementById(
        "productFormTitle"
    );

const productSubmitBtn =
    document.getElementById(
        "productSubmitBtn"
    );

const cancelEditBtn =
    document.getElementById(
        "cancelEditBtn"
    );

const editingProductId =
    document.getElementById(
        "editingProductId"
    );


const productModal =
    document.getElementById(
        "productModal"
    );

const productModalContent =
    document.getElementById(
        "productModalContent"
    );

const closeProductModal =
    document.getElementById(
        "closeProductModal"
    );

const productModalOverlay =
    document.getElementById(
        "productModalOverlay"
    );


const toast =
    document.getElementById(
        "toast"
    );

const toastMessage =
    document.getElementById(
        "toastMessage"
    );


const loggedUserArea =
    document.getElementById(
        "loggedUserArea"
    );


/* =====================================================
   VARIABLES
   ===================================================== */

let cart = [];

let currentUser = null;

let currentProfile = null;

let currentRegion = "All";

let productsCache = [];

let toastTimer = null;


/* =====================================================
   FORMAT MONEY
   ===================================================== */

function formatMoney(value) {

    return Number(value || 0)
        .toLocaleString(
            "en-PH",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

}


/* =====================================================
   ESCAPE HTML
   ===================================================== */

function escapeHTML(value) {

    if (value === null ||
        value === undefined) {

        return "";

    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =====================================================
   IMAGE
   ===================================================== */

function getProductImage(product) {

    return (
        product.image ||
        product.image_url ||
        "https://via.placeholder.com/700x500?text=Product"
    );

}


/* =====================================================
   TOAST
   ===================================================== */

function showToast(message) {

    if (!toast ||
        !toastMessage) {

        return;

    }

    toastMessage.textContent =
        message;

    toast.classList.remove(
        "hidden"
    );

    clearTimeout(toastTimer);

    toastTimer = setTimeout(
        () => {

            toast.classList.add(
                "hidden"
            );

        },
        3000
    );

}


/* =====================================================
   SHOW AUTH LOGIN
   ===================================================== */

function showLogin() {

    authSection.classList.remove(
        "hidden"
    );

    loginBox.classList.remove(
        "hidden"
    );

    signupBox.classList.add(
        "hidden"
    );

    resetPasswordSection.classList.add(
        "hidden"
    );

    homeSection.classList.add(
        "hidden"
    );

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =====================================================
   SHOW AUTH SIGNUP
   ===================================================== */

function showSignup() {

    authSection.classList.remove(
        "hidden"
    );

    loginBox.classList.add(
        "hidden"
    );

    signupBox.classList.remove(
        "hidden"
    );

    resetPasswordSection.classList.add(
        "hidden"
    );

    homeSection.classList.add(
        "hidden"
    );

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =====================================================
   AUTH BUTTONS
   ===================================================== */

showLoginBtn?.addEventListener(
    "click",
    showLogin
);

showSignupBtn?.addEventListener(
    "click",
    showSignup
);

heroLoginBtn?.addEventListener(
    "click",
    showLogin
);

heroSignupBtn?.addEventListener(
    "click",
    showSignup
);

switchToSignup?.addEventListener(
    "click",
    showSignup
);

switchToLogin?.addEventListener(
    "click",
    showLogin
);


/* =====================================================
   SIGN UP
   ===================================================== */

signupForm?.addEventListener(
    "submit",
    async function (event) {

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

        const confirmPassword =
            document
                .getElementById(
                    "signupConfirmPassword"
                )
                .value;


        if (password !== confirmPassword) {

            signupMessage.textContent =
                "Passwords do not match.";

            return;

        }


        if (password.length < 6) {

            signupMessage.textContent =
                "Password must be at least 6 characters.";

            return;

        }


        signupMessage.textContent =
            "Creating account...";


        try {

            const {
                data,
                error
            } =
                await supabaseClient.auth.signUp({

                    email,

                    password,

                    options: {

                        data: {
                            username: username
                        }

                    }

                });


            if (error) {

                throw error;

            }


            if (data.user) {

                const {
                    error: profileError
                } =
                    await supabaseClient
                        .from("profiles")
                        .upsert(
                            {
                                id:
                                    data.user.id,

                                username:
                                    username,

                                role:
                                    "user"
                            },
                            {
                                onConflict: "id"
                            }
                        );


                if (profileError) {

                    console.error(
                        "Profile error:",
                        profileError
                    );

                }

            }


            signupMessage.textContent =
                data.session
                    ? "Account created successfully! You are now logged in."
                    : "Account created! Check your email if email confirmation is enabled.";


            signupForm.reset();


            if (data.session) {

                await loadUser();

            } else {

                setTimeout(
                    showLogin,
                    1500
                );

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


/* =====================================================
   LOGIN
   ===================================================== */

loginForm?.addEventListener(
    "submit",
    async function (event) {

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
                data,
                error
            } =
                await supabaseClient.auth
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


/* =====================================================
   FORGOT PASSWORD
   ===================================================== */

forgotPasswordBtn?.addEventListener(
    "click",
    async function () {

        const email =
            document
                .getElementById(
                    "loginEmail"
                )
                .value
                .trim();


        if (!email) {

            loginMessage.textContent =
                "Enter your email first.";

            return;

        }


        loginMessage.textContent =
            "Sending password reset email...";


        try {

            const redirectUrl =
                window.location.origin +
                window.location.pathname;


            const {
                error
            } =
                await supabaseClient.auth
                    .resetPasswordForEmail(
                        email,
                        {
                            redirectTo:
                                redirectUrl
                        }
                    );


            if (error) {

                throw error;

            }


            loginMessage.textContent =
                "Password reset email sent. Check your email.";

        } catch (error) {

            console.error(
                "Forgot password error:",
                error
            );

            loginMessage.textContent =
                "Password reset failed: " +
                error.message;

        }

    }
);


/* =====================================================
   RESET PASSWORD
   ===================================================== */

resetPasswordForm?.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const password =
            document
                .getElementById(
                    "newPassword"
                )
                .value;

        const confirmPassword =
            document
                .getElementById(
                    "confirmPassword"
                )
                .value;


        if (password !== confirmPassword) {

            resetPasswordMessage.textContent =
                "Passwords do not match.";

            return;

        }


        resetPasswordMessage.textContent =
            "Updating password...";


        try {

            const {
                error
            } =
                await supabaseClient.auth
                    .updateUser(
                        {
                            password:
                                password
                        }
                    );


            if (error) {

                throw error;

            }


            resetPasswordMessage.textContent =
                "Password changed successfully!";


            resetPasswordForm.reset();


            setTimeout(
                () => {

                    resetPasswordSection
                        .classList
                        .add(
                            "hidden"
                        );

                    showLogin();

                    loginMessage.textContent =
                        "You can now login with your new password.";

                },
                1800
            );


        } catch (error) {

            console.error(
                "Password update error:",
                error
            );

            resetPasswordMessage.textContent =
                "Password update failed: " +
                error.message;

        }

    }
);


/* =====================================================
   AUTH STATE
   ===================================================== */

supabaseClient.auth.onAuthStateChange(
    async function (event, session) {

        if (event === "PASSWORD_RECOVERY") {

            homeSection.classList.add(
                "hidden"
            );

            authSection.classList.add(
                "hidden"
            );

            userSection.classList.add(
                "hidden"
            );

            regionSection.classList.add(
                "hidden"
            );

            productsSection.classList.add(
                "hidden"
            );

            cartSection.classList.add(
                "hidden"
            );

            adminSection.classList.add(
                "hidden"
            );

            resetPasswordSection.classList.remove(
                "hidden"
            );

            return;

        }


        if (session?.user) {

            await loadUser();

        } else {

            showLoggedOut();

        }

    }
);


/* =====================================================
   LOAD USER
   ===================================================== */

async function loadUser() {

    const {
        data,
        error
    } =
        await supabaseClient.auth.getUser();


    if (error ||
        !data?.user) {

        showLoggedOut();

        return;

    }


    currentUser =
        data.user;


    const {
        data: profile,
        error: profileError
    } =
        await supabaseClient
            .from("profiles")
            .select("*")
            .eq(
                "id",
                currentUser.id
            )
            .maybeSingle();


    if (profileError) {

        console.error(
            "Profile load error:",
            profileError
        );

        /*
         * Still allow the authenticated
         * user to use the website.
         */

        currentProfile = {

            id:
                currentUser.id,

            username:
                currentUser
                    .user_metadata
                    ?.username ||
                currentUser
                    .email
                    ?.split("@")[0] ||
                "User",

            role:
                "user"

        };

    } else if (!profile) {

        const username =
            currentUser
                .user_metadata
                ?.username ||
            currentUser
                .email
                ?.split("@")[0] ||
            "User";


        const {
            data: newProfile,
            error: insertError
        } =
            await supabaseClient
                .from("profiles")
                .insert(
                    {
                        id:
                            currentUser.id,

                        username:
                            username,

                        role:
                            "user"
                    }
                )
                .select()
                .maybeSingle();


        if (insertError) {

            console.error(
                "Create profile error:",
                insertError
            );

        }


        currentProfile =
            newProfile || {

                id:
                    currentUser.id,

                username:
                    username,

                role:
                    "user"

            };

    } else {

        currentProfile =
            profile;

    }


    showLoggedIn(
        currentProfile
    );

}


/* =====================================================
   SHOW LOGGED OUT
   ===================================================== */

function showLoggedOut() {

    currentUser = null;

    currentProfile = null;

    cart = [];

    homeSection.classList.remove(
        "hidden"
    );

    authSection.classList.add(
        "hidden"
    );

    resetPasswordSection.classList.add(
        "hidden"
    );

    userSection.classList.add(
        "hidden"
    );

    regionSection.classList.add(
        "hidden"
    );

    productsSection.classList.add(
        "hidden"
    );

    cartSection.classList.add(
        "hidden"
    );

    adminSection.classList.add(
        "hidden"
    );

    orderSuccessSection.classList.add(
        "hidden"
    );


    showLoginBtn?.classList.remove(
        "hidden"
    );

    showSignupBtn?.classList.remove(
        "hidden"
    );

    loggedUserArea?.classList.add(
        "hidden"
    );


    productsContainer.innerHTML = "";

    renderCart();

}


/* =====================================================
   SHOW LOGGED IN
   ===================================================== */

function showLoggedIn(profile) {

    homeSection.classList.add(
        "hidden"
    );

    authSection.classList.add(
        "hidden"
    );

    resetPasswordSection.classList.add(
        "hidden"
    );

    orderSuccessSection.classList.add(
        "hidden"
    );


    userSection.classList.remove(
        "hidden"
    );

    regionSection.classList.remove(
        "hidden"
    );

    productsSection.classList.remove(
        "hidden"
    );


    showLoginBtn?.classList.add(
        "hidden"
    );

    showSignupBtn?.classList.add(
        "hidden"
    );

    loggedUserArea?.classList.remove(
        "hidden"
    );


    const username =
        profile?.username ||
        currentUser
            ?.email
            ?.split("@")[0] ||
        "User";


    usernameDisplay.textContent =
        username;

    navUsername.textContent =
        username;


    if (
        profile?.role === "admin"
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


    loadProducts(
        currentRegion
    );

    renderCart();

}


/* =====================================================
   LOGOUT
   ===================================================== */

async function logout() {

    const {
        error
    } =
        await supabaseClient.auth
            .signOut();


    if (error) {

        console.error(
            "Logout error:",
            error
        );

        showToast(
            "Unable to logout."
        );

        return;

    }


    showToast(
        "Logged out successfully."
    );


    setTimeout(
        showLoggedOut,
        500
    );

}


logoutBtn?.addEventListener(
    "click",
    logout
);

navLogoutBtn?.addEventListener(
    "click",
    logout
);


/* =====================================================
   SHOP NOW
   ===================================================== */

shopNowBtn?.addEventListener(
    "click",
    function () {

        regionSection.scrollIntoView({
            behavior: "smooth"
        });

    }
);

cartShopBtn?.addEventListener(
    "click",
    function () {

        productsSection.scrollIntoView({
            behavior: "smooth"
        });

    }
);


/* =====================================================
   REGION FILTER
   ===================================================== */

document
    .querySelectorAll(
        ".region-card"
    )
    .forEach(
        function (card) {

            card.addEventListener(
                "click",
                function () {

                    document
                        .querySelectorAll(
                            ".region-card"
                        )
                        .forEach(
                            item =>
                                item.classList
                                    .remove(
                                        "active"
                                    )
                        );


                    card.classList.add(
                        "active"
                    );


                    currentRegion =
                        card.dataset.region ||
                        "All";


                    loadProducts(
                        currentRegion
                    );


                    productsSection.scrollIntoView({
                        behavior:
                            "smooth"
                    });

                }
            );

        }
    );


/* =====================================================
   LOAD PRODUCTS
   ===================================================== */

async function loadProducts(
    region = "All"
) {

    if (!currentUser) {

        return;

    }


    productsContainer.innerHTML =
        `
        <div class="no-products">
            Loading products...
        </div>
        `;


    let query =
        supabaseClient
            .from("products")
            .select("*")
            .order(
                "id",
                {
                    ascending:
                        false
                }
            );


    if (
        region &&
        region !== "All"
    ) {

        query =
            query.eq(
                "region",
                region
            );

    }


    const {
        data,
        error
    } =
        await query;


    if (error) {

        console.error(
            "Products error:",
            error
        );

        productsContainer.innerHTML =
            `
            <div class="no-products">
                Unable to load products.
                <br>
                ${escapeHTML(
                    error.message
                )}
            </div>
            `;

        return;

    }


    productsCache =
        data || [];


    selectedRegion.textContent =
        region === "All"
            ? "All Products"
            : `Products from ${region}`;


    if (
        !data ||
        data.length === 0
    ) {

        productsContainer.innerHTML =
            `
            <div class="no-products">
                <h3>No products found.</h3>
                <p>
                    There are currently no products
                    in this region.
                </p>
            </div>
            `;

        return;

    }


    productsContainer.innerHTML =
        "";


    data.forEach(
        function (product) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "product-card";


            const image =
                getProductImage(
                    product
                );


            const productInCart =
                cart.find(
                    item =>
                        item.id ===
                        product.id
                );


            card.innerHTML =
                `

                <div
                    class="product-image-wrapper"
                >

                    <img
                        src="${escapeHTML(image)}"
                        alt="${escapeHTML(product.name)}"
                        onerror="this.src='https://via.placeholder.com/700x500?text=Product'"
                    >

                    <span
                        class="product-region-badge"
                    >
                        📍 ${escapeHTML(
                            product.region ||
                            "Philippines"
                        )}
                    </span>

                </div>


                <div class="product-info">

                    <h3>
                        ${escapeHTML(
                            product.name
                        )}
                    </h3>


                    <div
                        class="product-price"
                    >
                        ₱${formatMoney(
                            product.price
                        )}
                    </div>


                    <p
                        class="product-description"
                    >
                        ${escapeHTML(
                            product.description ||
                            "No description available."
                        )}
                    </p>


                    <div
                        class="product-actions"
                    >

                        <button
                            class="btn"
                            type="button"
                            data-action="add"
                        >
                            ${
                                productInCart
                                    ? "✓ In Cart"
                                    : "🛒 Add to Cart"
                            }
                        </button>


                        ${
                            productInCart
                                ? `
                                <button
                                    class="btn remove-product-btn"
                                    type="button"
                                    data-action="remove"
                                >
                                    Remove
                                </button>
                                `
                                : ""
                        }

                    </div>

                </div>

                `;


            /*
             * Clicking the product itself
             * opens product details.
             */

            card.addEventListener(
                "click",
                function (event) {

                    if (
                        event.target.closest(
                            "button"
                        )
                    ) {

                        return;

                    }

                    openProductModal(
                        product
                    );

                }
            );


            const addButton =
                card.querySelector(
                    '[data-action="add"]'
                );


            addButton?.addEventListener(
                "click",
                function (event) {

                    event.stopPropagation();

                    addToCart(
                        product
                    );

                }
            );


            const removeButton =
                card.querySelector(
                    '[data-action="remove"]'
                );


            removeButton?.addEventListener(
                "click",
                function (event) {

                    event.stopPropagation();

                    removeFromCart(
                        product.id
                    );

                }
            );


            productsContainer.appendChild(
                card
            );

        }
    );

}


/* =====================================================
   PRODUCT MODAL
   ===================================================== */

function openProductModal(
    product
) {

    const image =
        getProductImage(
            product
        );


    const inCart =
        cart.find(
            item =>
                item.id ===
                product.id
        );


    productModalContent.innerHTML =
        `

        <img
            class="modal-product-image"
            src="${escapeHTML(image)}"
            alt="${escapeHTML(product.name)}"
            onerror="this.src='https://via.placeholder.com/700x500?text=Product'"
        >


        <div class="modal-product-info">

            <span class="product-region-badge">
                📍 ${escapeHTML(
                    product.region ||
                    "Philippines"
                )}
            </span>


            <h2>
                ${escapeHTML(
                    product.name
                )}
            </h2>


            <div
                class="modal-product-price"
            >
                ₱${formatMoney(
                    product.price
                )}
            </div>


            <p
                class="modal-product-description"
            >
                ${escapeHTML(
                    product.description ||
                    "No description available."
                )}
            </p>


            <div class="product-actions">

                <button
                    id="modalAddBtn"
                    class="btn"
                    type="button"
                >
                    ${
                        inCart
                            ? "✓ Add Another"
                            : "🛒 Add to Cart"
                    }
                </button>


                ${
                    inCart
                        ? `
                        <button
                            id="modalRemoveBtn"
                            class="btn remove-product-btn"
                            type="button"
                        >
                            Remove from Cart
                        </button>
                        `
                        : ""
                }

            </div>

        </div>

        `;


    productModal.classList.remove(
        "hidden"
    );


    document
        .getElementById(
            "modalAddBtn"
        )
        ?.addEventListener(
            "click",
            function () {

                addToCart(
                    product
                );

                openProductModal(
                    product
                );

            }
        );


    document
        .getElementById(
            "modalRemoveBtn"
        )
        ?.addEventListener(
            "click",
            function () {

                removeFromCart(
                    product.id
                );

                openProductModal(
                    product
                );

            }
        );

}


function closeModal() {

    productModal.classList.add(
        "hidden"
    );

}


closeProductModal?.addEventListener(
    "click",
    closeModal
);

productModalOverlay?.addEventListener(
    "click",
    closeModal
);


/* =====================================================
   ADD TO CART
   ===================================================== */

function addToCart(
    product
) {

    if (!currentUser) {

        showLogin();

        loginMessage.textContent =
            "Please login before ordering.";

        return;

    }


    const existing =
        cart.find(
            item =>
                item.id ===
                product.id
        );


    if (existing) {

        existing.quantity += 1;

    } else {

        cart.push(
            {
                id:
                    product.id,

                name:
                    product.name,

                price:
                    Number(
                        product.price
                    ),

                image:
                    getProductImage(
                        product
                    ),

                region:
                    product.region,

                quantity:
                    1
            }
        );

    }


    renderCart();

    showToast(
        `${product.name} added to cart.`
    );


    loadProducts(
        currentRegion
    );


    cartSection.classList.remove(
        "hidden"
    );


    cartSection.scrollIntoView({
        behavior:
            "smooth"
    });

}


/* =====================================================
   REMOVE FROM CART
   ===================================================== */

function removeFromCart(
    productId
) {

    cart =
        cart.filter(
            item =>
                item.id !==
                productId
        );


    renderCart();

    loadProducts(
        currentRegion
    );

    showToast(
        "Product removed from cart."
    );

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
                product.id ===
                productId
        );


    if (!item) {

        return;

    }


    item.quantity +=
        amount;


    if (
        item.quantity <= 0
    ) {

        removeFromCart(
            productId
        );

        return;

    }


    renderCart();

}


/* =====================================================
   CART TOTAL
   ===================================================== */

function getCartSubtotal() {

    return cart.reduce(
        (
            total,
            item
        ) => {

            return total +
                (
                    Number(
                        item.price
                    ) *
                    Number(
                        item.quantity
                    )
                );

        },
        0
    );

}


function getDeliveryFee() {

    /*
     * Free delivery for now.
     */

    return cart.length > 0
        ? 0
        : 0;

}


function getCartTotal() {

    return (
        getCartSubtotal() +
        getDeliveryFee()
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
        !currentUser
    ) {

        cartSection.classList.add(
            "hidden"
        );

        return;

    }


    if (
        cart.length === 0
    ) {

        cartEmpty.classList.remove(
            "hidden"
        );

        cartContent.classList.add(
            "hidden"
        );

        cartItems.innerHTML =
            "";

        cartSubtotal.textContent =
            "₱0.00";

        deliveryFee.textContent =
            "₱0.00";

        cartTotal.textContent =
            "₱0.00";

        checkoutTotalPreview.textContent =
            "Total: ₱0.00";

        return;

    }


    cartEmpty.classList.add(
        "hidden"
    );

    cartContent.classList.remove(
        "hidden"
    );


    cartItems.innerHTML =
        "";


    cart.forEach(
        function (item) {

            const itemTotal =
                Number(item.price) *
                Number(item.quantity);


            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "cart-item";


            row.innerHTML =
                `

                <img
                    class="cart-item-image"
                    src="${escapeHTML(item.image)}"
                    alt="${escapeHTML(item.name)}"
                >


                <div class="cart-item-info">

                    <h3>
                        ${escapeHTML(
                            item.name
                        )}
                    </h3>

                    <p>
                        ₱${formatMoney(
                            item.price
                        )}
                    </p>

                </div>


                <div
                    class="quantity-controls"
                >

                    <button
                        class="quantity-btn"
                        type="button"
                        data-action="minus"
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
                        type="button"
                        data-action="plus"
                    >
                        +
                    </button>

                </div>


                <div
                    class="cart-item-total"
                >
                    ₱${formatMoney(
                        itemTotal
                    )}
                </div>


                <button
                    class="remove-cart-btn"
                    type="button"
                    data-action="remove"
                >
                    🗑️ Remove
                </button>

                `;


            row.querySelector(
                '[data-action="minus"]'
            )?.addEventListener(
                "click",
                function () {

                    changeQuantity(
                        item.id,
                        -1
                    );

                }
            );


            row.querySelector(
                '[data-action="plus"]'
            )?.addEventListener(
                "click",
                function () {

                    changeQuantity(
                        item.id,
                        1
                    );

                }
            );


            row.querySelector(
                '[data-action="remove"]'
            )?.addEventListener(
                "click",
                function () {

                    removeFromCart(
                        item.id
                    );

                }
            );


            cartItems.appendChild(
                row
            );

        }
    );


    const subtotal =
        getCartSubtotal();

    const delivery =
        getDeliveryFee();

    const total =
        subtotal +
        delivery;


    cartSubtotal.textContent =
        "₱" +
        formatMoney(
            subtotal
        );

    deliveryFee.textContent =
        delivery === 0
            ? "FREE"
            : "₱" +
              formatMoney(
                  delivery
              );

    cartTotal.textContent =
        "₱" +
        formatMoney(
            total
        );

    checkoutTotalPreview.textContent =
        "Total: ₱" +
        formatMoney(
            total
        );


    cartSection.classList.remove(
        "hidden"
    );

}


/* =====================================================
   PAYMENT METHOD
   ===================================================== */

paymentMethod?.addEventListener(
    "change",
    function () {

        if (
            this.value ===
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


/* =====================================================
   CHECKOUT
   ===================================================== */

checkoutForm?.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        if (!currentUser) {

            showLogin();

            return;

        }


        if (
            cart.length === 0
        ) {

            checkoutMessage.textContent =
                "Your cart is empty.";

            return;

        }


        const customerName =
            document
                .getElementById(
                    "customerName"
                )
                .value
                .trim();


        const customerPhone =
            document
                .getElementById(
                    "customerPhone"
                )
                .value
                .trim();


        const customerAddress =
            document
                .getElementById(
                    "customerAddress"
                )
                .value
                .trim();


        const selectedPayment =
            paymentMethod.value;


        if (!selectedPayment) {

            checkoutMessage.textContent =
                "Please select a payment method.";

            return;

        }


        const subtotal =
            getCartSubtotal();

        const delivery =
            getDeliveryFee();

        const total =
            subtotal +
            delivery;


        checkoutMessage.textContent =
            "Submitting your order...";


        /*
         * Prepare order data.
         */

        const orderData = {

            user_id:
                currentUser.id,

            customer_name:
                customerName,

            customer_phone:
                customerPhone,

            delivery_address:
                customerAddress,

            payment_method:
                selectedPayment,

            total_amount:
                total,

            status:
                "Pending",

            items:
                cart.map(
                    item => ({
                        product_id:
                            item.id,

                        name:
                            item.name,

                        price:
                            item.price,

                        quantity:
                            item.quantity,

                        subtotal:
                            item.price *
                            item.quantity
                    })
                )

        };


        try {

            /*
             * Save order to Supabase.
             */

            const {
                error
            } =
                await supabaseClient
                    .from("orders")
                    .insert(
                        orderData
                    );


            if (error) {

                throw error;

            }


            checkoutForm.reset();

            gcashInfo.classList.add(
                "hidden"
            );


            cart = [];

            renderCart();


            productsSection.classList.add(
                "hidden"
            );

            regionSection.classList.add(
                "hidden"
            );

            cartSection.classList.add(
                "hidden"
            );

            userSection.classList.add(
                "hidden"
            );

            adminSection.classList.add(
                "hidden"
            );


            orderSuccessSection.classList.remove(
                "hidden"
            );


            orderSuccessSection.scrollIntoView({
                behavior:
                    "smooth"
            });


            checkoutMessage.textContent =
                "";


        } catch (error) {

            console.error(
                "Order error:",
                error
            );


            /*
             * If orders table/schema
             * is not yet configured,
             * show the actual Supabase error.
             */

            checkoutMessage.textContent =
                "Order failed: " +
                error.message;

        }

    }
);


/* =====================================================
   CONTINUE SHOPPING
   ===================================================== */

continueShoppingBtn?.addEventListener(
    "click",
    function () {

        orderSuccessSection.classList.add(
            "hidden"
        );

        userSection.classList.remove(
            "hidden"
        );

        regionSection.classList.remove(
            "hidden"
        );

        productsSection.classList.remove(
            "hidden"
        );

        currentRegion = "All";


        document
            .querySelectorAll(
                ".region-card"
            )
            .forEach(
                card =>
                    card.classList.remove(
                        "active"
                    )
            );


        document
            .querySelector(
                '.region-card[data-region="All"]'
            )
            ?.classList.add(
                "active"
            );


        loadProducts(
            "All"
        );

        regionSection.scrollIntoView({
            behavior:
                "smooth"
        });

    }
);


/* =====================================================
   ADMIN PRODUCT FORM
   ===================================================== */

productForm?.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        if (
            !currentProfile ||
            currentProfile.role !==
                "admin"
        ) {

            productMessage.textContent =
                "Admin access required.";

            return;

        }


        const name =
            document
                .getElementById(
                    "productName"
                )
                .value
                .trim();


        const price =
            Number(
                document
                    .getElementById(
                        "productPrice"
                    )
                    .value
            );


        const region =
            document
                .getElementById(
                    "productRegion"
                )
                .value;


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


        const editId =
            editingProductId.value;


        if (!name ||
            !region ||
            price < 0) {

            productMessage.textContent =
                "Please complete the product information.";

            return;

        }


        productMessage.textContent =
            editId
                ? "Updating product..."
                : "Adding product...";


        try {

            if (editId) {

                const {
                    error
                } =
                    await supabaseClient
                        .from("products")
                        .update(
                            {
                                name:
                                    name,

                                price:
                                    price,

                                region:
                                    region,

                                image:
                                    image,

                                description:
                                    description
                            }
                        )
                        .eq(
                            "id",
                            editId
                        );


                if (error) {

                    throw error;

                }


                productMessage.textContent =
                    "Product updated successfully.";

                showToast(
                    "Product updated."
                );

            } else {

                const {
                    error
                } =
                    await supabaseClient
                        .from("products")
                        .insert(
                            {
                                name:
                                    name,

                                price:
                                    price,

                                region:
                                    region,

                                image:
                                    image,

                                description:
                                    description
                            }
                        );


                if (error) {

                    throw error;

                }


                productMessage.textContent =
                    "Product added successfully.";

                showToast(
                    "Product added."
                );

            }


            resetProductForm();


            await loadAdminProducts();

            await loadProducts(
                currentRegion
            );


        } catch (error) {

            console.error(
                "Product save error:",
                error
            );

            productMessage.textContent =
                "Product save failed: " +
                error.message;

        }

    }
);


/* =====================================================
   LOAD ADMIN PRODUCTS
   ===================================================== */

async function loadAdminProducts() {

    if (
        !currentProfile ||
        currentProfile.role !==
            "admin"
    ) {

        return;

    }


    adminProductsContainer.innerHTML =
        `
        <div class="no-products">
            Loading products...
        </div>
        `;


    const {
        data,
        error
    } =
        await supabaseClient
            .from("products")
            .select("*")
            .order(
                "id",
                {
                    ascending:
                        false
                }
            );


    if (error) {

        console.error(
            "Admin products error:",
            error
        );

        adminProductsContainer.innerHTML =
            `
            <div class="no-products">
                ${escapeHTML(
                    error.message
                )}
            </div>
            `;

        return;

    }


    if (
        !data ||
        data.length === 0
    ) {

        adminProductsContainer.innerHTML =
            `
            <div class="no-products">
                <h3>No products yet.</h3>
                <p>
                    Add your first product above.
                </p>
            </div>
            `;

        return;

    }


    adminProductsContainer.innerHTML =
        "";


    data.forEach(
        function (product) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "admin-product-item";


            item.innerHTML =
                `

                <div
                    class="admin-product-left"
                >

                    <img
                        class="admin-product-image"
                        src="${escapeHTML(
                            getProductImage(
                                product
                            )
                        )}"
                        alt="${escapeHTML(
                            product.name
                        )}"
                        onerror="this.src='https://via.placeholder.com/200x150?text=Product'"
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
                            ₱${formatMoney(
                                product.price
                            )}
                        </p>

                        <span
                            class="admin-product-region"
                        >
                            📍 ${escapeHTML(
                                product.region ||
                                "No region"
                            )}
                        </span>

                    </div>

                </div>


                <div
                    class="admin-product-actions"
                >

                    <button
                        class="btn edit-btn"
                        type="button"
                        data-action="edit"
                    >
                        ✏️ Edit
                    </button>


                    <button
                        class="btn delete-btn"
                        type="button"
                        data-action="delete"
                    >
                        🗑️ Delete
                    </button>

                </div>

                `;


            item.querySelector(
                '[data-action="edit"]'
            )?.addEventListener(
                "click",
                function () {

                    editProduct(
                        product
                    );

                }
            );


            item.querySelector(
                '[data-action="delete"]'
            )?.addEventListener(
                "click",
                function () {

                    deleteProduct(
                        product.id
                    );

                }
            );


            adminProductsContainer.appendChild(
                item
            );

        }
    );

}


/* =====================================================
   EDIT PRODUCT
   ===================================================== */

function editProduct(
    product
) {

    editingProductId.value =
        product.id;


    document
        .getElementById(
            "productName"
        )
        .value =
        product.name || "";


    document
        .getElementById(
            "productPrice"
        )
        .value =
        product.price || 0;


    document
        .getElementById(
            "productRegion"
        )
        .value =
        product.region || "";


    document
        .getElementById(
            "productImage"
        )
        .value =
        product.image || "";


    document
        .getElementById(
            "productDescription"
        )
        .value =
        product.description || "";


    productFormTitle.textContent =
        "✏️ Edit Product";


    productSubmitBtn.textContent =
        "💾 Save Changes";


    cancelEditBtn.classList.remove(
        "hidden"
    );


    adminSection.scrollIntoView({
        behavior:
            "smooth"
    });

}


/* =====================================================
   RESET PRODUCT FORM
   ===================================================== */

function resetProductForm() {

    productForm.reset();

    editingProductId.value =
        "";


    productFormTitle.textContent =
        "➕ Add Product";


    productSubmitBtn.textContent =
        "➕ Add Product";


    cancelEditBtn.classList.add(
        "hidden"
    );

}


cancelEditBtn?.addEventListener(
    "click",
    resetProductForm
);


/* =====================================================
   DELETE PRODUCT
   ===================================================== */

async function deleteProduct(
    productId
) {

    if (
        !currentProfile ||
        currentProfile.role !==
            "admin"
    ) {

        return;

    }


    const confirmed =
        window.confirm(
            "Are you sure you want to delete this product?"
        );


    if (!confirmed) {

        return;

    }


    try {

        const {
            error
        } =
            await supabaseClient
                .from("products")
                .delete()
                .eq(
                    "id",
                    productId
                );


        if (error) {

            throw error;

        }


        showToast(
            "Product deleted."
        );


        await loadAdminProducts();

        await loadProducts(
            currentRegion
        );


    } catch (error) {

        console.error(
            "Delete product error:",
            error
        );

        showToast(
            "Delete failed: " +
            error.message
        );

    }

}


/* =====================================================
   PASSWORD SHOW/HIDE
   ===================================================== */

document
    .querySelectorAll(
        ".password-toggle"
    )
    .forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

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

                        input.type =
                            "text";

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

        }
    );


/* =====================================================
   INITIAL LOAD
   ===================================================== */

async function initialize() {

    try {

        const {
            data
        } =
            await supabaseClient.auth
                .getSession();


        if (
            data?.session
        ) {

            await loadUser();

        } else {

            showLoggedOut();

        }

    } catch (error) {

        console.error(
            "Initialization error:",
            error
        );

        showLoggedOut();

    }

}


initialize();
