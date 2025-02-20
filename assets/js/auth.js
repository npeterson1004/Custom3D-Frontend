document.getElementById("registerForm")?.addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("https://delicate-yeot-77f124.netlify.app/api/auth/register", {
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
        const response = await fetch("https://delicate-yeot-77f124.netlify.app", {
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



window.logout = function () {
    localStorage.removeItem("token"); // Remove JWT token
    localStorage.removeItem("userEmail"); // ✅ Remove stored email
    window.location.href = "login.html"; // Redirect to login page
};


