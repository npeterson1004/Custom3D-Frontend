import { API_BASE_URL } from "./config.js";

document.getElementById("registerForm")?.addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value; // ✅ Add confirm password field

    if (password !== confirmPassword) {
        document.getElementById("message").innerHTML = `<div class="alert alert-danger">❌ Passwords do not match.</div>`;
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
            credentials: "include"
        });

        const data = await response.json();
        document.getElementById("message").innerHTML = `<div class="alert alert-success">${data.message}</div>`;

        if (response.ok) {
            window.location.href = "login.html"; // Redirect to login page after successful registration
        }
    } catch (error) {
        document.getElementById("message").innerHTML = `<div class="alert alert-danger">❌ Registration failed.</div>`;
    }
});