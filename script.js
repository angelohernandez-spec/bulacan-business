/* ==========================================
   BULACAN BUSINESS
   SUPABASE
   ========================================== */
const forgotPasswordBtn =
    document.getElementById("forgotPasswordBtn");

const SUPABASE_URL =
    "https://clnsyeilgralccihuodd.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_JQmMkq37U8OsNPo1AGG-mg_7PcEdiVp";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);


/* ==========================================
   ELEMENTS
   ========================================== */

const homeSection = document.getElementById("homeSection");
const authSection = document.getElementById("authSection");
const loginBox = document.getElementById("loginBox");
const signupBox = document.getElementById("signupBox");
const userSection = document.getElementById("userSection");
const adminSection = document.getElementById("adminSection");
const productsSection = document.getElementById("productsSection");
const cartSection = document.getElementById("cartSection");

const showLoginBtn = document.getElementById("showLoginBtn");
const showSignupBtn = document.getElementById("showSignupBtn");
const switchToSignup = document.getElementById("switchToSignup");
const switchToLogin = document.getElementById("switchToLogin");

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const logoutBtn = document.getElementById("logoutBtn");

const usernameDisplay =
    document.getElementById("usernameDisplay");

const loginMessage =
    document.getElementById("loginMessage");

const signupMessage =
    document.getElementById("signupMessage");

const productsContainer =
    document.getElementById("productsContainer");

const productForm =
    document.getElementById("productForm");

const productMessage =
    document.getElementById("productMessage");

const adminProductsContainer =
    document.getElementById("adminProductsContainer");

const cartItems =
    document.getElementById("cartItems");

const cartTotal =
    document.getElementById("cartTotal");

const checkoutForm =
    document.getElementById("checkoutForm");

const checkoutMessage =
    document.getElementById("checkoutMessage");


/* ==========================================
   CART
   ========================================== */

let cart = [];


/* ==========================================
   LOGIN / SIGNUP BUTTONS
   ========================================== */

showLoginBtn?.addEventListener("click", () => {

    authSection.classList.remove("hidden");
    homeSection.classList.add("hidden");

    loginBox.classList.remove("hidden");
    signupBox.classList.add("hidden");

});


showSignupBtn?.addEventListener("click", () => {

    authSection.classList.remove("hidden");
    homeSection.classList.add("hidden");

    loginBox.classList.add("hidden");
    signupBox.classList.remove("hidden");

});


switchToSignup?.addEventListener("click", () => {

    loginBox.classList.add("hidden");
    signupBox.classList.remove("hidden");

});


switchToLogin?.addEventListener("click", () => {

    signupBox.classList.add("hidden");
    loginBox.classList.remove("hidden");

});


/* ==========================================
   SIGN UP
   ========================================== */

