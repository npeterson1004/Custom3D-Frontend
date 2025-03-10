// cart.js - Handles cart functionality

import { API_BASE_URL } from "./config.js";
// ✅ Attach Global Event Listeners
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.loadCart = loadCart;

document.addEventListener("DOMContentLoaded", function () {
    const cartContainer = document.getElementById("cart-items");
    if (!cartContainer) {
        console.warn("⚠️ Cart element not found. Skipping cart update.");
        return; // ✅ Exit script if cart does not exist
    }

    loadCart();
});




// ✅ Add Item to Cart
function addToCart(name, price, image, color) {
    let userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
        alert("⚠️ You must log in to add items to the cart.");
        return;
    }

    let cart = JSON.parse(localStorage.getItem(`cart_${userEmail}`)) || [];

    // ✅ Ensure Cloudinary URLs are stored correctly
    let fixedImage = image.startsWith("http") ? image : `${API_BASE_URL}${image}`;

    // ✅ Ensure color object has both images before adding to cart
    if (!color || !color.images || color.images.length < 2) {
        alert("⚠️ Please select a valid filament color.");
        return;
    }

    let existingItem = cart.find(item => item.name === name && item.color.name === color.name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ 
            name, 
            price, 
            image: fixedImage, 
            quantity: 1, 
            color: {
                name: color.name,
                images: color.images // ✅ Store both images
            }
        });
    }

    localStorage.setItem(`cart_${userEmail}`, JSON.stringify(cart));

    updateCartCount();
    showNotification(`${name} in ${color.name} added to cart!`);
    loadCart();
}



// ✅ Update Cart UI to Show Selected Color
function loadCart() {
    let userEmail = localStorage.getItem("userEmail");
    if (!userEmail) return;

    const cartItemsContainer = document.getElementById("cart-items");
    if (!cartItemsContainer) return;

    let cart = JSON.parse(localStorage.getItem(`cart_${userEmail}`)) || [];
    const cartTotal = document.getElementById("cart-total");
    const cartCountElements = document.querySelectorAll("#cart-count");

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

            let imageUrl = item.image.startsWith("http") ? item.image : `${API_BASE_URL}${item.image}`;

            // ✅ Ensure color exists, otherwise show default
            let colorImageUrl = (item.color && item.color.images) ? item.color.images[0] : "../assets/images/default-color.png";
            let colorName = item.color ? item.color.name : "No Color Selected";

            cartItemsContainer.innerHTML += `
                <tr>
                    <td><img src="${imageUrl}" alt="${item.name}" class="cart-item-img"></td>
                    <td>${item.name}</td>
                    <td> 
                    <div style="display: flex; flex-direction: column; align-items: center;">
                    <img src="${colorImageUrl[0]}" alt="${colorName}" class="cart-color-img">
                    <img src="${colorImageUrl[1]}" alt="${colorName}" class="cart-color-img">
                    </div>
                    </td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>${colorName}</td>
                    <td>
                        <input type="number" class="form-control cart-quantity-input" min="1" value="${item.quantity}" 
                        onchange="updateCartItem(${index}, this.value)">
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




// ✅ Remove Item from Cart
function removeFromCart(index) {
    let userEmail = localStorage.getItem("userEmail");
    if (!userEmail) return;

    let cart = JSON.parse(localStorage.getItem(`cart_${userEmail}`)) || [];
    cart.splice(index, 1);
    localStorage.setItem(`cart_${userEmail}`, JSON.stringify(cart));
    loadCart();
}

// ✅ Function to update the cart count across all pages
function updateCartCount() {
    let userEmail = localStorage.getItem("userEmail");
    if (!userEmail) return;

    let cart = JSON.parse(localStorage.getItem(`cart_${userEmail}`)) || [];
    const cartCountElements = document.querySelectorAll("#cart-count");

    cartCountElements.forEach(cartCount => {
        cartCount.innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
    });
}

// ✅ Make updateCartCount globally accessible
window.updateCartCount = updateCartCount;

// ✅ Run updateCartCount when the page loads
document.addEventListener("DOMContentLoaded", updateCartCount);



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