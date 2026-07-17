let qty = 1;

const qtyInput = document.getElementById("qty");

document.getElementById("plus").onclick = () => {

    qty++;

    qtyInput.value = qty;

}

document.getElementById("minus").onclick = () => {

    if(qty > 1){

        qty--;

        qtyInput.value = qty;

    }

}