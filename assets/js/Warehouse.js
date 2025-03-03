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
                    <img src="${product.image.startsWith('http') ? product.image : API_BASE_URL + product.image}" 
                         onclick="enlargeImage(this.src)" 
                         class="warehouse-img" 
                         alt="${product.name}">
                    <div class="warehouse-details">
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
            warehouseContainer.innerHTML += productCard; // ✅ Now properly updating warehouseContainer
        });
        

    } catch (error) {
        console.error("❌ Error fetching warehouse products:", error);
        document.getElementById("warehouseContainer").innerHTML = '<p class="text-center text-danger">Failed to load products.</p>';
    }
}

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

    // Prevent background interaction issues
    popupImg.style.pointerEvents = "auto"; 

    // Append the image to the body
    document.body.appendChild(popupImg);
}


