const plus = document.querySelector(".plus");
const minus = document.querySelector(".minus");
const qty = document.querySelector(".qty");

const subtotalEl = document.getElementById("subtotal");
const taxAmountEl = document.getElementById("taxAmount");
const totalEl = document.getElementById("total");
const itemTotal = document.querySelector(".item-total");

const price = 700;
const shipping = 5;
const TAX_RATE = 0.08; // 8% — shown next to "Tax" in the summary

let quantity = 1;

const ORDER_STORAGE_KEY = "tvShopOrder";

function calculateTotals() {

    const sub = price * quantity;
    const tax = sub * TAX_RATE;
    const grandTotal = sub + shipping + tax;

    return { sub, tax, grandTotal };
}

function updateCart() {

    const { sub, tax, grandTotal } = calculateTotals();

    qty.value = quantity;

    itemTotal.innerText = "$" + sub.toFixed(2);
    subtotalEl.innerText = "$" + sub.toFixed(2);
    taxAmountEl.innerText = "$" + tax.toFixed(2);
    totalEl.innerText = "$" + grandTotal.toFixed(2);
}

plus.onclick = function () {
    quantity++;
    updateCart();
};

minus.onclick = function () {
    if (quantity > 1) {
        quantity--;
        updateCart();
    }
};

const checkoutBtn = document.getElementById("checkoutBtn");
const checkoutModalEl = document.getElementById("checkoutModal");
const checkoutModal = new bootstrap.Modal(checkoutModalEl);

const modalSubtotal = document.getElementById("modalSubtotal");
const modalShipping = document.getElementById("modalShipping");
const modalTax = document.getElementById("modalTax");
const modalTotal = document.getElementById("modalTotal");

checkoutBtn.addEventListener("click", function () {

    const { sub, tax, grandTotal } = calculateTotals();

    modalSubtotal.innerText = "$" + sub.toFixed(2);
    modalShipping.innerText = "$" + shipping.toFixed(2);
    modalTax.innerText = "$" + tax.toFixed(2);
    modalTotal.innerText = "$" + grandTotal.toFixed(2);

    checkoutModal.show();
});


const checkoutForm = document.getElementById("checkoutForm");
const checkoutError = document.getElementById("checkoutError");

checkoutForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const location = document.getElementById("deliveryLocation").value.trim();
    const phone = document.getElementById("deliveryPhone").value.trim();

    checkoutError.classList.add("d-none");

    if (!location || !phone) {
        checkoutError.innerText = "Please enter both your delivery location and phone number.";
        checkoutError.classList.remove("d-none");
        return;
    }

    const phoneDigits = phone.replace(/[^0-9]/g, "");
    if (phoneDigits.length < 8) {
        checkoutError.innerText = "Please enter a valid phone number.";
        checkoutError.classList.remove("d-none");
        return;
    }

    const { sub, tax, grandTotal } = calculateTotals();

    const order = {
        product: "Samsung TV",
        price: price,
        quantity: quantity,
        subtotal: Number(sub.toFixed(2)),
        shipping: shipping,
        taxRate: TAX_RATE,
        tax: Number(tax.toFixed(2)),
        total: Number(grandTotal.toFixed(2)),
        deliveryLocation: location,
        deliveryPhone: phone,
        status: "Waiting for delivery",
        placedAt: new Date().toISOString()
    };

    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(order));

    checkoutForm.reset();
    checkoutModal.hide();

    showConfirmation(order);
    emptyCart();
});


function emptyCart() {

    quantity = 0;

    document.getElementById("cartBody").innerHTML = `
        <tr>
            <td colspan="4" class="text-center text-muted py-5">
                <i class="fa-solid fa-circle-check fa-2x text-success mb-2"></i>
                <p class="mb-0">Your cart is empty — order placed and waiting for delivery.</p>
                <a href="index.html" class="btn btn-outline-primary btn-sm mt-3">Continue Shopping</a>
            </td>
        </tr>`;

    subtotalEl.innerText = "$0.00";
    taxAmountEl.innerText = "$0.00";
    totalEl.innerText = "$0.00";

    checkoutBtn.disabled = true;
}


function showConfirmation(order) {

    document.getElementById("confirmLocation").innerText = order.deliveryLocation;
    document.getElementById("confirmPhone").innerText = order.deliveryPhone;
    document.getElementById("confirmTotal").innerText = "$" + order.total.toFixed(2);

    const confirmationModal = new bootstrap.Modal(document.getElementById("confirmationModal"));
    confirmationModal.show();
}

updateCart();