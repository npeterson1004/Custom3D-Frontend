// cart.js - Handles cart functionality

import { API_BASE_URL } from "./config.js";
// ✅ Attach Global Event Listeners
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;

document.addEventListener("DOMContentLoaded", function () {
    const cartContainer = document.getElementById("cart-items");
    if (!cartContainer) {
        console.warn("⚠️ Cart element not found. Skipping cart update.");
        return; // ✅ Exit script if cart does not exist
    }

    loadCart();
});




// ✅ Load Cart from Local Storage
function loadCart() {
    let userEmail = localStorage.getItem("userEmail");
    if (!userEmail) return;

    const cartItemsContainer = document.getElementById("cart-items");
    if (!cartItemsContainer) return;

    let cart = JSON.parse(localStorage.getItem(`cart_${userEmail}`)) || [];
    const cartTotal = document.getElementById("cart-total");
    const cartCountElements = document.querySelectorAll("#cart-count");

    // ✅ Update cart count across all pages
    cartCountElements.forEach(cartCount => {
        cartCount.innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
    });

    cartItemsContainer.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<tr><td colspan="6" class="text-center">Your cart is empty</td></tr>';
    } else {
        cart.forEach((item, index) => {
            let itemTotal = item.price * item.quantity;
            total += itemTotal;
/*
            // ✅ FIX: Ensure Cloudinary URLs are used correctly
            let imageUrl = item.image;

            // ✅ If the image URL starts with "//", prepend "https:"
            if (imageUrl.startsWith("//")) {
                imageUrl = `https:${imageUrl}`;
            }

            // ✅ If the image URL is from Cloudinary, do NOT add API_BASE_URL
            if (imageUrl.includes("cloudinary.com")) {
                imageUrl = imageUrl.replace("https//", "https://"); // Fix missing colon if needed
            } else if (!imageUrl.startsWith("http")) {
                imageUrl = `${API_BASE_URL}${imageUrl}`; // ✅ Only apply API_BASE_URL to local images
            }

            // ✅ Log the final image URL for debugging
            console.log(`📸 Image URL for ${item.name}: ${imageUrl}`);
*/
            cartItemsContainer.innerHTML += `
                <tr>
                    <td> alt="${item.name}"></td>
                    <td>${item.name}</td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>
                        <input type="number" value="${item.quantity}" min="1" 
                            onchange="updateQuantity(${index}, this.value)" 
                            class="cart-quantity-input">
                    </td>
                    <td>$${itemTotal.toFixed(2)}</td>
                    <td><button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">Remove</button></td>
                </tr>
            `;
        });
    }

    if (cartTotal) {
        cartTotal.innerText = total.toFixed(2);
    }
}



// ✅ Add Item to Cart
function addToCart(name, price, image) {
    let userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
        alert("⚠️ You must log in to add items to the cart.");
        return;
    }

    let cart = JSON.parse(localStorage.getItem(`cart_${userEmail}`)) || [];

    // ✅ Ensure Cloudinary URLs are stored correctly
    let fixedImage = image.startsWith("http") ? image : `${API_BASE_URL}${image}`;

    let existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, image: fixedImage, quantity: 1 });
    }

    localStorage.setItem(`cart_${userEmail}`, JSON.stringify(cart));
    showNotification(`${name} added to cart!`);
    loadCart();
}


// ✅ Remove Item from Cart
function removeFromCart(index) {
    let userEmail = localStorage.getItem("userEmail");
    if (!userEmail) return;

    let cart = JSON.parse(localStorage.getItem(`cart_${userEmail}`)) || [];
    cart.splice(index, 1);
    localStorage.setItem(`cart_${userEmail}`, JSON.stringify(cart));
    loadCart();
}

// ✅ Function to update the cart count
function updateCartCount() {
    let userEmail = localStorage.getItem("userEmail");
    let cart = JSON.parse(localStorage.getItem(`cart_${userEmail}`)) || [];
    const cartCountElement = document.getElementById("cart-count");

    if (cartCountElement) {
        cartCountElement.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }
}

// ✅ Make updateCartCount globally accessible
window.updateCartCount = updateCartCount;



// ✅ Update Quantity in Cart
function updateQuantity(index, quantity) {
    let userEmail = localStorage.getItem("userEmail");
    if (!userEmail) return;

    let cart = JSON.parse(localStorage.getItem(`cart_${userEmail}`)) || [];
    if (quantity < 1) quantity = 1;
    cart[index].quantity = parseInt(quantity);
    localStorage.setItem(`cart_${userEmail}`, JSON.stringify(cart));
    loadCart();
}

// Clear Cart on Logout
window.logout = function () {
    let userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
        localStorage.removeItem(`cart_${userEmail}`); // ✅ Remove user-specific cart
    }
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    window.location.href = "login.html";
};



// Show Notification Function
function showNotification(message) {
    // Remove any existing notifications before adding a new one
    let existingNotification = document.querySelector(".cart-notification");
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification div
    let notification = document.createElement("div");
    notification.className = "cart-notification";
    notification.innerText = message;
    document.body.appendChild(notification);

    // Automatically fade out and remove notification
    setTimeout(() => {
        notification.style.opacity = "0";
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 500);
    }, 2000);
}

// Apply CSS for Notification
const styles = document.createElement("style");
styles.innerHTML = `
    .cart-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        font-size: 16px;
        box-shadow: 0px 4px 6px rgba(0,0,0,0.1);
        z-index: 1000;
        opacity: 1;
        transition: opacity 0.5s ease-out;
    }
`;
document.head.appendChild(styles);




// ✅ Load cart when the page is ready
document.addEventListener("DOMContentLoaded", loadCart);