signupForm?.addEventListener("submit", async (event) => {

    event.preventDefault();

    const username =
        document.getElementById("signupUsername").value.trim();

    const email =
        document.getElementById("signupEmail").value.trim();

    const password =
        document.getElementById("signupPassword").value;

    signupMessage.textContent = "Creating account...";

    try {

        const { data, error } =
            await supabaseClient.auth.signUp({
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

        /*
         * Create profile only when we receive a user.
         */

        if (data.user) {

            const { error: profileError } =
                await supabaseClient
                    .from("profiles")
                    .upsert({
                        id: data.user.id,
                        username: username,
                        role: "user"
                    });

            if (profileError) {
                console.error(
                    "Profile creation error:",
                    profileError
                );
            }
        }

        signupMessage.textContent =
            "Account created successfully.";

        signupForm.reset();

    } catch (error) {

        console.error("Signup error:", error);

        signupMessage.textContent =
            "Sign up failed: " + error.message;

    }

});


/* ==========================================
   LOGIN
   ========================================== */

loginForm?.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email =
        document.getElementById("loginEmail").value.trim();

    const password =
        document.getElementById("loginPassword").value;

    loginMessage.textContent = "Logging in...";

    try {

        const { data, error } =
            await supabaseClient.auth.signInWithPassword({
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

        console.error("Login error:", error);

        loginMessage.textContent =
            "Login failed: " + error.message;

    }

});
/* ==========================================
   FORGOT PASSWORD
   ========================================== */

forgotPasswordBtn?.addEventListener("click", async () => {

    const email =
        document.getElementById("loginEmail").value.trim();

    if (!email) {
        loginMessage.textContent =
            "Enter your email first.";
        return;
    }

    loginMessage.textContent =
        "Sending password reset email...";

    try {

        const { error } =
            await supabaseClient.auth.resetPasswordForEmail(
                email,
                {
                    redirectTo:
                        window.location.origin
                }
            );

        if (error) {
            throw error;
        }

        loginMessage.textContent =
            "Password reset email sent. Check your email.";

    } catch (error) {

        console.error("Password reset error:", error);

        loginMessage.textContent =
            "Password reset failed: " +
            error.message;

    }

});

/* ==========================================
   LOGOUT
   ========================================== */

logoutBtn?.addEventListener("click", async () => {

    const { error } =
        await supabaseClient.auth.signOut();

    if (error) {

        console.error(error);
        return;

    }

    cart = [];

    showLoggedOut();

});


/* ==========================================
   LOAD USER
   ========================================== */

async function loadUser() {

    const {
        data: { user }
    } = await supabaseClient.auth.getUser();

    if (!user) {

        showLoggedOut();
        return;

    }

    const {
        data: profile,
        error
    } = await supabaseClient
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

    if (error) {

        console.error(
            "Profile error:",
            error
        );

        showLoggedOut();
        return;

    }

    /*
     * If profile does not exist,
     * create a normal user profile.
     */

    if (!profile) {

        const username =
            user.user_metadata?.username ||
            user.email?.split("@")[0] ||
            "User";

        const { data: newProfile } =
            await supabaseClient
                .from("profiles")
                .insert({
                    id: user.id,
                    username: username,
                    role: "user"
                })
                .select()
                .single();

        showLoggedIn(
            newProfile || {
                username,
                role: "user"
            }
        );

        return;

    }

    showLoggedIn(profile);

}


/* ==========================================
   LOGGED OUT
   ========================================== */

function showLoggedOut() {

    homeSection.classList.remove("hidden");

    authSection.classList.add("hidden");
    userSection.classList.add("hidden");
    adminSection.classList.add("hidden");

    productsSection.classList.add("hidden");
    cartSection.classList.add("hidden");

    showLoginBtn.classList.remove("hidden");
    showSignupBtn.classList.remove("hidden");

    productsContainer.innerHTML = "";

    renderCart();

}


/* ==========================================
   LOGGED IN
   ========================================== */

function showLoggedIn(profile) {

    homeSection.classList.add("hidden");
    authSection.classList.add("hidden");

    userSection.classList.remove("hidden");

    productsSection.classList.remove("hidden");
    cartSection.classList.remove("hidden");

    showLoginBtn.classList.add("hidden");
    showSignupBtn.classList.add("hidden");

    usernameDisplay.textContent =
        profile.username || "User";

    if (profile.role === "admin") {

        adminSection.classList.remove("hidden");

        loadAdminProducts();

    } else {

        adminSection.classList.add("hidden");

    }

    loadProducts();
    renderCart();

}


/* ==========================================
   LOAD PRODUCTS
   ========================================== */

async function loadProducts() {

    productsContainer.innerHTML =
        "<p>Loading products...</p>";

    const {
        data: products,
        error
    } = await supabaseClient
        .from("products")
        .select("*")
        .order("id", {
            ascending: false
        });

    if (error) {

        console.error(
            "Products error:",
            error
        );

        productsContainer.innerHTML =
            "<p>Unable to load products.</p>";

        return;

    }

    if (!products || products.length === 0) {

        productsContainer.innerHTML =
            "<p>No products available.</p>";

        return;

    }

    productsContainer.innerHTML = "";

    products.forEach(product => {

        const card =
            document.createElement("div");

        card.className = "product-card";

        const image =
            product.image ||
            "https://via.placeholder.com/500x300?text=Product";

        card.innerHTML = `

            <img
                src="${escapeHTML(image)}"
                alt="${escapeHTML(product.name)}"
            >

            <div class="product-info">

                <h3>
                    ${escapeHTML(product.name)}
                </h3>

                <p class="product-price">
                    ₱${Number(product.price).toLocaleString(
                        "en-PH",
                        {
                            minimumFractionDigits: 2
                        }
                    )}
                </p>

                <p>
                    ${escapeHTML(
                        product.description || ""
                    )}
                </p>

                <button
                    class="btn full"
                    onclick="addToCart(${product.id})"
                >
                    🛒 Add to Cart
                </button>

            </div>
        `;

        productsContainer.appendChild(card);

    });

}


/* ==========================================
   ADD TO CART
   ========================================== */

async function addToCart(productId) {

    const {
        data: product,
        error
    } = await supabaseClient
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

    if (error || !product) {

        alert("Unable to add product.");

        return;

    }

    const existing =
        cart.find(item =>
            item.id === product.id
        );

    if (existing) {

        existing.quantity++;

    } else {

        cart.push({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            quantity: 1
        });

    }

    renderCart();

    cartSection.classList.remove("hidden");

    cartSection.scrollIntoView({
        behavior: "smooth"
    });

}


/* ==========================================
   REMOVE
   ========================================== */

function removeFromCart(productId) {

    cart =
        cart.filter(item =>
            item.id !== productId
        );

    renderCart();

}


/* ==========================================
   QUANTITY
   ========================================== */

function changeQuantity(productId, amount) {

    const item =
        cart.find(item =>
            item.id === productId
        );

    if (!item) {
        return;
    }

    item.quantity += amount;

    if (item.quantity <= 0) {

        removeFromCart(productId);
        return;

    }

    renderCart();

}


/* ==========================================
   RENDER CART
   ========================================== */

function renderCart() {

    if (!cartItems || !cartTotal) {
        return;
    }

    if (cart.length === 0) {

        cartItems.innerHTML =
            "<p>Your cart is empty.</p>";

        cartTotal.textContent =
            "₱0.00";

        return;

    }

    cartItems.innerHTML = "";

    let total = 0;

    cart.forEach(item => {

        const subtotal =
            item.price * item.quantity;

        total += subtotal;

        const div =
            document.createElement("div");

        div.className = "cart-item";

        div.innerHTML = `

            <div class="cart-item-info">

                <h3>
                    ${escapeHTML(item.name)}
                </h3>

                <p class="cart-item-price">
                    ₱${item.price.toLocaleString(
                        "en-PH",
                        {
                            minimumFractionDigits: 2
                        }
                    )}
                </p>

            </div>

            <div class="cart-quantity">

                <button
                    class="quantity-btn"
                    onclick="changeQuantity(
                        ${item.id},
                        -1
                    )"
                >
                    −
                </button>

                <strong>
                    ${item.quantity}
                </strong>

                <button
                    class="quantity-btn"
                    onclick="changeQuantity(
                        ${item.id},
                        1
                    )"
                >
                    +
                </button>

            </div>

            <strong>
                ₱${subtotal.toLocaleString(
                    "en-PH",
                    {
                        minimumFractionDigits: 2
                    }
                )}
            </strong>

            <button
                class="btn remove-cart-btn"
                onclick="removeFromCart(
                    ${item.id}
                )"
            >
                Remove
            </button>
        `;

        cartItems.appendChild(div);

    });

    cartTotal.textContent =
        "₱" +
        total.toLocaleString(
            "en-PH",
            {
                minimumFractionDigits: 2
            }
        );

}


/* ==========================================
   CHECKOUT / SAVE ORDER
   ========================================== */

checkoutForm?.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        checkoutMessage.textContent = "";

        if (cart.length === 0) {

            checkoutMessage.textContent =
                "Your cart is empty.";

            return;

        }

        const {
            data: { user }
        } = await supabaseClient.auth.getUser();

        if (!user) {

            checkoutMessage.textContent =
                "Please login before placing an order.";

            return;

        }

        const customerName =
            document.getElementById(
                "customerName"
            ).value.trim();

        const customerAddress =
            document.getElementById(
                "customerAddress"
            ).value.trim();

        const customerPhone =
            document.getElementById(
                "customerPhone"
            ).value.trim();

        const paymentMethod =
            document.getElementById(
                "paymentMethod"
            ).value;

        const total =
            cart.reduce(
                (sum, item) =>
                    sum +
                    item.price *
                    item.quantity,
                0
            );

        checkoutMessage.textContent =
            "Saving order...";

        try {

            /* CREATE ORDER */

            const {
                data: order,
                error: orderError
            } = await supabaseClient
                .from("orders")
                .insert({
                    user_id: user.id,

                    customer_name:
                        customerName,

                    customer_address:
                        customerAddress,

                    customer_phone:
                        customerPhone,

                    payment_method:
                        paymentMethod,

                    gcash_number:
                        paymentMethod === "GCash"
                            ? "09090661615"
                            : null,

                    total_amount:
                        total,

                    status:
                        "Pending"
                })
                .select()
                .single();

            if (orderError) {
                throw orderError;
            }


            /* CREATE ORDER ITEMS */

            const orderItems =
                cart.map(item => ({

                    order_id:
                        order.id,

                    product_id:
                        item.id,

                    product_name:
                        item.name,

                    price:
                        item.price,

                    quantity:
                        item.quantity,

                    subtotal:
                        item.price *
                        item.quantity

                }));


            const {
                error: itemsError
            } = await supabaseClient
                .from("order_items")
                .insert(orderItems);

            if (itemsError) {

                /*
                 * Remove order if items failed.
                 */

                await supabaseClient
                    .from("orders")
                    .delete()
                    .eq("id", order.id);

                throw itemsError;

            }


            /* SUCCESS */

            let message =
                "Order placed successfully! ";

            if (paymentMethod === "GCash") {

                message +=
                    "Please send ₱" +
                    total.toLocaleString(
                        "en-PH",
                        {
                            minimumFractionDigits: 2
                        }
                    ) +
                    " to GCash 09090661615.";

            } else if (
                paymentMethod ===
                "Cash on Delivery"
            ) {

                message +=
                    "Payment will be collected upon delivery.";

            }

            checkoutMessage.textContent =
                message;

            cart = [];

            renderCart();

            checkoutForm.reset();

        } catch (error) {

            console.error(
                "Order error:",
                error
            );

            checkoutMessage.textContent =
                "Order failed: " +
                error.message;

        }

    }
);


