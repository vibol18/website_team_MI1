let quantity = 1;

const qty = document.getElementById("qty");

const plus = document.getElementById("plus");

const minus = document.getElementById("minus");

plus.addEventListener("click", function(){

    quantity++;

    qty.innerText = quantity;

});

minus.addEventListener("click", function(){

    if(quantity > 1){

        quantity--;

        qty.innerText = quantity;

    }

});