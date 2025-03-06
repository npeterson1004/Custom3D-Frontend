// warehouse.js
import { API_BASE_URL } from "./config.js";

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
                    
                    <button class="btn btn-secondary choose-color-btn" data-product-id="${product._id}">
                        <img src="../assets/images/default-color.png" class="tiny-color-img" style="width: 20px; height: 20px; margin-right: 5px;"> 
                        Choose Color
                    </button>

                    <button class="btn btn-primary add-to-cart-btn" data-product-id="${product._id}">
                        Add to Cart
                    </button>

                    <button class="view-image-btn">
                        View Image
                    </button>
                </div>
            `;

            // ✅ Attach event listener for "Choose Color"
            productCard.querySelector(".choose-color-btn").addEventListener("click", () => {
                openColorModal(product._id, productCard.querySelector(".choose-color-btn"));
            });

            // ✅ Attach event listener for "Add to Cart"
            productCard.querySelector(".add-to-cart-btn").addEventListener("click", () => {
                const colorData = productCard.querySelector(".choose-color-btn").getAttribute("data-selected-color");
                if (!colorData) {
                    alert("⚠️ Please select a color before adding to cart.");
                    return;
                }
                const selectedColor = JSON.parse(colorData);
                addToCart(product.name, product.price, product.image, selectedColor);
            });

            // ✅ Attach event listener for "View Image"
            productCard.querySelector(".view-image-btn").addEventListener("click", () => {
                enlargeImage(product.image.startsWith('http') ? product.image : API_BASE_URL + product.image);
            });

            warehouseContainer.appendChild(productCard);
        });

    } catch (error) {
        console.error("❌ Error fetching warehouse products:", error);
        warehouseContainer.innerHTML = '<p class="text-center text-danger">Failed to load products.</p>';
    }
}

// ✅ Function to open the color selection modal with styling
async function openColorModal(productId, button) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/filament-colors`);
        const colors = await response.json();

        const colorOptionsContainer = document.getElementById("colorOptions");
        colorOptionsContainer.innerHTML = ""; // Clear previous content

        colors.forEach(color => {
            const colorOption = document.createElement("div");
            colorOption.classList.add("color-option", "d-flex", "align-items-center", "m-2", "p-2", "border", "rounded");
            colorOption.style.cursor = "pointer";
            colorOption.style.display = "flex";
            colorOption.style.alignItems = "center";
            colorOption.style.backgroundColor = "#ffffff"; // Default Background
            colorOption.style.transition = "background-color 0.3s ease, color 0.3s ease"; // Smooth effect

            colorOption.innerHTML = `
                <img src="${color.image}" class="color-preview" 
                     style="width: 40px; height: 40px; margin-right: 10px; border: 2px solid black; border-radius: 5px; padding: 2px;">
                <span class="cart-color-text" style="color:#080808; font-size: 20px;">${color.name}</span>
            `;

            // ✅ Change Background and Text Color on Hover
            colorOption.addEventListener("mouseenter", () => {
                colorOption.style.backgroundColor = "#007bff"; // Blue Hover
                colorOption.querySelector(".cart-color-text").style.color = "white"; // White Text
                colorOption.querySelector("img").style.borderColor = "white"; // White border on hover
            });

            colorOption.addEventListener("mouseleave", () => {
                colorOption.style.backgroundColor = "#ffffff"; // Reset Background
                colorOption.querySelector(".cart-color-text").style.color = "#080808"; // Reset Text Color
                colorOption.querySelector("img").style.borderColor = "black"; // Reset Border Color
            });

            // ✅ Click Event to Select Color
            colorOption.addEventListener("click", () => {
                button.innerHTML = `<img src="${color.image}" class="cart-color-img" 
                                    style="width: 20px; height: 20px; margin-right: 5px; border: 2px solid black;"> 
                                    ${color.name}`;
                button.setAttribute("data-selected-color", JSON.stringify(color));
                $("#colorModal").modal("hide"); // Close modal
            });

            colorOptionsContainer.appendChild(colorOption);
        });

        $("#colorModal").modal("show"); // Show the modal

    } catch (error) {
        console.error("Error fetching filament colors:", error);
    }
}


// Function to enlarge image in fullscreen mode & exit on click
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
