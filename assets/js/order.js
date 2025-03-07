//order.js
import { API_BASE_URL } from "./config.js";

/* ✅ Confirm Order (Creates Order in Database) */
async function confirmOrder() {
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

    const orderData = {
        userEmail,
        items: cart.map(item => ({
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: item.quantity,
            color: item.color ? { name: item.color.name, image: item.color.image } : null
        })),
        totalAmount,
        paymentMethod: "Venmo", // ✅ Fix: Ensure payment method is included
        paymentStatus: "Pending"
    };

    try {
        showOrderProcessingMessage(); // ✅ Show processing message

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
            throw new Error("❌ Order failed to create.");
        }

        const orderResponse = await response.json();

        // ✅ Store Order ID for Payment Processing
        localStorage.setItem("orderId", orderResponse.order._id);

        // ✅ Show Order Confirmation Message
        showOrderConfirmationMessage();

        // ✅ Open Payment Modal after confirming order
        openPaymentModal();

    } catch (error) {
        console.error("❌ Error confirming order:", error);
        alert("❌ Order confirmation failed. Please try again.");
    }
}


/* ✅ Open Payment Modal */
function openPaymentModal() {
    $("#paymentModal").modal("show");
}

/* ✅ Process Venmo Payment */
async function payWithVenmo() {
    const userEmail = localStorage.getItem("userEmail");
    const orderId = localStorage.getItem("orderId"); // ✅ Ensure order ID exists

    if (!userEmail || !orderId) {
        alert("⚠️ No order found. Please confirm your order first.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/payment/venmo`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userEmail, orderId })
        });

        const data = await response.json();

        document.getElementById("paymentStatus").innerHTML = `
            <p>📲 Open Venmo and send payment to:</p>
            <p><b>${data.venmoUsername}</b></p>
            <p>💲 Include your order number: <b>${orderId}</b></p>
            <p>✅ Click "Pay & Send Order" after payment.</p>
        `;

        // ✅ Show Pay & Send Order button
        document.getElementById("sendOrderButton").style.display = "block";

    } catch (error) {
        console.error("❌ Error processing Venmo payment:", error);
        document.getElementById("paymentStatus").innerHTML = `<p class="text-danger">❌ Payment failed. Please try again.</p>`;
    }
}

/* ✅ Make Functions Globally Accessible */
window.confirmOrder = confirmOrder;
window.openPaymentModal = openPaymentModal;
window.payWithVenmo = payWithVenmo;

/* ✅ Show Order Processing Message */
function showOrderProcessingMessage() {
    removeExistingMessage();

    let messageBox = document.createElement("div");
    messageBox.id = "order-message";
    messageBox.className = "order-notification processing";
    messageBox.innerText = "🕒 Processing your order...";

    document.body.appendChild(messageBox);
}

/* ✅ Show Order Confirmation Message */
function showOrderConfirmationMessage() {
    removeExistingMessage();

    let messageBox = document.createElement("div");
    messageBox.id = "order-message";
    messageBox.className = "order-notification confirmed";
    messageBox.innerText = "✅ Your order has been placed and is awaiting payment confirmation. Tap to close.";

    messageBox.addEventListener("click", () => {
        messageBox.style.opacity = "0";
        setTimeout(() => messageBox.remove(), 300);
    });

    document.body.appendChild(messageBox);
}

/* ✅ Remove Any Existing Message */
function removeExistingMessage() {
    const existingMessage = document.getElementById("order-message");
    if (existingMessage) existingMessage.remove();
}


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
