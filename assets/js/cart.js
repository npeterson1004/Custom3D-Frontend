// cart.js - Handles cart functionality
document.addEventListener("DOMContentLoaded", function () {
    loadCart();
});
import { API_BASE_URL } from "./config.js";
// Load Cart from Local Storage
function loadCart() {
    let userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
        console.warn("⚠️ No user email found. Please log in.");
        return;
    }

    let cart = JSON.parse(localStorage.getItem(`cart_${userEmail}`)) || [];
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const cartCountElements = document.querySelectorAll("#cart-count");

    // ✅ Update cart count across all pages
    cartCountElements.forEach(cartCount => {
        cartCount.innerText = cart.length;
    });

    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<tr><td colspan="6" class="text-center">Your cart is empty</td></tr>';
    } else {
        cart.forEach((item, index) => {
            let itemTotal = item.price * item.quantity;
            total += itemTotal;

            cartItemsContainer.innerHTML += `
    <tr>
        <td><img src="${item.image}" width="50" alt="${item.name}"></td>
        <td>${item.name}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td>
            <input type="number" value="${item.quantity}" min="1" 
                onchange="updateQuantity(${index}, this.value)" 
                style="color: white; background-color: #333; text-align: center; width: 60px;">
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

// Add Item to Cart
function addToCart(name, price, image) {
    let userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
        alert("You must log in to add items to the cart.");
        return;
    }

    let cart = JSON.parse(localStorage.getItem(`cart_${userEmail}`)) || [];

    let existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name, price, image, quantity: 1 });
    }

    localStorage.setItem(`cart_${userEmail}`, JSON.stringify(cart));
    loadCart(); // Update UI
    showNotification(`${name} has been added to your cart!`);
}

// Remove Item from Cart
function removeFromCart(index) {
    let userEmail = localStorage.getItem("userEmail");
    if (!userEmail) return;

    let cart = JSON.parse(localStorage.getItem(`cart_${userEmail}`)) || [];
    cart.splice(index, 1);
    localStorage.setItem(`cart_${userEmail}`, JSON.stringify(cart));
    loadCart();
}

// Update Quantity
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



async function sendOrder() {
    let userEmail = localStorage.getItem("userEmail");
    
    if (!userEmail) {
        alert("Error: No user email found. Please log in first.");
        return;
    }

    let cart = JSON.parse(localStorage.getItem(`cart_${userEmail}`)) || [];

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    console.log("📢 userEmail from localStorage:", userEmail); // Debugging

    const orderDetails = {
        userEmail: userEmail.trim(), // Ensure email is not empty
        items: cart,
        totalAmount: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        orderDate: new Date().toISOString()
    };

    try {
        const response = await fetch(`${API_BASE_URL}/api/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(orderDetails)
        });

        if (!response.ok) {
            throw new Error("Failed to send order.");
        }

        console.log("✅ Order sent successfully:", orderDetails);

        // ✅ Clear only the user's cart after successful order placement
        if (response.ok) {
            localStorage.removeItem(`cart_${userEmail}`);
        }
        loadCart(); // Update UI
        alert("Your order has been placed successfully!");

    } catch (error) {
        console.error("Error sending order:", error);
        alert("Failed to place order. Please try again.");
    }
}



