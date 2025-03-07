//order.js
import { API_BASE_URL } from "./config.js";

/* ✅ Send Order After Payment */
async function sendOrder() {
    const orderId = localStorage.getItem("orderId");

    if (!orderId) {
        alert("⚠️ No order found. Please confirm your order first.");
        return;
    }

    try {
        showOrderProcessingMessage(); // ✅ Show processing message

        const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/payment-status`, {
            method: "PATCH",
            headers: { 
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
            credentials: "include", // ✅ Ensures session cookies are sent
            body: JSON.stringify({ paymentStatus: "Completed" }) // ✅ Correctly update payment status
        });

        if (!response.ok) {
            throw new Error(`❌ Failed to update payment status. Server responded with ${response.status}`);
        }

        const result = await response.json();
        console.log("✅ Order successfully updated:", result);

        // ✅ Show success message
        document.getElementById("paymentStatus").innerHTML = `<p class="text-success">✅ Order successfully sent!</p>`;

        // ✅ Clear cart after successful order
        let userEmail = localStorage.getItem("userEmail");
        if (userEmail) {
            localStorage.removeItem(`cart_${userEmail}`);
        }
        updateCartCount();

        // ✅ Hide buttons after order is sent (Ensure elements exist first)
        const sendOrderButton = document.getElementById("sendOrderButton");
        const confirmPaymentButton = document.getElementById("confirmPaymentButton");

        if (sendOrderButton) sendOrderButton.style.display = "none";
        if (confirmPaymentButton) confirmPaymentButton.style.display = "none";

        // ✅ Remove the "Pending Order" message after a few seconds
        setTimeout(() => {
            removeExistingMessage();
        }, 3000); // ✅ Message disappears after 3 seconds

        // ✅ Refresh admin dashboard (if on the page)
        if (window.location.pathname.includes("admin-dashboard.html")) {
            fetchOrders();
        }

    } catch (error) {
        console.error("❌ Error sending order:", error);
        alert("❌ Failed to send order. Please try again.");
    }
}

// ✅ Ensure function is globally accessible
window.sendOrder = sendOrder;




/* ✅ Confirm Order  */
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
        paymentMethod: "Venmo",
        paymentStatus: "Pending"
    };

    try {
        showOrderProcessingMessage(); // ✅ Show processing message

        // ✅ Store order locally instead of sending it to the admin yet
        localStorage.setItem("pendingOrder", JSON.stringify(orderData));

        // ✅ Show Proceed to Payment Button (User must click this next)
        document.getElementById("proceedToPaymentButton").style.display = "block";

        showOrderConfirmationMessage();

    } catch (error) {
        console.error("❌ Error confirming order:", error);
        alert("❌ Order confirmation failed. Please try again.");
    }
}





/* ✅ Make Functions Globally Accessible */
window.confirmOrder = confirmOrder;
window.openPaymentModal = openPaymentModal;





/* ✅ Open Payment Modal */
function openPaymentModal() {
    let orderId = localStorage.getItem("orderId");
    if (!orderId) {
        alert("⚠️ Please confirm your order before proceeding to payment.");
        return;
    }
    $("#paymentModal").modal("show");
}







/* ✅ Show Order Processing Message */
function showOrderProcessingMessage() {
    removeExistingMessage();

    let messageBox = document.createElement("div");
    messageBox.id = "order-message";
    messageBox.className = "order-notification processing";
    messageBox.innerText = "🕒 Processing your order...";

    document.body.appendChild(messageBox);

    // ✅ Remove the message after 3 seconds
    setTimeout(() => {
        removeExistingMessage();
    }, 3000);
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
