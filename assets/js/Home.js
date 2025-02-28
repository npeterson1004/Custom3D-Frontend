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
                <div class="col-md-4">
                    <div class="card mb-4 shadow-sm">
                        <img src="${product.image.startsWith('http') ? product.image : API_BASE_URL + product.image}" class="card-img-top" alt="${product.name}" style="max-width: 100%; height: auto;">
                        <div class="card-body">
                            <h7 class="card-title">${product.name}</h7>
                            <p class="card-text">${product.description}</p>
                            <p class="card-text">$${product.price}</p>
                            <button class="btn btn-primary" onclick="addToCart('${product.name}', ${product.price}, '${API_BASE_URL}${product.image}')">Add to Cart</button>
                        </div>
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

document.addEventListener("DOMContentLoaded", () => {
    fetchFeaturedProducts();
})