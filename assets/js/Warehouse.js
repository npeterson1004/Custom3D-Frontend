// warehouse.js
import { API_BASE_URL } from "./config.js"; // ✅ Ensure correct import

document.addEventListener("DOMContentLoaded", fetchWarehouseProducts);

async function fetchWarehouseProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/products`);
        const products = await response.json();

        const warehouseContainer = document.getElementById("warehouseContainer");
        if (!warehouseContainer) {
            console.error("Error: 'warehouseContainer' element not found.");
            return;
        }

        warehouseContainer.innerHTML = ""; // Clear existing content

        if (products.length === 0) {
            warehouseContainer.innerHTML = '<p class="text-center">No products available.</p>';
            return;
        }

        products.forEach(product => {
            const productCard = `
                <div class="col-md-4 d-flex align-items-stretch">
                    <div class="card mb-4 shadow-sm warehouse-item">
                        <img src="${product.image.startsWith('http') ? product.image : API_BASE_URL + product.image}" class="card-img-top" alt="${product.name}">
                        <div class="card-body text-center">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text">${product.description}</p>
                            <p class="order-price">$${product.price}</p>
                            <button class="btn btn-primary add-to-cart-btn" onclick="addToCart('${product.name}', ${product.price}, '${API_BASE_URL}${product.image}')">Add to Cart</button>
                        </div>
                    </div>
                </div>
            `;
            warehouseContainer.innerHTML += productCard;
        });

    } catch (error) {
        console.error("❌ Error fetching warehouse products:", error);
        document.getElementById("warehouseContainer").innerHTML = '<p class="text-center text-danger">Failed to load products.</p>';
    }
}

