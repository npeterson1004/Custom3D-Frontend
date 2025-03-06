//Home.js
import { API_BASE_URL } from "./config.js";

document.addEventListener("DOMContentLoaded", fetchFeaturedProducts);

async function fetchFeaturedProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/products/featured`);
        const products = await response.json();

        const featuredContainer = document.getElementById("featuredContainer");
        if (!featuredContainer) {
            console.error("Error: 'featuredContainer' not found.");
            return;
        }

        featuredContainer.innerHTML = ""; // Clear existing content

        if (products.length === 0) {
            featuredContainer.innerHTML = '<p class="text-center">No featured products available.</p>';
            return;
        }

        products.forEach(product => {
            const productCard = document.createElement("div");
            productCard.classList.add("warehouse-item"); // ✅ Use the same class as warehouse

            productCard.innerHTML = `
                <img src="${product.image.startsWith('http') ? product.image : API_BASE_URL + product.image}" 
                     class="warehouse-img" 
                     alt="${product.name}">
                <div class="warehouse-details">
                    <h5>${product.name}</h5>
                    <p>${product.description}</p>
                    <p class="order-price">$${product.price}</p>
                    <button class="btn btn-primary add-to-cart-btn" data-product-id="${product._id}">
                        Add to Cart
                    </button>
                    <button class="view-image-btn">
                        View Image
                    </button>
                </div>
            `;

            // Attach event listener to "View Image" button
            productCard.querySelector(".view-image-btn").addEventListener("click", () => {
                enlargeImage(product.image.startsWith('http') ? product.image : API_BASE_URL + product.image);
            });

            // ✅ FIXED: Correctly pass parameters to `addToCart`
            productCard.querySelector(".add-to-cart-btn").addEventListener("click", () => {
                addToCart(product.name, product.price, product.image);
            });

            // Append product card to container
            featuredContainer.appendChild(productCard);
        });

    } catch (error) {
        console.error("Error fetching featured products:", error);
        featuredContainer.innerHTML = '<p class="text-center text-danger">Failed to load featured products.</p>';
    }
}

// ✅ Function to enlarge image in fullscreen mode & exit on click
function enlargeImage(imgSrc) {
    let popupImg = document.createElement("img");
    popupImg.src = imgSrc;
    popupImg.classList.add("fullscreen-img");

    let fullscreenOverlay = document.createElement("div");
    fullscreenOverlay.classList.add("fullscreen-overlay");

    fullscreenOverlay.appendChild(popupImg);
    document.body.appendChild(fullscreenOverlay);

    fullscreenOverlay.onclick = function () {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
        fullscreenOverlay.remove();
    };

    fullscreenOverlay.requestFullscreen().catch(err => {
        console.warn("Fullscreen request failed", err);
    });
}

