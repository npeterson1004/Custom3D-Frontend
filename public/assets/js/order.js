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
            credentials: "include",
            body: JSON.stringify({ paymentStatus: "Completed" }) // ✅ Correctly update payment status
        });

        if (!response.ok) {
            throw new Error(`❌ Failed to update payment status. Server responded with ${response.status}`);
        }

        document.getElementById("paymentStatus").innerHTML = `<p class="text-success">✅ Order successfully sent!</p>`;

        // ✅ Clear cart after successful order
        let userEmail = localStorage.getItem("userEmail");
        if (userEmail) {
            localStorage.removeItem(`cart_${userEmail}`);
        }
        updateCartCount();

        // ✅ Hide buttons after order is sent (Ensure elements exist first)
        setTimeout(() => {
            const sendOrderButton = document.getElementById("sendOrderButton");
            const confirmPaymentButton = document.getElementById("confirmPaymentButton");

            if (sendOrderButton) sendOrderButton.style.display = "none";
            if (confirmPaymentButton) confirmPaymentButton.style.display = "none";
        }, 500); // ✅ Delayed execution to avoid accessing null elements

        // ✅ Remove "Pending Order" message
        setTimeout(() => {
            removeExistingMessage();
        }, 3000); // ✅ Message disappears after 3 seconds

        // ✅ Refresh admin dashboard if on that page
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


function generateOrderNumber() {
    const now = new Date();
    return `ORD-${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;
}


/* ✅ Confirm Order (Creates Order in Database) */
async function confirmOrder() {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
        alert("⚠️ Please log in to place an order.");
        window.location.href = "login.html";
        return;
    }

    const cart = JSON.parse(localStorage.getItem(`cart_${userEmail}`)) || [];
    if (cart.length === 0) {
        alert("⚠️ Your cart is empty.");
        return;
    }

    // ✅ Show Delivery Modal
    $("#deliveryModal").modal("show");

    // Handle "Continue" from modal
    document.getElementById("submitDeliveryChoice").onclick = async function () {
        const selectedOption = document.querySelector('input[name="deliveryOption"]:checked').value;
        const address = document.getElementById("shippingAddress").value.trim();
        let shippingFee = 0;

        if (selectedOption === "Delivery") {
            if (!address) {
                alert("📬 Please enter a shipping address.");
                return;
            }
            shippingFee = 6;
        }

        const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const orderData = {
            userEmail,
            items: cart.map(item => ({
                name: item.name,
                price: item.price,
                image: item.image,
                quantity: item.quantity,
                color: item.color ? {
                    name: item.color.name,
                    images: item.color.images
                } : null
            })),
            totalAmount,
            paymentMethod: "Venmo",
            paymentStatus: "Pending",
            orderNumber: generateOrderNumber(),
            deliveryMethod: selectedOption,
            shippingAddress: selectedOption === "Delivery" ? address : "Skipped"
        };

        try {
            showOrderProcessingMessage();

            const response = await fetch(`${API_BASE_URL}/api/orders`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(orderData)
            });

            if (!response.ok) throw new Error("❌ Order failed to create.");
            const orderResponse = await response.json();

            localStorage.setItem("orderId", orderResponse.order._id);
            document.cookie = `orderId=${orderResponse.order._id}; path=/; Secure`;

            $("#deliveryModal").modal("hide");
            document.getElementById("proceedToPaymentButton").style.display = "block";
            showOrderConfirmationMessage();
        } catch (error) {
            console.error("❌ Error confirming order:", error);
            alert("❌ Order confirmation failed. Please try again.");
        }
    };
}







/* ✅ Make Functions Globally Accessible */
window.confirmOrder = confirmOrder;
window.openPaymentModal = openPaymentModal;



/* ✅ Open Payment Modal */
async function openPaymentModal() {
    const orderId = localStorage.getItem("orderId") || document.cookie.split('; ').find(row => row.startsWith('orderId='))?.split('=')[1];

    if (!orderId) {
        alert("⚠️ Please confirm your order before proceeding to payment.");
        return;
    }


    try {
        const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/payment-status`, {
            method: "PATCH",
            headers: { 
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ paymentStatus: "Processing Payment" })
        });

        if (!response.ok) {
            throw new Error("❌ Failed to update payment status.");
        }

        $("#paymentModal").modal("show");
        // ✅ NEW: Fetch order and display amount due
const orderRes = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
    method: "GET",
    headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
    }
});



        // ✅ Hide the send order button initially
        document.getElementById("sendOrderButton").style.display = "none";

    } catch (error) {
        console.error("❌ Error updating payment status:", error);
        alert("❌ Failed to proceed to payment. Please try again.");
    }
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
