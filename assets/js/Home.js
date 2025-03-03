//Home.js


import { API_BASE_URL } from "./config.js";  // ✅ Import API base URL

async function fetchFeaturedProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/products/featured`);
        const products = await response.json();

        const imageContainer = document.getElementById("imageContainer");
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
            viewImageButton.addEventListener("click", () => {
                enlargeImage(product.image.startsWith('http') ? product.image : API_BASE_URL + product.image);
            });
        
            // Append product card to container
            imageContainer.appendChild(productCard);
        });
        

    } catch (error) {
        console.error("Error fetching featured products:", error);
        imageContainer.innerHTML = '<p class="text-center text-danger">Failed to load featured products.</p>';
    }
}

document.addEventListener("DOMContentLoaded", fetchFeaturedProducts);


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




