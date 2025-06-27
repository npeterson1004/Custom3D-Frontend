//login.js

import { API_BASE_URL } from "./config.js";


document.getElementById("loginForm")?.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            credentials: "include"
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Login failed!");
        }

        console.log("✅ Login Successful! Storing Token...", data);

        localStorage.setItem("token", data.token);
        localStorage.setItem("userEmail", data.user.email);
        localStorage.setItem("username", data.user.username);

        setTimeout(() => {
            const storedToken = localStorage.getItem("token");

            if (!storedToken) {
                console.error("🚨 Token was NOT stored! Aborting redirect.");
                return;
            }

            console.log("✅ Token stored successfully. Redirecting...");
            window.location.href = "index.html"; // Redirect to homepage after login

        }, 500);
    } catch (error) {
        console.error("❌ Login Error:", error);
        document.getElementById("message").innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
    }
});