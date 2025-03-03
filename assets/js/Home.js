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
            // Create the product card as an element instead of using a template string
            const productCard = document.createElement("div");
            productCard.classList.add("featured-item");

            // Set inner HTML for product details
            productCard.innerHTML = `
                <img src="${product.image.startsWith('http') ? product.image : API_BASE_URL + product.image}" 
                     class="featured-img" 
                     alt="${product.name}">
                <div class="featured-details">
                    <h5>${product.name}</h5>
                    <p>${product.description}</p>
                    <p class="order-price">$${product.price}</p>
                    <button class="btn btn-primary add-to-cart-btn">
                        Add to Cart
                    </button>
                    <button class="view-image-btn">
                        View Image
                    </button>
                </div>
            `;

            // Attach event listener to "View Image" button
            const viewImageButton = productCard.querySelector(".view-image-btn");
            viewImageButton.addEventListener("click", () => {
                enlargeImage(product.image.startsWith('http') ? product.image : API_BASE_URL + product.image);
            });

            // Append product card to container
            imageContainer.appendChild(productCard);
        });

    } catch (error) {
        console.error("Error fetching featured products:", error);
        imageContainer.innerHTML = '<p class="text-center text-danger">Failed to load featured products.</p>';
    }
}

document.addEventListener("DOMContentLoaded", fetchFeaturedProducts);


// Function to enlarge image in fullscreen mode & exit on click
function enlargeImage(imgSrc) {
    // Create a new image element
    let popupImg = document.createElement("img");
    popupImg.src = imgSrc;
    popupImg.classList.add("fullscreen-img"); // ✅ Apply CSS styling

    // Create a fullscreen background overlay (so clicking anywhere closes the image)
    let fullscreenOverlay = document.createElement("div");
    fullscreenOverlay.classList.add("fullscreen-overlay");
    
    // Append image to the overlay
    fullscreenOverlay.appendChild(popupImg);
    
    // Append overlay to the body
    document.body.appendChild(fullscreenOverlay);

    // Handle exit fullscreen when clicking anywhere
    fullscreenOverlay.onclick = function () {
        if (document.fullscreenElement) {
            document.exitFullscreen(); // ✅ Exit fullscreen mode
        }
        fullscreenOverlay.remove(); // ✅ Remove the overlay and image
    };

    // Trigger fullscreen mode immediately
    fullscreenOverlay.requestFullscreen().catch(err => {
        console.warn("Fullscreen request failed", err);
    });
}




