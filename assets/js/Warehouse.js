// warehouse.js
import { API_BASE_URL } from "./config.js";




function addToCartHandler(productId, button) {
    const productCard = button.closest(".warehouse-item");
    if (!productCard) return;

    const name = productCard.querySelector("h5").innerText;
    const price = parseFloat(productCard.querySelector(".order-price").innerText.replace("$", ""));
    const image = productCard.querySelector(".warehouse-img").src;

    // ✅ Get selected color from the Choose Color button
    const chooseColorButton = productCard.querySelector(".choose-color-btn");
    const selectedColor = chooseColorButton.getAttribute("data-selected-color");

    if (!selectedColor) {
        alert("⚠️ Please select a filament color before adding to the cart.");
        return;
    }

    const color = JSON.parse(selectedColor);

    // ✅ Ensure `addToCart` is called correctly (defined in cart.js)
    if (typeof addToCart !== "function") {
        console.error("❌ addToCart function is not available. Make sure cart.js is loaded.");
        return;
    }

    addToCart(name, price, image, color);
}









document.addEventListener("DOMContentLoaded", fetchWarehouseProducts);

async function fetchWarehouseProducts() {
    try {
         // ✅ Show the loading message before fetching items
         document.getElementById("loadingMessage").style.display = "block";
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

                    <button class="btn btn-info view-image-btn" data-image="${product.image}">
                        View Image
                    </button>
                </div>
            `;

            warehouseContainer.appendChild(productCard);
        });

        // ✅ Attach event listeners for "Choose Color" buttons
        document.querySelectorAll(".choose-color-btn").forEach(button => {
            button.addEventListener("click", function () {
                const productId = this.getAttribute("data-product-id");
                openColorModal(productId, this);
            });
        });

        // ✅ Attach event listeners for "Add to Cart" buttons
        document.querySelectorAll(".add-to-cart-btn").forEach(button => {
            button.addEventListener("click", function () {
                const productId = this.getAttribute("data-product-id");
                addToCartHandler(productId, this);
            });
        });

        // ✅ Attach event listeners for "View Image" buttons
        document.querySelectorAll(".view-image-btn").forEach(button => {
            button.addEventListener("click", function () {
                const imageUrl = this.getAttribute("data-image");
                enlargeImage(imageUrl, false); // ✅ Does NOT return to color modal
            });
        });
         // ✅ Hide the loading message after items are loaded
         document.getElementById("loadingMessage").style.display = "none";

    } catch (error) {
        console.error("❌ Error fetching warehouse products:", error);
    }
}



// ✅ Open the color selection modal with an "Enlarge Image" button
async function openColorModal(productId, button) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/filament-colors`);
        const colors = await response.json();

        const colorOptionsContainer = document.getElementById("colorOptions");
        colorOptionsContainer.innerHTML = ""; // Clear previous content

        colors.forEach(color => {
            const colorOption = document.createElement("div");
            colorOption.classList.add("color-option", "d-flex", "flex-column", "align-items-center", "m-2", "p-3", "border", "rounded");
            colorOption.style.cursor = "pointer";
            colorOption.style.backgroundColor = "#95d9fd"; // ✅ Light Blue Default
            colorOption.style.transition = "background-color 0.3s ease, color 0.3s ease"; // ✅ Smooth hover effect
            colorOption.style.position = "relative"; // ✅ Ensure relative positioning
            colorOption.style.width = "100%"; // ✅ Ensure it scales properly
            colorOption.style.textAlign = "center"; // ✅ Center align content

            // ✅ Change background color on hover
            colorOption.addEventListener("mouseenter", () => {
                colorOption.style.backgroundColor = color.images[0]; // ✅ Use first filament color image as background
            });
            colorOption.addEventListener("mouseleave", () => {
                colorOption.style.backgroundColor = "#95d9fd"; // ✅ Reset to default
            });

            // ✅ Add Color Box and "Enlarge Image" Button
            colorOption.innerHTML = `
                <div class="image-container d-flex align-items-center justify-content-center">
                    <button class="arrow-btn left-arrow" data-color-id="${color._id}">⬅</button>
                    <img src="${color.images[0]}" class="color-preview" data-index="0" data-color-id="${color._id}" width="50">
                    <button class="arrow-btn right-arrow" data-color-id="${color._id}">➡</button>
                </div>
                <div class="color-details d-flex flex-column align-items-center mt-2">
                    <p class="cart-color-text" style="margin: 0; font-size: 14px; font-weight: bold;">${color.name}</p>
                    <button class="btn enlarge-color-btn mt-1"
                        data-image="${color.images[0]}" 
                        style="
                        background-color: #034a92; /* ✅ Darker Blue */
                        color: white;
                        width: 50px; /* ✅ Smaller Button */
                        height: 25px;
                        font-size: 12px;
                        padding: 3px;
                        text-align: center;
                        ">
                        🔍
                    </button>
                </div>
            `;

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
