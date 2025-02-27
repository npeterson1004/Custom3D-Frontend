//auth.js

import { API_BASE_URL } from "./config.js";

document.getElementById("registerForm")?.addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();
        document.getElementById("message").innerHTML = `<div class="alert alert-success">${data.message}</div>`;

        if (response.ok) {
            window.location.href = "login.html"; // Redirect to login page after registration
        }
    } catch (error) {
        document.getElementById("message").innerHTML = `<div class="alert alert-danger">❌ Registration failed.</div>`;
    }
});

document.getElementById("loginForm")?.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("userEmail", data.user.email); // ✅ Fix: Store user email from response
            console.log("✅ User email stored in localStorage:", data.user.email); // Debugging
            window.location.href = "index.html"; // Redirect to home page
        } else {
            document.getElementById("message").innerHTML = `<div class="alert alert-danger">${data.message}</div>`;
        }
    } catch (error) {
        console.error("Login error:", error);
    }
});





async function checkLoginStatus() {
    const token = localStorage.getItem("token") || localStorage.getItem("adminToken");

    if (!token) {
        console.warn("⚠️ No authentication token found. User not logged in.");
        return; // Avoids unnecessary redirection loop
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            console.warn("⚠️ Token invalid. Redirecting to login.");
            localStorage.removeItem("token");
            localStorage.removeItem("adminToken");
            window.location.href = "login.html";
        }
    } catch (error) {
        console.error("Error verifying login:", error);
    }
}

// Run login check when the page loads
document.addEventListener("DOMContentLoaded", checkLoginStatus);



async function logout() {
    let userEmail = localStorage.getItem("userEmail");

    if (userEmail) {
        localStorage.removeItem(`cart_${userEmail}`);
    }

    const token = localStorage.getItem("token") || localStorage.getItem("adminToken");

    if (token) {
        await fetch(`${API_BASE_URL}/api/auth/logout`, { // ✅ Backend logout request
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
    }

    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("userEmail");
    window.location.href = "login.html";
}

