//payment.js

import { API_BASE_URL } from "./config.js";

/* ✅ Process Venmo Payment */
async function payWithVenmo() {
    const userEmail = localStorage.getItem("userEmail");
    let orderId = localStorage.getItem("orderId") || document.cookie.split('; ').find(row => row.startsWith('orderId='))?.split('=')[1];

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
            <p style="color: black; font-weight: 500;">📲 Open Venmo and send payment to: <b>${data.venmoUsername}</b></p>
            <p style="color: black; font-weight: 500;">💲 Include your order number when paying</p>
            <p style="color: black; font-weight: 500;">✅ Click "Pay & Send Order" after payment.</p>
            <p style="color: black; font-weight: 600;"><strong>🧾 Order Number:</strong> ${data.orderNumber}</p>
            `;


        // ✅ Show Send Order button only after selecting Venmo
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
        localStorage.setItem("orderNumber", orderResponse.order.orderNumber);

    } catch (error) {
        console.error("❌ Error confirming payment:", error);
        alert("❌ Payment confirmation failed. Please try again.");
    }
}

// ✅ Make functions globally accessible
window.payWithVenmo = payWithVenmo;
window.confirmPayment = confirmPayment;
