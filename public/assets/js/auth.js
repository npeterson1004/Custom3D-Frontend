//auth.js

// auth.js - Handles Authentication & Token Management
import { API_BASE_URL } from "./config.js";

/** 
 * ✅ Retrieves the authentication token from localStorage or backend 
 * ✅ Ensures token validity before using it 
 */
async function getAuthToken() {
    let token = localStorage.getItem("token") || localStorage.getItem("adminToken");

    // 🔍 If no token found, try retrieving from the backend
    if (!token) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
                method: "GET",
                credentials: "include",
            });

            const data = await response.json();
            console.log("🔍 Token Response from Backend:", data);

            if (response.ok && data.token) {
                console.log("✅ Storing retrieved token:", data.token);
                localStorage.setItem("token", data.token);
                return data.token;
            } else {
                console.warn("🚨 No valid token received from backend.");
                return null;
            }
        } catch (error) {
            console.error("❌ Error retrieving token from backend:", error);
            return null;
        }
    }

    // 🚨 Ensure token is valid before decoding
    if (!token || token === "null" || token === "undefined") {
        console.warn("🚨 Invalid token detected. Clearing storage.");
        localStorage.removeItem("token");
        return null;
    }

    try {
        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
        const expiry = decodedToken.exp * 1000; // Convert to milliseconds

        if (Date.now() >= expiry) {
            console.warn("🚨 Token Expired! Clearing localStorage.");
            localStorage.removeItem("token");
            return null;
        }

        return token;
    } catch (error) {
        console.error("❌ Error decoding token:", error);
        localStorage.removeItem("token"); // ✅ Remove corrupt token
        return null;
    }
}

/**
 * ✅ Checks the login status of the user
 * ✅ Verifies the token with the backend
 */
async function checkLoginStatus() {
    setTimeout(async () => {
        const token = await getAuthToken();
        console.log("🔍 Checking Retrieved Token:", token);

        if (!token) {
            const authErrorElement = document.getElementById("auth-error");
            if (authErrorElement) {
                authErrorElement.innerHTML = `<div class="alert alert-warning">Please log in to continue.</div>`;
            }
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`, // ✅ Ensure token is sent
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });

            const data = await response.json();
            if (!response.ok) {
                console.warn("🚨 Token verification failed:", data.message);
                localStorage.removeItem("token");
                localStorage.removeItem("adminToken");
                return;
            }

            console.log("✅ Token Verified. User is logged in.");
        } catch (error) {
            console.error("❌ Error verifying login:", error);
            localStorage.removeItem("token");
            localStorage.removeItem("adminToken");
        }
    }, 500);
}

// ✅ Runs `checkLoginStatus` when the page loads
document.addEventListener("DOMContentLoaded", checkLoginStatus);

/**
 * ✅ Logs the user out, removes tokens, and redirects to login
 */
async function logout() {
    console.log("🔍 Logging out...");

    let userEmail = localStorage.getItem("userEmail");

    // ✅ Store the user's cart before clearing localStorage
    let cartData = userEmail ? localStorage.getItem(`cart_${userEmail}`) : null;

    const token = localStorage.getItem("token") || localStorage.getItem("adminToken");

    // ✅ Backend logout request
    if (token) {
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` },
            credentials: "include" // ✅ Ensures cookies are cleared
        });
    }

    console.log("✅ Removing all stored data except cart...");

    // ✅ Clear localStorage while preserving the cart
    localStorage.clear();
    
    if (userEmail && cartData) {
        localStorage.setItem(`cart_${userEmail}`, cartData); // ✅ Restore cart data
    }

    console.log("✅ Redirecting to login page...");
    setTimeout(() => {
        window.location.href = "login.html";
    }, 500); // ✅ Short delay before redirecting
}

// ✅ Make `logout` function globally accessible
window.logout = logout;



