import { API_BASE_URL } from "./config.js";  // ✅ Import API base URL

document.getElementById("adminLoginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/login`, { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Login failed!");
        }

        localStorage.setItem("adminToken", data.token);
        window.location.href = "admin-dashboard.html"; // Redirect to the dashboard

    } catch (error) {
        console.error("Login Error:", error);
        document.getElementById("errorMessage").textContent = error.message;
        document.getElementById("errorMessage").style.display = "block";
    }
});
