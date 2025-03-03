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
                    <img src="${product.image.startsWith('http') ? product.image : API_BASE_URL + product.image}" 
                         onclick="enlargeImage(this.src)" 
                         class="featured-img" 
                         alt="${product.name}">
                    <div class="featured-details">
                        <h5>${product.name}</h5>
                        <p>${product.description}</p>
                        <p class="order-price">$${product.price}</p>
                        <button class="btn btn-primary add-to-cart-btn" 
                                onclick="addToCart('${product.name}', ${product.price}, '${API_BASE_URL}${product.image}')">
                            Add to Cart
                        </button>
                        <button class="view-image-btn" 
                                onclick="enlargeImage('${product.image.startsWith('http') ? product.image : API_BASE_URL + product.image}')">
                            View Image
                        </button>
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

// Function to enlarge image when "View Image" button is clicked
function enlargeImage(imgSrc) {
    // Remove any existing enlarged image
    let existingPopup = document.getElementById("popupImage");
    if (existingPopup) {
        existingPopup.remove();
    }

    // Create a new enlarged image element
    let popupImg = document.createElement("img");
    popupImg.id = "popupImage";
    popupImg.classList.add("enlarged-img");
    popupImg.src = imgSrc;

    // Close image when clicked
    popupImg.onclick = function () {
        this.remove(); // ✅ Clicking the image closes it
        document.body.classList.remove("no-scroll"); // ✅ Restore scrolling
    };

    // Ensure page remains interactive
    popupImg.style.pointerEvents = "auto"; // ✅ Prevents blocking interactions

    // Append the image to the body
    document.body.appendChild(popupImg);
}



