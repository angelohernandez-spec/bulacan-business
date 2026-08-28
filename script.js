/* ==========================================
   BULACAN BUSINESS - SUPABASE CONNECTION
   ========================================== */
const productsSection =
    document.getElementById("productsSection");

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

const productForm =
    document.getElementById("productForm");

const productMessage =
    document.getElementById("productMessage");

const productsContainer =
    document.getElementById("productsContainer");

const adminProductsContainer =
    document.getElementById("adminProductsContainer");

const cartSection =
    document.getElementById("cartSection");

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
   SHOW LOGIN
   ========================================== */

if (showLoginBtn) {

    showLoginBtn.addEventListener("click", () => {

        authSection.classList.remove("hidden");

        loginBox.classList.remove("hidden");
        signupBox.classList.add("hidden");

        homeSection.classList.add("hidden");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}


/* ==========================================
   SHOW SIGN UP
   ========================================== */

if (showSignupBtn) {

    showSignupBtn.addEventListener("click", () => {

        authSection.classList.remove("hidden");

        loginBox.classList.add("hidden");
        signupBox.classList.remove("hidden");

        homeSection.classList.add("hidden");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}


/* ==========================================
   SWITCH LOGIN / SIGNUP
   ========================================== */

if (switchToSignup) {

    switchToSignup.addEventListener("click", () => {

        loginBox.classList.add("hidden");
        signupBox.classList.remove("hidden");

        loginMessage.textContent = "";

    });

}


if (switchToLogin) {

    switchToLogin.addEventListener("click", () => {

        signupBox.classList.add("hidden");
        loginBox.classList.remove("hidden");

        signupMessage.textContent = "";

    });

}


/* ==========================================
   SIGN UP
   ========================================== */

if (signupForm) {

    signupForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const username =
            document.getElementById("signupUsername").value.trim();

        const email =
            document.getElementById("signupEmail").value.trim();

        const password =
            document.getElementById("signupPassword").value;

        signupMessage.textContent =
            "Creating account...";

        try {

            const { data, error } =
                await supabaseClient.auth.signUp({
                    email: email,
                    password: password,
                    options: {
                        data: {
                            username: username
                        }
                    }
                });

            if (error) {
                throw error;
            }

            signupMessage.textContent =
                "Account created successfully! Check your email if confirmation is required.";

            signupForm.reset();

        } catch (error) {

            console.error("Signup error:", error);

            signupMessage.textContent =
                "Sign up failed: " + error.message;

        }

    });

}


/* ==========================================
   LOGIN
   ========================================== */

if (loginForm) {

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const email =
            document.getElementById("loginEmail").value.trim();

        const password =
            document.getElementById("loginPassword").value;

        loginMessage.textContent =
            "Logging in...";

        try {

            const { data, error } =
                await supabaseClient.auth.signInWithPassword({
                    email: email,
                    password: password
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

}


/* ==========================================
   LOGOUT
   ========================================== */

if (logoutBtn) {

    logoutBtn.addEventListener("click", async () => {

        const { error } =
            await supabaseClient.auth.signOut();

        if (error) {

            console.error("Logout error:", error);

            return;
        }

        cart = [];

        location.reload();

    });

}


/* ==========================================
   LOAD CURRENT USER
   ========================================== */

async function loadUser() {

    const {
        data: { user }
    } = await supabaseClient.auth.getUser();

    if (!user) {

        showLoggedOut();

        return;
    }

    const { data: profile, error } =
        await supabaseClient
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

    if (error) {

        console.error("Profile error:", error);

        showLoggedOut();

        return;
    }

    showLoggedIn(profile);

}


/* ==========================================
   SHOW LOGGED OUT
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

    cart = [];
    renderCart();
}


/* ==========================================
   SHOW LOGGED IN
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

    const {
        data: products,
        error
    } = await supabaseClient
        .from("products")
        .select("*")
        .order("id", { ascending: false });

    if (error) {

        console.error("Products error:", error);

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
                    ${escapeHTML(product.description || "")}
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

        alert("Unable to add product to cart.");

        return;
    }

    const existingItem =
        cart.find(item => item.id === product.id);

    if (existingItem) {

        existingItem.quantity += 1;

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
   REMOVE FROM CART
   ========================================== */

function removeFromCart(productId) {

    cart =
        cart.filter(item => item.id !== productId);

    renderCart();

}


/* ==========================================
   CHANGE QUANTITY
   ========================================== */

function changeQuantity(productId, amount) {

    const item =
        cart.find(item => item.id === productId);

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
                    each
                </p>

            </div>

            <div class="cart-quantity">

                <button
                    class="quantity-btn"
                    onclick="changeQuantity(${item.id}, -1)"
                >
                    −
                </button>

                <strong>
                    ${item.quantity}
                </strong>

                <button
                    class="quantity-btn"
                    onclick="changeQuantity(${item.id}, 1)"
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
                onclick="removeFromCart(${item.id})"
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
   CHECKOUT
   ========================================== */

if (checkoutForm) {

    checkoutForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            if (cart.length === 0) {

                checkoutMessage.textContent =
                    "Your cart is empty.";

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
                        sum + (item.price * item.quantity),
                    0
                );

            checkoutMessage.textContent =
                "Processing order...";

            /*
               IMPORTANT:
               This part only prepares the order.
               It will be connected to an orders table
               once that table is created in Supabase.
            */

            console.log({
                customerName,
                customerAddress,
                customerPhone,
                paymentMethod,
                items: cart,
                total
            });

            checkoutMessage.textContent =
                "Order details ready! Payment method: " +
                paymentMethod +
                ". Total: ₱" +
                total.toLocaleString(
                    "en-PH",
                    {
                        minimumFractionDigits: 2
                    }
                );

        }
    );

}


/* ==========================================
   ADD PRODUCT
   ========================================== */

if (productForm) {

    productForm.addEventListener(
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
                    .insert([{
                        name: name,
                        price: price,
                        image: image,
                        description: description
                    }]);

            if (error) {

                console.error(
                    "Add product error:",
                    error
                );

                productMessage.textContent =
                    "Failed to add product: " +
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

}


/* ==========================================
   LOAD ADMIN PRODUCTS
   ========================================== */

async function loadAdminProducts() {

    if (!adminProductsContainer) {
        return;
    }

    const {
        data: products,
        error
    } = await supabaseClient
        .from("products")
        .select("*")
        .order("id", { ascending: false });

    if (error) {

        console.error(
            "Admin products error:",
            error
        );

        adminProductsContainer.innerHTML =
            "<p>Unable to load products.</p>";

        return;
    }

    adminProductsContainer.innerHTML = "";

    if (!products || products.length === 0) {

        adminProductsContainer.innerHTML =
            "<p>No products available.</p>";

        return;
    }

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
                    ₱${Number(product.price).toLocaleString(
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

        adminProductsContainer.appendChild(item);

    });

}


/* ==========================================
   EDIT PRODUCT
   ========================================== */

async function editProduct(id) {

    const newName =
        prompt("Enter new product name:");

    if (newName === null) {
        return;
    }

    const newPrice =
        prompt("Enter new price:");

    if (newPrice === null) {
        return;
    }

    const newDescription =
        prompt("Enter new description:");

    if (newDescription === null) {
        return;
    }

    const { error } =
        await supabaseClient
            .from("products")
            .update({
                name: newName,
                price: Number(newPrice),
                description: newDescription
            })
            .eq("id", id);

    if (error) {

        alert(
            "Failed to update product: " +
            error.message
        );

        return;
    }

    alert(
        "Product updated successfully!"
    );

    await loadProducts();
    await loadAdminProducts();

}


/* ==========================================
   DELETE PRODUCT
   ========================================== */

async function deleteProduct(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this product?"
        );

    if (!confirmed) {
        return;
    }

    const { error } =
        await supabaseClient
            .from("products")
            .delete()
            .eq("id", id);

    if (error) {

        alert(
            "Failed to delete product: " +
            error.message
        );

        return;
    }

    alert(
        "Product deleted successfully!"
    );

    await loadProducts();
    await loadAdminProducts();

}


/* ==========================================
   BASIC HTML ESCAPING
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
   AUTH STATE LISTENER
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
   START WEBSITE
   ========================================== */

loadUser();
loadUser();
