let quantity = 0;

const qty = document.getElementById("qty");
const plus = document.getElementById("plus");
const minus = document.getElementById("minus");

qty.innerText = quantity;

plus.addEventListener("click", function () {
    quantity++;
    qty.innerText = quantity;
});

minus.addEventListener("click", function () {
    if (quantity > 0) {
        quantity--;
        qty.innerText = quantity;
    }
});

const colors = document.querySelectorAll(".color");
const selectedColor = document.getElementById("selectedColor");

colors.forEach(function(color){

    color.addEventListener("click", function(){

        colors.forEach(function(c){
            c.classList.remove("active");
        });

        this.classList.add("active");

        selectedColor.innerText = this.dataset.color;

    });

});