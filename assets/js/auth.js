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
            body: JSON.stringify({ username, email, password }),
            credentials: "include"
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

async function getAuthToken() {
    let token = localStorage.getItem("token") || localStorage.getItem("adminToken");

    if (!token) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
                method: "GET",
                credentials: "include",
            });

            const data = await response.json();
            console.log("🔍 Token Response from Backend:", data); // ✅ Debugging

            if (response.ok && data.token) {
                console.log("✅ Storing retrieved token:", data.token);
                localStorage.setItem("token", data.token);
                return data.token;
            }
            
        } catch (error) {
            console.error("❌ Error retrieving token from cookies:", error);
        }
    }

    const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
const expiry = decodedToken.exp * 1000; // Convert to milliseconds

if (Date.now() >= expiry) {
    console.warn("🚨 Token Expired! Clearing localStorage.");
    localStorage.removeItem("token");
    return null;
}

return token;
}





async function checkLoginStatus() {
    setTimeout(async () => {
        const token = await getAuthToken();  // ✅ Fetch token properly

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
                    "Authorization": token ? `Bearer ${token}` : "",
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });
            

            const data = await response.json();
            if (!response.ok) {
                console.warn("🚨 Token verification failed:", data.message);
                const authErrorElement = document.getElementById("auth-error");
            if (authErrorElement) {
               authErrorElement.innerHTML = `<div class="alert alert-danger">${data.message}</div>`;
            }
                localStorage.removeItem("token");
                localStorage.removeItem("adminToken");
                return;
            }

            console.log("✅ Token Verified. User is logged in.");
        } catch (error) {
            console.error("❌ Error verifying login:", error);
            const authErrorElement = document.getElementById("auth-error");
            if (authErrorElement) {
                authErrorElement.innerHTML = `<div class="alert alert-danger">Authentication error. Try again.</div>`;
            }
            localStorage.removeItem("token");
            localStorage.removeItem("adminToken");
        }
    }, 500);
}



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
            headers: { "Authorization": `Bearer ${token}` },
            credentials: "include" // ✅ Ensures cookies are cleared
        });
    }

    console.log("✅ Removing all stored data...");
    localStorage.clear();

    console.log("✅ Redirecting to login page...");
    setTimeout(() => {
        window.location.href = "login.html";
    }, 500); // ✅ Short delay before redirecting
}



