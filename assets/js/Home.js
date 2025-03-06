//Home.js
import { API_BASE_URL } from "./config.js";

document.addEventListener("DOMContentLoaded", fetchFeaturedProducts);

async function fetchFeaturedProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/products/featured`);
        const products = await response.json();

        const imageContainer = document.getElementById("featuredContainer");
        if (!imageContainer) {
            console.error("Error: 'imageContainer' not found.");
            return;
        }

        imageContainer.innerHTML = ""; // Clear existing content

        if (products.length === 0) {
            imageContainer.innerHTML = '<p class="text-center">No featured products available.</p>';
            return;
        }

        products.forEach(product => {
            const productCard = document.createElement("div");
            productCard.classList.add("featured-item");

            productCard.innerHTML = `
                <img src="${product.image.startsWith('http') ? product.image : API_BASE_URL + product.image}" 
                     class="featured-img" 
                     alt="${product.name}">
                <div class="featured-details">
                    <h5>${product.name}</h5>
                    <p>${product.description}</p>
                    <p class="order-price">$${product.price}</p>
                    <button class="btn btn-primary choose-color-btn" data-product-id="${product._id}">
                        Choose Color
                    </button>
                    <div class="selected-color" id="selected-color-${product._id}">
                        <span>No color selected</span>
                    </div>
                    <button class="btn btn-primary add-to-cart-btn" data-product-id="${product._id}">
                        Add to Cart
                    </button>
                    <button class="view-image-btn">
                        View Image
                    </button>
                </div>
            `;

            // Attach event listener to "View Image" button
            productCard.querySelector(".view-image-btn").addEventListener("click", () => {
                enlargeImage(product.image.startsWith('http') ? product.image : API_BASE_URL + product.image);
            });

            // Attach event listener to "Choose Color" button
            productCard.querySelector(".choose-color-btn").addEventListener("click", async () => {
                await openColorSelection(product._id);
            });

            // ✅ FIXED: Correctly pass parameters to `addToCart`
            productCard.querySelector(".add-to-cart-btn").addEventListener("click", () => {
                const selectedColorElement = document.getElementById(`selected-color-${product._id}`);
                const colorData = selectedColorElement.dataset.color 
                    ? JSON.parse(selectedColorElement.dataset.color) 
                    : null;

                addToCart(product.name, product.price, product.image, colorData);
            });

            // Append product card to container
            imageContainer.appendChild(productCard);
        });

    } catch (error) {
        console.error("Error fetching featured products:", error);
        imageContainer.innerHTML = '<p class="text-center text-danger">Failed to load featured products.</p>';
    }
}

// ✅ Open color selection modal
async function openColorSelection(productId) {
    try {
        const colors = await fetchFilamentColors();
        if (colors.length === 0) {
            alert("No colors available.");
            return;
        }

        let colorOptions = colors.map(color => `
            <div class="color-option" onclick="selectColor('${productId}', '${color.name}', '${color.image}')">
                <img src="${color.image}" alt="${color.name}" class="cart-color-img">
                <span>${color.name}</span>
            </div>
        `).join("");

        const colorModal = document.createElement("div");
        colorModal.classList.add("color-modal");
        colorModal.innerHTML = `
            <div class="color-modal-content">
                <span class="close-modal" onclick="closeColorModal()">&times;</span>
                <h3>Select a Color</h3>
                <div class="color-options">${colorOptions}</div>
            </div>
        `;
        document.body.appendChild(colorModal);
    } catch (error) {
        console.error("Error loading colors:", error);
    }
}

// ✅ Select a color and update UI
window.selectColor = function (productId, colorName, colorImage) {
    const selectedColorElement = document.getElementById(`selected-color-${productId}`);
    selectedColorElement.innerHTML = `<img src="${colorImage}" class="selected-color-img"> <span>${colorName}</span>`;
    selectedColorElement.dataset.color = JSON.stringify({ name: colorName, image: colorImage });

    closeColorModal();
};

// ✅ Close color modal
window.closeColorModal = function () {
    document.querySelector(".color-modal").remove();
};


// ✅ Function to enlarge image in fullscreen mode & exit on click
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

