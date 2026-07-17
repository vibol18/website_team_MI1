let quantity = 1;

const qty = document.getElementById("qty");

document.getElementById("plus").onclick = () => {
    quantity++;
    qty.innerText = quantity;
};

document.getElementById("minus").onclick = () => {
    if(quantity > 1){
        quantity--;
        qty.innerText = quantity;
    }
};

// Color Selection

const colors = document.querySelectorAll(".color");
const selected = document.getElementById("selectedColor");

const names = ["Black","White","Blue","Red"];

colors.forEach((color,index)=>{

    color.addEventListener("click",()=>{

        colors.forEach(c=>c.classList.remove("active"));

        color.classList.add("active");

        selected.innerText = names[index];

    });

});