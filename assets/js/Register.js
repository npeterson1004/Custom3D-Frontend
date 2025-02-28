import { API_BASE_URL } from "./config.js";

document.getElementById("registerForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const requestData = { username, email, password };

    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData)
        });

        const data = await response.json();
        document.getElementById("message").innerHTML = `<div class="alert alert-success">${data.message}</div>`;

        if (response.ok) {
            window.location.href = "login.html";
        }
    } catch (error) {
        console.error("❌ Registration failed:", error);
        document.getElementById("message").innerHTML = `<div class="alert alert-danger">❌ Failed to register.</div>`;
    }
});
