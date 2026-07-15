const plusButtons = document.querySelectorAll(".plus");
const minusButtons = document.querySelectorAll(".minus");

plusButtons.forEach(function(button){

    button.addEventListener("click", function(){

        let quantity = this.previousElementSibling;

        quantity.innerText = Number(quantity.innerText) + 1;

    });

});

minusButtons.forEach(function(button){

    button.addEventListener("click", function(){

        let quantity = this.nextElementSibling;

        let value = Number(quantity.innerText);

        if(value > 1){

            quantity.innerText = value - 1;

        }

    });

});


const deliveryCards = document.querySelectorAll(".delivery-card");
const shipping = document.getElementById("shipping");

deliveryCards.forEach(function(card){

    card.addEventListener("click", function(){

        deliveryCards.forEach(function(c){
            c.classList.remove("active");
        });

        this.classList.add("active");

        let price = this.querySelector("h4").innerText;

        if(price === "FREE"){

            shipping.innerText = "$0.00";

        }else{

            shipping.innerText = price;

        }

        calculateTotal();

    });

});


const extras = document.querySelectorAll(".extra");
const service = document.getElementById("service");

extras.forEach(function(box){

    box.addEventListener("change", calculateService);

});

function calculateService(){

    let totalService = 0;

    extras.forEach(function(box){

        if(box.checked){

            totalService += Number(box.value);

        }

    });

    service.innerText = "$" + totalService.toFixed(2);

    calculateTotal();

}



let discount = 0;

document.getElementById("applyCoupon").addEventListener("click", function(){

    const coupon = document.getElementById("coupon").value;

    if(coupon === "SAVE10"){

        discount = 10;

        alert("Coupon Applied! 10% OFF");

    }else{

        discount = 0;

        alert("Invalid Coupon");

    }

    calculateTotal();

});



function calculateTotal(){

    let subtotal = Number(
        document.getElementById("subtotal")
        .innerText
        .replace("$","")
    );

    let ship = Number(
        document.getElementById("shipping")
        .innerText
        .replace("$","")
    );

    let serviceCost = Number(
        document.getElementById("service")
        .innerText
        .replace("$","")
    );

    let total = subtotal + ship + serviceCost;

    if(discount > 0){

        total = total - (total * discount / 100);

    }

    document.getElementById("total").innerText =
        "$" + total.toFixed(2);

}



document.querySelector(".checkout").addEventListener("click", function(){

    alert("Thank you for your purchase!");

});


calculateTotal();