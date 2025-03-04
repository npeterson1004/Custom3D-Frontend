//contact.js

import { API_BASE_URL } from "./config.js"; // ✅ Ensure correct import

document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
        contactForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const formData = new FormData();
            formData.append("name", document.getElementById("name").value);
            formData.append("email", document.getElementById("email").value);
            formData.append("number", document.getElementById("number").value);
            formData.append("description", document.getElementById("description").value);

            // ✅ Add file to FormData (if a file is selected)
            const fileInput = document.getElementById("file");
            if (fileInput.files.length > 0) {
                formData.append("file", fileInput.files[0]);
            }

            try {
                console.log("📩 Sending request to:", `${API_BASE_URL}/api/contact`);

                const response = await fetch(`${API_BASE_URL}/api/contact`, {
                    method: "POST",
                    body: formData
                });

                if (!response.ok) {
                    throw new Error(`❌ Server Error: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                console.log("✅ Server Response JSON:", data);

                document.getElementById("message").innerHTML = `<div class="alert alert-success">${data.message}</div>`;

                this.reset();
            } catch (error) {
                console.error("❌ Error submitting contact request:", error);
                document.getElementById("message").innerHTML = `<div class="alert alert-danger">⚠️ Failed to submit request.</div>`;
            }
        });
    }
});
