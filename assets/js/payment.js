//payment.js

import { API_BASE_URL } from "./config.js";

/* ✅ Process Venmo Payment */
async function payWithVenmo() {
    const userEmail = localStorage.getItem("userEmail");
    let orderId = localStorage.getItem("orderId"); // ✅ Retrieve stored order ID

    if (!userEmail || !orderId) {
        alert("⚠️ No order found. Please try again.");
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
            <p>✅ Click "Send Order" after payment.</p>
        `;

        // ✅ Show Send Order button
        document.getElementById("sendOrderButton").style.display = "block";

    } catch (error) {
        console.error("❌ Error processing Venmo payment:", error);
        document.getElementById("paymentStatus").innerHTML = `<p class="text-danger">❌ Payment failed. Please try again.</p>`;
    }
}


/* ✅ Confirm Payment and Update Status */
async function confirmPayment() {
    const orderId = localStorage.getItem("orderId");

    if (!orderId) {
        alert("⚠️ No order found. Please confirm your order first.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/payment-status`, {
            method: "PATCH",
            headers: { 
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ paymentStatus: "Completed" })
        });

        if (!response.ok) {
            throw new Error("❌ Failed to confirm payment.");
        }

        document.getElementById("paymentStatus").innerHTML += `<p class="text-success">✅ Payment Confirmed. Order is being processed.</p>`;
        localStorage.removeItem(`cart_${userEmail}`);
        updateCartCount();

    } catch (error) {
        console.error("❌ Error confirming payment:", error);
        alert("❌ Payment confirmation failed. Please try again.");
    }
}

// ✅ Make functions globally accessible
window.payWithVenmo = payWithVenmo;
window.confirmPayment = confirmPayment;
