const plus = document.querySelector(".plus");
const minus = document.querySelector(".minus");
const qty = document.querySelector(".qty");

const subtotal = document.getElementById("subtotal");
const total = document.getElementById("total");
const itemTotal = document.querySelector(".item-total");

const price = 700;
const shipping = 5;

let quantity = 1;

function updateCart() {

    const sub = price * quantity;

    qty.value = quantity;

    itemTotal.innerText = "$" + sub;

    subtotal.innerText = "$" + sub;

    total.innerText = "$" + (sub + shipping);

}

plus.onclick = function () {

    quantity++;

    updateCart();

}

minus.onclick = function () {

    if (quantity > 1) {

        quantity--;

        updateCart();

    }

}