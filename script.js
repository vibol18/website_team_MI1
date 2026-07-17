// Welcome Message
window.onload = function () {
    console.log("Welcome to Television Shop!");
};

// Product Card Hover
const cards = document.querySelectorAll(".product-card");

cards.forEach(card => {

    card.addEventListener("mouseenter", () => {
        card.style.transform = "translateY(-8px)";
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = "translateY(0)";
    });

});

// Shop Now Button Smooth Scroll
const shopBtn = document.querySelector('a[href="#products"]');

if (shopBtn) {

    shopBtn.addEventListener("click", function (e) {

        e.preventDefault();

        document.querySelector("#products").scrollIntoView({
            behavior: "smooth"
        });

    });

}

const detailButtons = document.querySelectorAll(".btn-primary");

detailButtons.forEach(button => {

    if (button.textContent.includes("View Detail")) {

        button.addEventListener("click", function () {
            alert("Opening Product Detail...");
        });

    }

});