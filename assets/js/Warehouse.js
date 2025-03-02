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
                    <img src="${product.image.startsWith('http') ? product.image : API_BASE_URL + product.image}" onclick="enlargeImage(this.src)" class="warehouse-img" alt="${product.name}">
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


// Function to enlarge image when clicked
function enlargeImage(imgSrc) {
    let popupImg = document.getElementById("popupImage");

    // If popup image doesn't exist, create it
    if (!popupImg) {
        popupImg = document.createElement("img");
        popupImg.id = "popupImage";
        popupImg.classList.add("enlarged-img");

        // Close image on click
        popupImg.onclick = function () {
            this.remove(); // ✅ Clicking the image will close it
        };

        document.body.appendChild(popupImg);
    }

    // Set the image source and show it
    popupImg.src = imgSrc;
    popupImg.style.display = "block"; // ✅ Ensures visibility
}

