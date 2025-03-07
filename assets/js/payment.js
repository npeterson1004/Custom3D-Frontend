//payment.js

import { API_BASE_URL } from "./config.js";

/* ✅ Process Venmo Payment */
async function payWithVenmo() {
    const userEmail = localStorage.getItem("userEmail");
    const orderId = localStorage.getItem("orderId");

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
            <p>✅ Click "Confirm Payment" after payment.</p>
        `;

        // ✅ Show Confirm Payment Button
        document.getElementById("confirmPaymentButton").style.display = "block";

    } catch (error) {
        console.error("❌ Error processing Venmo payment:", error);
        document.getElementById("paymentStatus").innerHTML = `<p class="text-danger">❌ Payment failed. Please try again.</p>`;
    }
}

/* ✅ Confirm Payment and Send Order */
async function confirmPayment() {
    document.getElementById("paymentStatus").innerHTML += `<p class="text-success">✅ Payment Confirmed. Now sending order...</p>`;

    setTimeout(() => {
        sendOrder();
    }, 2000);
}

// ✅ Make functions globally accessible
window.payWithVenmo = payWithVenmo;
window.confirmPayment = confirmPayment;
