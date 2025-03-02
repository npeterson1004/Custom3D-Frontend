//Home.js


import { API_BASE_URL } from "./config.js";  // ✅ Import API base URL

async function fetchFeaturedProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/products/featured`);
        const products = await response.json();

        const imageContainer = document.getElementById("imageContainer");
        if (!imageContainer) {
            console.error("Error: 'imageContainer' not found.");
            return;
        }

        imageContainer.innerHTML = ""; // Clear existing content

        if (products.length === 0) {
            imageContainer.innerHTML = '<p class="text-center">No featured products available.</p>';
            return;
        }

        products.forEach(product => {
            const productCard = `
                <div class="featured-item">
                    <img src="${product.image.startsWith('http') ? product.image : API_BASE_URL + product.image}" onclick="enlargeImage(this.src)" class="featured-img" alt="${product.name}">
                    <div class="featured-details">
                        <h7>${product.name}</h7>
                        <p>${product.description}</p>
                        <p class="order-price">$${product.price}</p>
                        <button class="btn btn-primary add-to-cart-btn" onclick="addToCart('${product.name}', ${product.price}, '${API_BASE_URL}${product.image}')">Add to Cart</button>
                    </div>
                </div>
            `;
            imageContainer.innerHTML += productCard;
        });

    } catch (error) {
        console.error("Error fetching featured products:", error);
        imageContainer.innerHTML = '<p class="text-center text-danger">Failed to load featured products.</p>';
    }
}




document.addEventListener("DOMContentLoaded", fetchFeaturedProducts);

// Function to enlarge image when clicked
function enlargeImage(imgSrc) {
    let existingPopup = document.getElementById("popupImage");

    // Remove any existing popup image before adding a new one
    if (existingPopup) {
        existingPopup.remove();
    }

    // Create new enlarged image element
    let popupImg = document.createElement("img");
    popupImg.id = "popupImage";
    popupImg.classList.add("enlarged-img");
    popupImg.src = imgSrc;

    // Ensure the image is visible
    popupImg.style.display = "block";

    // Close image when clicked
    popupImg.onclick = function () {
        this.remove(); // ✅ Clicking the image closes it
        document.body.classList.remove("no-scroll"); // ✅ Enable scrolling again
    };

    // Prevent background scrolling
    document.body.classList.add("no-scroll");

    // Append image to the body
    document.body.appendChild(popupImg);
}


