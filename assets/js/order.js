//order.js
import { API_BASE_URL } from "./config.js";

// ✅ Send Order to Admin
async function sendOrder() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const token = localStorage.getItem("token") || localStorage.getItem("adminToken");

    if (!token) {
        alert("⚠️ Please log in to place an order.");
        window.location.href = "login.html";
        return;
    }

    if (cart.length === 0) {
        alert("⚠️ Your cart is empty.");
        return;
    }

    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const userEmail = localStorage.getItem("userEmail");

    const orderData = { userEmail, items: cart, totalAmount };

    try {
        const response = await fetch(`${API_BASE_URL}/api/orders`, {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(orderData)
        });

        const result = await response.json();

        if (response.ok) {
            alert("✅ Order placed successfully!");
            localStorage.removeItem("cart");
            updateCartCount(); // ✅ Reset cart count after placing order
            loadCart();
        } else {
            alert(`❌ Error: ${result.error}`);
        }
    } catch (error) {
        console.error("❌ Error placing order:", error);
        alert("❌ Failed to place order.");
    }
}

// ✅ Make sendOrder globally accessible
window.sendOrder = sendOrder;

