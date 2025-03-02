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
                    <img src="${product.image.startsWith('http') ? product.image : API_BASE_URL + product.image}" class="featured-img" alt="${product.name}">
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
