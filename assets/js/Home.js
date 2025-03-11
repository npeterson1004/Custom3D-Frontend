//Home.js
import { API_BASE_URL } from "./config.js";

document.addEventListener("DOMContentLoaded", fetchFeaturedProducts);

async function fetchFeaturedProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/products/featured`);
        const products = await response.json();

        const featuredContainer = document.getElementById("featuredContainer");
        if (!featuredContainer) {
            console.error("Error: 'featuredContainer' not found.");
            return;
        }

        featuredContainer.innerHTML = ""; // Clear existing content

        if (products.length === 0) {
            featuredContainer.innerHTML = '<p class="text-center">No featured products available.</p>';
            return;
        }

        products.forEach(product => {
            const productCard = document.createElement("div");
            productCard.classList.add("warehouse-item"); // ✅ Use the same class as warehouse

            productCard.innerHTML = `
                <img src="${product.image.startsWith('http') ? product.image : API_BASE_URL + product.image}" 
                     class="warehouse-img" 
                     alt="${product.name}">
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

                    <button class="btn btn-info view-image-btn" data-image="${product.image}">
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
            productCard.querySelector(".view-image-btn").addEventListener("click", function () {
                const imageUrl = this.getAttribute("data-image");
                enlargeImage(imageUrl, false); // ✅ Does NOT return to color modal
            });

            featuredContainer.appendChild(productCard);
        });

    } catch (error) {
        console.error("❌ Error fetching featured products:", error);
        featuredContainer.innerHTML = '<p class="text-center text-danger">Failed to load featured products.</p>';
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
            colorOption.style.position = "relative"; // ✅ Ensure relative positioning

            // ✅ Add "Enlarge Image" button aligned to the right
            colorOption.innerHTML = `
                <div class="image-container" style="display: flex; align-items: center;">
                    <button class="arrow-btn left-arrow" data-color-id="${color._id}">⬅</button>
                    <img src="${color.images[0]}" class="color-preview" data-index="0" data-color-id="${color._id}" width="50">
                    <button class="arrow-btn right-arrow" data-color-id="${color._id}">➡</button>
                </div>
                <p class="text-center cart-color-text">${color.name}</p>
                <button class="btn enlarge-color-btn" data-image="${color.images[0]}" 
                        style="
                        background-color: #034a92; /* ✅ Darker Blue */
                        color: white;
                        position: absolute; 
                        right: 10px; /* ✅ Push to the right */
                        bottom: 10px; /* ✅ Align to the bottom */
                        ">
                    Enlarge Image
                </button>
            `;

            // ✅ Add event listener to enlarge image (pass `true` to return to color modal)
            colorOption.querySelector(".enlarge-color-btn").addEventListener("click", function () {
                const imageUrl = this.getAttribute("data-image");
                enlargeImage(imageUrl, true); // ✅ Now it knows to return to color modal
                $("#colorModal").modal("hide"); // ✅ Hide modal before enlarging
            });

            colorOptionsContainer.appendChild(colorOption);
        });

        // ✅ Attach event listeners for arrows to switch images
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

                // ✅ Update enlarge button with new image
                const enlargeButton = imgElement.closest(".color-option").querySelector(".enlarge-color-btn");
                if (enlargeButton) {
                    enlargeButton.setAttribute("data-image", color.images[newIndex]);
                }
            });
        });

        $("#colorModal").modal("show"); // ✅ Show the modal

    } catch (error) {
        console.error("Error fetching filament colors:", error);
    }
}






// ✅ Function to enlarge image and return to color modal if it was open
function enlargeImage(imgSrc, isFromColorModal = false) {
    let popupImg = document.createElement("img");
    popupImg.src = imgSrc;
    popupImg.classList.add("fullscreen-img");

    let fullscreenOverlay = document.createElement("div");
    fullscreenOverlay.classList.add("fullscreen-overlay");

    fullscreenOverlay.appendChild(popupImg);
    document.body.appendChild(fullscreenOverlay);

    // ✅ Close fullscreen image and reopen color modal if it was open
    fullscreenOverlay.onclick = function () {
        fullscreenOverlay.remove();
        if (isFromColorModal) {
            $("#colorModal").modal("show"); // ✅ Reopen color modal
        }
    };

    // ✅ Enter fullscreen mode
    fullscreenOverlay.requestFullscreen().catch(err => {
        console.warn("Fullscreen request failed", err);
    });
}

