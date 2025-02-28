//contact.js

import { API_BASE_URL } from "./config.js"; // ✅ Ensure correct API base URL

document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
        contactForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const number = document.getElementById("number").value;
            const description = document.getElementById("description").value;

            const requestData = { name, email, number, description };

            try {
                const response = await fetch(`${API_BASE_URL}/api/contact`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(requestData)
                });

                const data = await response.json();
                document.getElementById("message").innerHTML = `<div class="alert alert-success">${data.message}</div>`;

                if (response.ok) {
                    this.reset();
                }
            } catch (error) {
                console.error("❌ Error submitting contact request:", error);
                document.getElementById("message").innerHTML = `<div class="alert alert-danger">⚠️ Failed to submit request.</div>`;
            }
        });
    }
});
