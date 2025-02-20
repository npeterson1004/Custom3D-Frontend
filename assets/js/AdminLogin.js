

const API_BASE_URL = "https://custom3d-backend.onrender.com";
document.getElementById("adminLoginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    console.log("Attempting Admin Login with:", { email, password });

    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/login`, { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        console.log("Server Response:", data);

        if (!response.ok) {
            throw new Error(data.message || "Login failed!");
        }

        // ✅ Ensure token exists before proceeding
        if (!data.token) {
            throw new Error("No token received from server");
        }

        // ✅ Store token
        if (data.token) {
            localStorage.setItem("adminToken", data.token);
            window.location.href = "admin-dashboard.html";
        } else {
            console.error("❌ No token received.");
        }
        
        // ✅ Confirm before redirecting
        if (localStorage.getItem("adminToken")) {
            console.log("Redirecting to Admin Dashboard...");
            window.location.href = "admin-dashboard.html";
        } else {
            console.error("❌ Token was NOT stored!");
        }

    } catch (error) {
        console.error("Login Error:", error);
        document.getElementById("errorMessage").textContent = error.message;
        document.getElementById("errorMessage").style.display = "block";
    }
});


