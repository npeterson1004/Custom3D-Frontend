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
            const productCard = document.createElement("div");
            productCard.classList.add("warehouse-item");

            productCard.innerHTML = `
                <img src="${product.image.startsWith('http') ? product.image : API_BASE_URL + product.image}" 
                     class="warehouse-img" 
                     alt="${product.name}">
                <div class="warehouse-details">
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
            viewImageButton.addEventListener("click", function () {
                enlargeImage(product.image.startsWith('http') ? product.image : API_BASE_URL + product.image);
            });

            // Append product card to container
            warehouseContainer.appendChild(productCard);
        });

    } catch (error) {
        console.error("❌ Error fetching warehouse products:", error);
        document.getElementById("warehouseContainer").innerHTML = '<p class="text-center text-danger">Failed to load products.</p>';
    }
}



// Function to enlarge image in fullscreen mode
function enlargeImage(imgSrc) {
    // Create a new image element
    let popupImg = document.createElement("img");
    popupImg.src = imgSrc;
    popupImg.classList.add("fullscreen-img"); // ✅ Apply CSS styling

    // Add fullscreen mode
    popupImg.onclick = function () {
        if (document.fullscreenElement) {
            document.exitFullscreen(); // ✅ Exit fullscreen on click
        } else {
            popupImg.requestFullscreen(); // ✅ Enter fullscreen
        }
    };

    // Append the image to the body
    document.body.appendChild(popupImg);

    // Remove the image when exiting fullscreen
    document.addEventListener("fullscreenchange", () => {
        if (!document.fullscreenElement) {
            popupImg.remove(); // ✅ Remove image when exiting fullscreen
        }
    });

    // Trigger fullscreen mode immediately
    popupImg.requestFullscreen();
}



