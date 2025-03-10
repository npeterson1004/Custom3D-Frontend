// warehouse.js
import { API_BASE_URL } from "./config.js";

document.addEventListener("DOMContentLoaded", fetchWarehouseProducts);

async function fetchWarehouseProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/products`);
        const products = await response.json();

        const warehouseContainer = document.getElementById("warehouseContainer");
        warehouseContainer.innerHTML = ""; // Clear existing content

        if (products.length === 0) {
            warehouseContainer.innerHTML = '<p class="text-center">No products available.</p>';
            return;
        }

        products.forEach(product => {
            const productCard = document.createElement("div");
            productCard.classList.add("warehouse-item");

            productCard.innerHTML = `
                <img src="${product.image}" class="warehouse-img" alt="${product.name}" width="150">
                <div class="warehouse-details">
                    <h5>${product.name}</h5>
                    <p>${product.description}</p>
                    <p class="order-price">$${product.price}</p>

                    <button class="btn btn-secondary choose-color-btn" data-product-id="${product._id}">
                        Choose Color
                    </button>

                    <button class="btn btn-primary add-to-cart-btn" data-product-id="${product._id}">
                        Add to Cart
                    </button>
                </div>
            `;

            warehouseContainer.appendChild(productCard);
        });

        // ✅ Attach event listeners for Choose Color buttons
        document.querySelectorAll(".choose-color-btn").forEach(button => {
            button.addEventListener("click", function () {
                const productId = this.getAttribute("data-product-id");
                openColorModal(productId, this);
            });
        });

        // ✅ Attach event listeners for Add to Cart buttons
        document.querySelectorAll(".add-to-cart-btn").forEach(button => {
            button.addEventListener("click", function () {
                const productId = this.getAttribute("data-product-id");
                addToCartHandler(productId, this);
            });
        });

    } catch (error) {
        console.error("❌ Error fetching warehouse products:", error);
    }
}


// ✅ Open the color selection modal with arrows to switch images
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
            colorOption.style.backgroundColor = "#95d9fd"; // ✅ Light Blue Background
            colorOption.style.transition = "background-color 0.3s ease, color 0.3s ease"; // ✅ Smooth effect

            // ✅ Separate arrow buttons so they do NOT trigger color selection
            colorOption.innerHTML = `
                <div class="image-container" style="display: flex; align-items: center;">
                    <button class="arrow-btn left-arrow" data-color-id="${color._id}">⬅</button>
                    <img src="${color.images[0]}" class="color-preview" data-index="0" data-color-id="${color._id}" width="50">
                    <button class="arrow-btn right-arrow" data-color-id="${color._id}">➡</button>
                </div>
                <p class="text-center cart-color-text">${color.name}</p>
            `;

            // ✅ Only select color when clicking outside of arrows
            colorOption.addEventListener("click", (event) => {
                if (!event.target.classList.contains("arrow-btn")) { // ✅ Prevent arrow clicks from closing the modal
                    button.innerHTML = `<img src="${color.images[0]}" class="cart-color-img" 
                                        style="width: 20px; height: 20px; margin-right: 5px; border: 2px solid black;"> 
                                        ${color.name}`;
                    button.setAttribute("data-selected-color", JSON.stringify(color));
                    $("#colorModal").modal("hide"); // ✅ Close modal ONLY on selection
                }
            });

            colorOptionsContainer.appendChild(colorOption);
        });

        // ✅ Attach event listeners for arrows to switch images (Fixes your issue)
        document.querySelectorAll(".arrow-btn").forEach(arrow => {
            arrow.addEventListener("click", function (event) {
                event.stopPropagation(); // ✅ Prevent modal from closing

                const colorId = this.getAttribute("data-color-id");
                const imgElement = document.querySelector(`img[data-color-id='${colorId}']`);
                const currentIndex = parseInt(imgElement.getAttribute("data-index"), 10);

                const color = colors.find(c => c._id === colorId);
                if (!color || color.images.length < 2) return;

                let newIndex = currentIndex === 0 ? 1 : 0;
                imgElement.src = color.images[newIndex];
                imgElement.setAttribute("data-index", newIndex);
            });
        });

        $("#colorModal").modal("show"); // ✅ Show the modal

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
