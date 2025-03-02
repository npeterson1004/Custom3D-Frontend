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
                <div class="warehouse-item">
                    <img src="${product.image.startsWith('http') ? product.image : API_BASE_URL + product.image}" onclick="openModal(this.src)" class="warehouse-img" alt="${product.name}">
                    <div class="warehouse-details">
                        <h7>${product.name}</h7>
                        <p>${product.description}</p>
                        <p class="order-price">$${product.price}</p>
                        <button class="btn btn-primary add-to-cart-btn" onclick="addToCart('${product.name}', ${product.price}, '${API_BASE_URL}${product.image}')">Add to Cart</button>
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


// Open the modal and display the full image
function openModal(imgSrc) {
    document.getElementById("imageModal").style.display = "flex";
    document.getElementById("fullImage").src = imgSrc;
}

// Close the modal when clicking the close button
function closeModal() {
    document.getElementById("imageModal").style.display = "none";
}

// Close the modal when clicking outside the image
document.getElementById("imageModal").addEventListener("click", function (event) {
    if (event.target === this) {
        closeModal();
    }
});
