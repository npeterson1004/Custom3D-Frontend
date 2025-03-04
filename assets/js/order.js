//order.js
import { API_BASE_URL } from "./config.js";

// ✅ Send Order to Admin
async function sendOrder() {
    let userEmail = localStorage.getItem("userEmail");

    if (!userEmail) {
        alert("⚠️ Please log in to place an order.");
        window.location.href = "login.html";
        return;
    }

    let cart = JSON.parse(localStorage.getItem(`cart_${userEmail}`)) || [];

    if (cart.length === 0) {
        alert("⚠️ Your cart is empty.");
        return;
    }

    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const orderData = { userEmail, items: cart, totalAmount };

    // ✅ Show Processing Message
    showOrderProcessingMessage();

    try {
        const response = await fetch(`${API_BASE_URL}/api/orders`, {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            throw new Error("❌ Order failed to send.");
        }

        // ✅ Show Order Confirmation Message (Tap to Dismiss)
        showOrderConfirmationMessage();

        // ✅ Clear only this user's cart
        localStorage.removeItem(`cart_${userEmail}`);

        // ✅ Ensure updateCartCount() exists before calling it
        if (typeof updateCartCount === "function") {
            updateCartCount();
        } else {
            console.warn("⚠️ updateCartCount is not available.");
        }

        loadCart();

    } catch (error) {
        console.error("❌ Error placing order:", error);
        alert("❌ Order failed. Please try again.");
    }
}

// ✅ Function to Show Order Processing Message
function showOrderProcessingMessage() {
    removeExistingMessage();

    let messageBox = document.createElement("div");
    messageBox.id = "order-message";
    messageBox.className = "order-notification processing";
    messageBox.innerText = "🕒 Processing your order... You will receive a confirmation email if your order is confirmed.";

    document.body.appendChild(messageBox);
}

// ✅ Function to Show Order Confirmation Message (Tap to Dismiss)
function showOrderConfirmationMessage() {
    removeExistingMessage();

    let messageBox = document.createElement("div");
    messageBox.id = "order-message";
    messageBox.className = "order-notification confirmed";
    messageBox.innerText = "✅ Your order has been placed! Tap to close.";

    // ✅ Close message when user clicks it
    messageBox.addEventListener("click", () => {
        messageBox.style.opacity = "0";
        setTimeout(() => messageBox.remove(), 300);
    });

    document.body.appendChild(messageBox);
}

// ✅ Function to Remove Any Existing Message Before Showing a New One
function removeExistingMessage() {
    const existingMessage = document.getElementById("order-message");
    if (existingMessage) existingMessage.remove();
}

// ✅ Make sendOrder globally accessible
window.sendOrder = sendOrder;

// ✅ Apply CSS for Notification Messages
const styles = document.createElement("style");
styles.innerHTML = `
    .order-notification {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #007bff;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        font-size: 16px;
        box-shadow: 0px 4px 6px rgba(0,0,0,0.1);
        z-index: 1000;
        cursor: pointer;
        transition: opacity 0.3s ease-out;
    }

    .order-notification.processing {
        background: #ffc107; /* Yellow for processing */
    }

    .order-notification.confirmed {
        background: #28a745; /* Green for confirmed */
    }

    .order-notification:hover {
        opacity: 0.8;
    }
`;
document.head.appendChild(styles);
