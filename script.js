/* =========================================================
   TELEVISION SHOP — MAIN SCRIPT
   Handles: product rendering, search, cart, and
   localStorage-based user registration / login.
   ========================================================= */

const STORAGE_KEYS = {
    USERS: "tvShopUsers",
    SESSION: "tvShopSession",
    CART: "tvShopCart"
};

/* ---------------------------------------------------------
   STORAGE HELPERS
--------------------------------------------------------- */

function getUsers() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
}

function saveUsers(users) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

function getSession() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSION)) || null;
}

function saveSession(user) {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user));
}

function clearSession() {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
}

function getCart() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CART)) || [];
}

function saveCart(cart) {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
}

/* ---------------------------------------------------------
   PRODUCT RENDERING
--------------------------------------------------------- */

function renderProducts(list) {

    const container = document.getElementById("productContainer");
    if (!container) return;

    if (list.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center text-muted py-5">
                <i class="fa-solid fa-tv fa-2x mb-3"></i>
                <p>No televisions match your search.</p>
            </div>`;
        return;
    }

    container.innerHTML = list.map(product => `
        <div class="col-sm-6 col-lg-4 col-xl-3">
            <div class="card h-100 product-card" data-id="${product.id}">
                <img src="${product.image}"
                     class="card-img-top product-img"
                     alt="${product.name}"
                     onerror="this.src='https://placehold.co/400x300?text=${encodeURIComponent(product.name)}'">
                <div class="card-body d-flex flex-column">
                    <span class="badge bg-secondary align-self-start mb-2">${product.brand}</span>
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text text-muted small flex-grow-1">${product.description}</p>
                    <p class="fw-bold fs-5 mb-3">$${product.price.toFixed(2)}</p>
                    <div class="d-flex gap-2">
                        <button class="btn btn-outline-primary flex-fill btn-view" data-id="${product.id}">
                            View Detail
                        </button>
                        <button class="btn btn-primary flex-fill btn-add-cart" data-id="${product.id}">
                            <i class="fa-solid fa-cart-plus"></i> Add
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join("");

    attachCardEvents();
}

function attachCardEvents() {

    // Hover animation is handled entirely in style.css (.product-card:hover)
    // so it works immediately for every card, no JS timing required.

    document.querySelectorAll(".btn-view").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = Number(btn.dataset.id);
            showProductDetail(id);
        });
    });

    document.querySelectorAll(".btn-add-cart").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = Number(btn.dataset.id);
            addToCart(id);
        });
    });
}

function showProductDetail(id) {

    const product = PRODUCTS.find(p => p.id === id);
    if (!product) return;

    document.getElementById("detailImage").src = product.image;
    document.getElementById("detailImage").onerror = function () {
        this.src = `https://placehold.co/400x300?text=${encodeURIComponent(product.name)}`;
    };
    document.getElementById("detailBrand").textContent = product.brand;
    document.getElementById("detailName").textContent = product.name;
    document.getElementById("detailDescription").textContent = product.description;
    document.getElementById("detailPrice").textContent = `$${product.price.toFixed(2)}`;
    document.getElementById("detailAddCart").dataset.id = product.id;

    const modal = new bootstrap.Modal(document.getElementById("detailModal"));
    modal.show();
}

/* ---------------------------------------------------------
   SEARCH
--------------------------------------------------------- */

function setupSearch() {

    const searchInput = document.getElementById("searchInput");
    if (!searchInput) return;

    searchInput.addEventListener("input", () => {
        const term = searchInput.value.trim().toLowerCase();

        const filtered = PRODUCTS.filter(p =>
            p.name.toLowerCase().includes(term) ||
            p.brand.toLowerCase().includes(term)
        );

        renderProducts(filtered);
    });
}

/* ---------------------------------------------------------
   CART
--------------------------------------------------------- */

function addToCart(id) {

    const cart = getCart();
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ id, qty: 1 });
    }

    saveCart(cart);
    updateCartCount();
    showToast("Added to cart");
}

function updateCartCount() {

    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.qty, 0);

    const badge = document.getElementById("cartCount");
    if (badge) badge.textContent = count;
}

function showToast(message) {

    let toastEl = document.getElementById("appToast");

    if (!toastEl) {
        toastEl = document.createElement("div");
        toastEl.id = "appToast";
        toastEl.className = "toast align-items-center text-bg-dark border-0 position-fixed bottom-0 end-0 m-4";
        toastEl.setAttribute("role", "alert");
        toastEl.style.zIndex = 1080;
        toastEl.innerHTML = `
            <div class="d-flex">
                <div class="toast-body" id="appToastBody"></div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>`;
        document.body.appendChild(toastEl);
    }

    document.getElementById("appToastBody").textContent = message;
    new bootstrap.Toast(toastEl, { delay: 2000 }).show();
}