/* ==========================================
   ADMIN - ADD PRODUCT
   ========================================== */

productForm?.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        const name =
            document.getElementById(
                "productName"
            ).value.trim();

        const price =
            Number(
                document.getElementById(
                    "productPrice"
                ).value
            );

        const image =
            document.getElementById(
                "productImage"
            ).value.trim();

        const description =
            document.getElementById(
                "productDescription"
            ).value.trim();

        productMessage.textContent =
            "Adding product...";

        const { error } =
            await supabaseClient
                .from("products")
                .insert({
                    name,
                    price,
                    image,
                    description
                });

        if (error) {

            productMessage.textContent =
                "Failed: " +
                error.message;

            return;

        }

        productMessage.textContent =
            "Product added successfully!";

        productForm.reset();

        await loadProducts();
        await loadAdminProducts();

    }
);


/* ==========================================
   ADMIN PRODUCTS
   ========================================== */

async function loadAdminProducts() {

    const {
        data: products,
        error
    } = await supabaseClient
        .from("products")
        .select("*")
        .order("id", {
            ascending: false
        });

    if (error) {

        console.error(error);

        return;

    }

    adminProductsContainer.innerHTML = "";

    products.forEach(product => {

        const item =
            document.createElement("div");

        item.className =
            "admin-product-item";

        item.innerHTML = `

            <div>

                <strong>
                    ${escapeHTML(product.name)}
                </strong>

                <p>
                    ₱${Number(
                        product.price
                    ).toLocaleString(
                        "en-PH",
                        {
                            minimumFractionDigits: 2
                        }
                    )}
                </p>

            </div>

            <div class="admin-product-actions">

                <button
                    class="btn edit-btn"
                    onclick="editProduct(
                        ${product.id}
                    )"
                >
                    Edit
                </button>

                <button
                    class="btn delete-btn"
                    onclick="deleteProduct(
                        ${product.id}
                    )"
                >
                    Delete
                </button>

            </div>
        `;

        adminProductsContainer.appendChild(item);

    });

}


