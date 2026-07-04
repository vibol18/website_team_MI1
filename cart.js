// Prices
let productTotal = 2090;
let deliveryFee = 10;
let discount = 0;

const servicePrices = {
    warranty: 50,
    installation: 30,
    protection: 25
};

// Get elements
const totalText = document.querySelector(".summary h3 span");
const productText = document.querySelector(".summary p span");
const discountText = document.querySelectorAll(".summary p span")[2];

const services = document.querySelectorAll(".service input");

// Update total
function updateTotal() {

    let serviceTotal = 0;

    if (services[0].checked)
        serviceTotal += servicePrices.warranty;

    if (services[1].checked)
        serviceTotal += servicePrices.installation;

    if (services[2].checked)
        serviceTotal += servicePrices.protection;

    let total = productTotal + deliveryFee + serviceTotal - discount;

    totalText.innerHTML = "$" + total;
}

// Coupon
function applyCoupon() {

    let code = document.querySelector(".summary input").value;

    if (code.toUpperCase() === "SAVE10") {

        discount = 10;
        discountText.innerHTML = "-$10";

        alert("Coupon Applied!");

    } else {

        discount = 0;
        discountText.innerHTML = "$0";

        alert("Invalid Coupon");

    }

    updateTotal();

}

// Extra services
services.forEach(function(service){

    service.addEventListener("change", updateTotal);

});

// Checkout
document.querySelector(".checkout").addEventListener("click", function(){

    updateTotal();

    alert("Thank you for your purchase!");

});

// Start
updateTotal();