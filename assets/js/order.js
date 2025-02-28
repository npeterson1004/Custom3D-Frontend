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

    // ✅ Retrieve cart using user-specific key
    let cart = JSON.parse(localStorage.getItem(`cart_${userEmail}`)) || [];

    if (cart.length === 0) {
        alert("⚠️ Your cart is empty.");
        return;
    }

    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    const orderData = { userEmail, items: cart, totalAmount };

    try {
        const response = await fetch(`${API_BASE_URL}/api/orders`, {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            throw new Error("❌ Order failed to send.");
        }

        alert("✅ Your order has been placed successfully!");

        // ✅ Clear only this user's cart
        localStorage.removeItem(`cart_${userEmail}`);
        loadCart();

    } catch (error) {
        console.error("❌ Error placing order:", error);
        alert("❌ Order failed. Please try again.");
    }
}

// ✅ Make sendOrder globally accessible
window.sendOrder = sendOrder;

