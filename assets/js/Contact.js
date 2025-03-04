//contact.js

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

            const fileInput = document.getElementById("file");
            if (fileInput.files.length > 0) {
                formData.append("file", fileInput.files[0]);
            }

            try {
                const response = await fetch(`${API_BASE_URL}/api/contact`, {
                    method: "POST",
                    body: formData
                });

                // ✅ Log full response to check if it's an error page
                console.log("📩 Full Response:", response);

                if (!response.ok) {
                    throw new Error(`❌ Server Error: ${response.status} ${response.statusText}`);
                }

                // ✅ Try parsing JSON, but handle unexpected responses
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
