//adminLogin.js
import { API_BASE_URL } from "./config.js";

document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ DOM fully loaded, attaching event listener...");

    const adminLoginForm = document.getElementById("adminLoginForm");

    if (!adminLoginForm) {
        console.error("🚨 adminLoginForm NOT FOUND!");
        return;
    }

    adminLoginForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        console.log("✅ Admin login form submitted!");

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            console.log("📢 Sending Login Request to:", `${API_BASE_URL}/api/admin/login`);

            const response = await fetch(`${API_BASE_URL}/api/admin/login`, { 
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            console.log("✅ Sent request to backend");

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Login failed!");
            }

            console.log("✅ Login Successful! Storing Token...", data);

            // ✅ Store token BEFORE redirecting
            localStorage.setItem("adminToken", data.token);

            // ✅ Confirm token is stored before redirecting
            if (!localStorage.getItem("adminToken")) {
                console.error("🚨 Token was NOT stored in localStorage!");
                return;
            }

            console.log("✅ Token stored successfully. Redirecting...");
            window.location.href = "admin-dashboard.html";

        } catch (error) {
            console.error("❌ Login Error:", error);
            document.getElementById("errorMessage").textContent = error.message;
            document.getElementById("errorMessage").style.display = "block";
        }
    });
});

