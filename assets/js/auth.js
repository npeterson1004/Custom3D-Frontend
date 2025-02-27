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
        if (!response.ok) {
            throw new Error(data.message || "Login failed!");
        }

        console.log("✅ Login Successful! Storing Token...", data);

        // ✅ Store token BEFORE redirecting
        localStorage.setItem("token", data.token);
        localStorage.setItem("userEmail", data.user.email);

        setTimeout(() => {
            const storedToken = localStorage.getItem("token");
            console.log("🔍 Checking Stored Token:", storedToken);

            if (!storedToken) {
                console.error("🚨 Token was NOT stored in localStorage!");
                return;
            }

            console.log("✅ Token stored successfully. Redirecting...");
            window.location.href = "index.html"; 
        }, 500); // ✅ Delay to ensure token is stored

    } catch (error) {
        console.error("❌ Login Error:", error);
        document.getElementById("message").innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
    }
});






async function checkLoginStatus() {
    setTimeout(() => { // ✅ Delay check to ensure storage is updated
        const token = localStorage.getItem("token") || localStorage.getItem("adminToken");

        console.log("🔍 Retrieved Token:", token); // ✅ Debugging

        if (!token) {
            console.warn("⚠️ No authentication token found. User not logged in.");
            return; // Avoids unnecessary redirection loop
        }

        fetch(`${API_BASE_URL}/api/auth/verify`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        })
        .then(response => {
            if (!response.ok) {
                console.warn("⚠️ Token invalid. Redirecting to login.");
                localStorage.removeItem("token");
                localStorage.removeItem("adminToken");
                window.location.href = "login.html";
            }
        })
        .catch(error => console.error("Error verifying login:", error));
    }, 500); // ✅ Short delay before checking token
}

// Run login check when the page loads
document.addEventListener("DOMContentLoaded", checkLoginStatus);




async function logout() {
    console.log("🔍 Logging out...");

    let userEmail = localStorage.getItem("userEmail");

    if (userEmail) {
        localStorage.removeItem(`cart_${userEmail}`);
    }

    const token = localStorage.getItem("token") || localStorage.getItem("adminToken");

    if (token) {
        await fetch(`${API_BASE_URL}/api/auth/logout`, { // ✅ Backend logout request
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` }
        });
    }

    console.log("✅ Removing all stored data...");
    localStorage.clear();

    console.log("✅ Redirecting to login page...");
    setTimeout(() => {
        window.location.href = "login.html";
    }, 500); // ✅ Short delay before redirecting
}


