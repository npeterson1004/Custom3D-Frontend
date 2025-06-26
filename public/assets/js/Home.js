//Home.js
import { API_BASE_URL } from "./config.js";

document.addEventListener("DOMContentLoaded", fetchFeaturedProducts);

async function fetchFeaturedProducts() {
    try {
         // ✅ Show the loading message before fetching items
         document.getElementById("loadingMessage").style.display = "block";
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
        // ✅ Hide the loading message after items are loaded
        document.getElementById("loadingMessage").style.display = "none";
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
        colorOptionsContainer.innerHTML = ""; // ✅ Clear previous content

        colors.forEach(color => {
            const colorOption = document.createElement("div");
            colorOption.classList.add(
                "color-option",
                "d-flex",
                "flex-column",
                "align-items-center",
                "m-2",
                "p-2",
                "border",
                "rounded"
            );
            colorOption.style.cursor = "pointer";
            colorOption.style.backgroundColor = "#95d9fd"; // ✅ Light Blue Background
            colorOption.style.transition = "background-color 0.3s ease, color 0.3s ease";
            colorOption.style.width = "100%"; // ✅ Full width for alignment
            colorOption.style.maxWidth = "600px"; // ✅ Makes the color box extend fully
            colorOption.style.position = "relative"; // ✅ Ensure correct positioning
            colorOption.style.display = "flex";
            colorOption.style.flexDirection = "column";
            colorOption.style.justifyContent = "center";
            colorOption.style.alignItems = "center";

            // ✅ Add Color Box with Image Switcher and "Enlarge Image" Button
            colorOption.innerHTML = `
                <div class="image-container d-flex align-items-center justify-content-between w-100">
                    <button class="arrow-btn left-arrow" data-color-id="${color._id}">⬅</button>
                    <img src="${color.images[0]}" class="color-preview" data-index="0" data-color-id="${color._id}" width="80">
                    <button class="arrow-btn right-arrow" data-color-id="${color._id}">➡</button>
                </div>
                <p class="text-center cart-color-text mt-1" style="font-size: 16px; font-weight: bold;">${color.name}</p>
                <button class="btn enlarge-color-btn mt-1" data-image="${color.images[0]}" 
                        style="
                        background-color: #022c5e; /* ✅ Darker Blue */
                        color: white;
                        width: 150px; /* ✅ Proper width */
                        height: 35px; /* ✅ Proper height */
                        font-size: 14px;
                        border-radius: 5px;
                        margin-top: 5px;
                        ">
                    🔍 Enlarge Image
                </button>
            `;

            // ✅ Change background color when hovering over color box
            colorOption.addEventListener("mouseenter", () => {
                colorOption.style.backgroundColor = "#034a92"; // ✅ Dark Blue Hover
                colorOption.querySelector(".cart-color-text").style.color = "white";
            });

            colorOption.addEventListener("mouseleave", () => {
                colorOption.style.backgroundColor = "#95d9fd"; // ✅ Reset Background
                colorOption.querySelector(".cart-color-text").style.color = "#000";
            });

            // ✅ Ensure clicking anywhere in the color box (except buttons) selects the color
            colorOption.addEventListener("click", (event) => {
                if (!event.target.classList.contains("arrow-btn") && !event.target.classList.contains("enlarge-color-btn")) {
                    button.innerHTML = `<img src="${color.images[0]}" class="cart-color-img" 
                                        style="width: 20px; height: 20px; margin-right: 5px; border: 2px solid black;"> 
                                        ${color.name}`;
                    button.setAttribute("data-selected-color", JSON.stringify(color));
                    $("#colorModal").modal("hide"); // ✅ Close modal ONLY on selection
                }
            });

            // ✅ Add event listener to enlarge image
            colorOption.querySelector(".enlarge-color-btn").addEventListener("click", function (event) {
                event.stopPropagation(); // ✅ Prevent clicking from selecting the color
                const imageUrl = this.getAttribute("data-image");
                enlargeImage(imageUrl, true); // ✅ Returns to color modal
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