/* ==========================================
   EDIT PRODUCT
   ========================================== */

async function editProduct(id) {

    const name =
        prompt("New product name:");

    if (name === null) {
        return;
    }

    const price =
        prompt("New price:");

    if (price === null) {
        return;
    }

    const description =
        prompt("New description:");

    if (description === null) {
        return;
    }

    const { error } =
        await supabaseClient
            .from("products")
            .update({
                name,
                price: Number(price),
                description
            })
            .eq("id", id);

    if (error) {

        alert(
            "Update failed: " +
            error.message
        );

        return;

    }

    await loadProducts();
    await loadAdminProducts();

}


/* ==========================================
   DELETE PRODUCT
   ========================================== */

async function deleteProduct(id) {

    if (
        !confirm(
            "Delete this product?"
        )
    ) {
        return;
    }

    const { error } =
        await supabaseClient
            .from("products")
            .delete()
            .eq("id", id);

    if (error) {

        alert(
            "Delete failed: " +
            error.message
        );

        return;

    }

    await loadProducts();
    await loadAdminProducts();

}


/* ==========================================
   ESCAPE HTML
   ========================================== */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* ==========================================
   AUTH STATE
   ========================================== */

supabaseClient.auth.onAuthStateChange(
    async (event, session) => {

        if (session) {

            await loadUser();

        } else {

            showLoggedOut();

        }

    }
);


/* ==========================================
   START
   ========================================== */

loadUser();
