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
                    <button class="btn btn-primary add-to-cart-btn" data-product-id="${product._id}">
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

            // Attach event listener to "Add to Cart" button
            const addToCartButton = productCard.querySelector(".add-to-cart-btn");
            addToCartButton.addEventListener("click", () => {
                addToCart(product);
            });

            // Append product card to container
            warehouseContainer.appendChild(productCard);
        });

    } catch (error) {
        console.error("❌ Error fetching warehouse products:", error);
        document.getElementById("warehouseContainer").innerHTML = '<p class="text-center text-danger">Failed to load products.</p>';
    }
}

// Function to handle adding a product to the cart
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingProductIndex = cart.findIndex(item => item._id === product._id);
    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += 1; // Increase quantity if product exists
    } else {
        cart.push({ ...product, quantity: 1 }); // Add new product with quantity
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert(`${product.name} has been added to the cart!`);
}



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



