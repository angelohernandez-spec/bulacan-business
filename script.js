/* ==========================================
   BULACAN BUSINESS - SUPABASE CONNECTION
   ========================================== */

const SUPABASE_URL = "https://clnsyeilgralccihuodd.supabase.co";

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

const usernameDisplay = document.getElementById("usernameDisplay");

const loginMessage = document.getElementById("loginMessage");
const signupMessage = document.getElementById("signupMessage");

const productForm = document.getElementById("productForm");
const productMessage = document.getElementById("productMessage");

const productsContainer =
    document.getElementById("productsContainer");

const adminProductsContainer =
    document.getElementById("adminProductsContainer");


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

        signupMessage.textContent = "Creating account...";

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

        loginMessage.textContent = "Logging in...";

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

    showLoginBtn.classList.remove("hidden");

    showSignupBtn.classList.remove("hidden");

    loadProducts();
}


/* ==========================================
   SHOW LOGGED IN
   ========================================== */

function showLoggedIn(profile) {

    homeSection.classList.add("hidden");

    authSection.classList.add("hidden");

    userSection.classList.remove("hidden");

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
                src="${image}"
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

            </div>
        `;

        productsContainer.appendChild(card);
    });
}


/* ==========================================
   ADD PRODUCT
   ========================================== */

if (productForm) {
    productForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const name =
            document.getElementById("productName").value.trim();

        const price =
            Number(document.getElementById("productPrice").value);

        const image =
            document.getElementById("productImage").value.trim();

        const description =
            document.getElementById("productDescription").value.trim();

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

            console.error("Add product error:", error);

            productMessage.textContent =
                "Failed to add product: " + error.message;

            return;
        }

        productMessage.textContent =
            "Product added successfully!";

        productForm.reset();

        await loadProducts();
        await loadAdminProducts();
    });
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

        console.error("Admin products error:", error);

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

    alert("Product updated successfully!");

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

    alert("Product deleted successfully!");

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