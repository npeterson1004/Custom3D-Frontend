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
                <div class="image-container">
                    <button class="arrow-btn left-arrow" data-product-id="${product._id}">⬅</button>
                    <img src="${product.image}" class="product-image" data-index="0" data-product-id="${product._id}" width="120">
                    <button class="arrow-btn right-arrow" data-product-id="${product._id}">➡</button>
                </div>
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

        // Attach event listeners for image switching
        document.querySelectorAll(".arrow-btn").forEach(button => {
            button.addEventListener("click", async function () {
                const productId = this.getAttribute("data-product-id");
                const imgElement = document.querySelector(`img[data-product-id='${productId}']`);
                const currentIndex = parseInt(imgElement.getAttribute("data-index"), 10);

                // Fetch available filament colors for this product
                const response = await fetch(`${API_BASE_URL}/api/filament-colors`);
                const colors = await response.json();

                if (!colors || colors.length === 0) return;

                let color = colors.find(c => c._id === productId);
                if (!color || color.images.length < 2) return;

                let newIndex = currentIndex === 0 ? 1 : 0;
                imgElement.src = color.images[newIndex];
                imgElement.setAttribute("data-index", newIndex);
            });
        });

    } catch (error) {
        console.error("❌ Error fetching warehouse products:", error);
    }
}


// ✅ Function to open the color selection modal with proper styling
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
            colorOption.style.backgroundColor = "#95d9fd"; // ✅ Light Blue Background
            colorOption.style.transition = "background-color 0.3s ease, color 0.3s ease"; // ✅ Smooth effect

            colorOption.innerHTML = `
                <img src="${color.image}" class="color-preview" 
                     style="width: 40px; height: 40px; margin-right: 10px; border: 2px solid black; border-radius: 5px;">
                <span class="cart-color-text" style="color:#080808; font-size: 20px;">${color.name}</span>
            `;

            // ✅ Change Background and Text Color on Hover (but keep border black)
            colorOption.addEventListener("mouseenter", () => {
                colorOption.style.backgroundColor = "#034a92"; // ✅ Dark Blue Hover
                colorOption.querySelector(".cart-color-text").style.color = "white"; // ✅ White Text
            });

            colorOption.addEventListener("mouseleave", () => {
                colorOption.style.backgroundColor = "#7acdfa"; // ✅ Reset Background
                colorOption.querySelector(".cart-color-text").style.color = "#080808"; // ✅ Reset Text Color
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