/* ---------------------------------------------------------
   AUTHENTICATION (localStorage)
--------------------------------------------------------- */

function setupAuth() {

    const loginBtn = document.getElementById("loginBtn");
    const registerBtn = document.getElementById("registerBtn");

    if (loginBtn) {
        loginBtn.addEventListener("click", () => {
            new bootstrap.Modal(document.getElementById("loginModal")).show();
        });
    }

    if (registerBtn) {
        registerBtn.addEventListener("click", () => {
            new bootstrap.Modal(document.getElementById("registerModal")).show();
        });
    }

    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", handleRegister);
    }

    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", handleLogin);
    }

    renderAuthArea();
}

function handleRegister(e) {

    e.preventDefault();

    const name = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim().toLowerCase();
    const password = document.getElementById("regPassword").value;
    const confirm = document.getElementById("regConfirmPassword").value;
    const errorBox = document.getElementById("registerError");

    errorBox.classList.add("d-none");

    if (!name || !email || !password) {
        return showAuthError(errorBox, "Please fill in all fields.");
    }

    if (password.length < 6) {
        return showAuthError(errorBox, "Password must be at least 6 characters.");
    }

    if (password !== confirm) {
        return showAuthError(errorBox, "Passwords do not match.");
    }

    const users = getUsers();

    if (users.some(u => u.email === email)) {
        return showAuthError(errorBox, "An account with this email already exists.");
    }

    // Note: for a real application, never store plain-text passwords.
    // This is a client-only demo using localStorage.
    users.push({ name, email, password });
    saveUsers(users);

    saveSession({ name, email });

    bootstrap.Modal.getInstance(document.getElementById("registerModal")).hide();
    e.target.reset();
    renderAuthArea();
    showToast(`Welcome, ${name}!`);
}

function handleLogin(e) {

    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;
    const errorBox = document.getElementById("loginError");

    errorBox.classList.add("d-none");

    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        return showAuthError(errorBox, "Invalid email or password.");
    }

    saveSession({ name: user.name, email: user.email });

    bootstrap.Modal.getInstance(document.getElementById("loginModal")).hide();
    e.target.reset();
    renderAuthArea();
    showToast(`Welcome back, ${user.name}!`);
}

function showAuthError(box, message) {
    box.textContent = message;
    box.classList.remove("d-none");
}

function logout() {
    clearSession();
    renderAuthArea();
    showToast("You have been logged out.");
}

function renderAuthArea() {

    const authArea = document.getElementById("authArea");
    if (!authArea) return;

    const session = getSession();

    const cartHtml = `
        <a href="cart.html" class="btn btn-outline-dark">
            <i class="fa-solid fa-cart-shopping"></i>
            <span id="cartCount">0</span>
        </a>`;

    if (session) {
        authArea.innerHTML = `
            ${cartHtml}
            <span class="fw-semibold text-primary d-none d-md-inline">
                <i class="fa-solid fa-circle-user"></i> ${session.name}
            </span>
            <button class="btn btn-outline-danger" id="logoutBtn">
                Logout
            </button>`;

        document.getElementById("logoutBtn").addEventListener("click", logout);

    } else {
        authArea.innerHTML = `
            ${cartHtml}
            <button class="btn btn-outline-primary" id="loginBtn">Login</button>
            <button class="btn btn-primary" id="registerBtn">Sign Up</button>`;

        document.getElementById("loginBtn").addEventListener("click", () => {
            new bootstrap.Modal(document.getElementById("loginModal")).show();
        });

        document.getElementById("registerBtn").addEventListener("click", () => {
            new bootstrap.Modal(document.getElementById("registerModal")).show();
        });
    }

    updateCartCount();
}

/* ---------------------------------------------------------
   SMOOTH SCROLL — Shop Now
--------------------------------------------------------- */

function setupSmoothScroll() {

    const shopBtn = document.querySelector('a[href="#products"]');
    if (!shopBtn) return;

    shopBtn.addEventListener("click", function (e) {
        e.preventDefault();
        document.querySelector("#products").scrollIntoView({ behavior: "smooth" });
    });
}

/* ---------------------------------------------------------
   DETAIL MODAL — Add to cart button
--------------------------------------------------------- */

function setupDetailModal() {

    const addBtn = document.getElementById("detailAddCart");
    if (!addBtn) return;

    addBtn.addEventListener("click", () => {
        addToCart(Number(addBtn.dataset.id));
    });
}

/* ---------------------------------------------------------
   INIT
--------------------------------------------------------- */

window.onload = function () {

    console.log("Welcome to Television Shop!");

    renderProducts(PRODUCTS);
    setupSearch();
    setupAuth();
    setupSmoothScroll();
    setupDetailModal();
    updateCartCount();
};