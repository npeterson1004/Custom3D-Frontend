//admin-dashboard.js


document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("adminToken");
    console.log("Checking Admin Token on Page Load:", token);

    if (!token) {
        console.log("No admin token found. Redirecting to login.");
        window.location.href = "admin-login.html";
    }
});


async function loadDashboard() {
    try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            console.warn("⚠️ No admin token found. Redirecting...");
            window.location.href = "admin-login.html";
            return;
        }

        const res = await fetch("https://custom3d-backend.onrender.com/api/admin/dashboard", {
            method: "GET",
            headers: { 
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!res.ok) {
            console.error("Unauthorized: Redirecting to login.");
            localStorage.removeItem("adminToken");
            window.location.href = "admin-login.html";
            return;
        }

        console.log("✅ Dashboard Data Received:", await res.json());
        // 🚀 No UI updates anymore!

    } catch (error) {
        console.error("Dashboard Load Error:", error);
        localStorage.removeItem("adminToken");
        window.location.href = "admin-login.html";
    }
}

document.addEventListener("DOMContentLoaded", loadDashboard);



//document.addEventListener("DOMContentLoaded", loadDashboard);





async function checkAdminAuth() {
    const token = localStorage.getItem("adminToken");
    console.log("Admin Token Being Sent:", token);

    if (!token) {
        console.log("No admin token found. Redirecting to login.");
        window.location.href = "admin-login.html";
        return;
    }

    try {
        const res = await fetch("https://custom3d-backend.onrender.com/api/admin/dashboard", {
            method: "GET",
            headers: { 
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (res.status === 401 || res.status === 403) {
            console.error("Unauthorized: Redirecting to login.");
            localStorage.removeItem("adminToken");
            window.location.href = "admin-login.html";
            return;
        }

        const data = await res.json();
        console.log("✅ Dashboard Data:", data);
    } catch (error) {
        console.error("Admin auth error:", error);
        localStorage.removeItem("adminToken");
        window.location.href = "admin-login.html";
    }
}


checkAdminAuth();


document.getElementById("addProductForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    
    // Debugging: Check if FormData contains expected values
    for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]); // This will print key-value pairs
    }

    try {
        const response = await fetch("https://custom3d-backend.onrender.com/api/products", {
            method: "POST",
            body: formData
        });

        const result = await response.json();
        document.getElementById("message").textContent = result.message;

        if (response.ok) {
            this.reset(); // Clear the form on success
        }
    } catch (error) {
        console.error("Error adding product:", error);
        document.getElementById("message").textContent = "❌ Failed to add product.";
    }
});

async function loadContacts() {
    try {
        const response = await fetch("https://custom3d-backend.onrender.com/api/contact");

        if (!response.ok) {
            throw new Error("Failed to fetch contacts.");
        }

        const contacts = await response.json();
        const contactsContainer = document.getElementById("contactsContainer");
        contactsContainer.innerHTML = ""; // Clear previous entries

        if (contacts.length === 0) {
            contactsContainer.innerHTML = '<tr><td colspan="5" class="text-center">No contact requests available.</td></tr>';
            return;
        }

        contacts.forEach(contact => {
            const contactRow = `
                <tr>
                    <td>${sanitize(contact.name)}</td>
                    <td>${sanitize(contact.email)}</td>
                    <td>${sanitize(contact.number)}</td>
                    <td>${sanitize(contact.description)}</td>
                    <td>${new Date(contact.createdAt).toLocaleString()}</td>
                </tr>`;
            contactsContainer.innerHTML += contactRow;
        });

    } catch (error) {
        console.error("Error loading contacts:", error);
        document.getElementById("contactsContainer").innerHTML = '<tr><td colspan="5" class="text-center text-danger">Failed to load contacts.</td></tr>';
    }
}



// Load contacts when the "View Contacts" tab is clicked
document.getElementById("view-contacts-tab").addEventListener("click", loadContacts);



async function fetchOrders() {
    try {
        const response = await fetch("https://custom3d-backend.onrender.com/api/orders");
        const orders = await response.json();

        const ordersContainer = document.getElementById("ordersContainer");
        ordersContainer.innerHTML = ""; // Clear existing content

        orders.forEach(order => {
            const orderRow = `
                <tr>
                    <td>${order.userEmail}</td>
                    <td>${order.items.map(item => `${item.quantity}x ${item.name}`).join(", ")}</td>
                    <td>$${order.totalAmount.toFixed(2)}</td>
                    <td>${new Date(order.orderDate).toLocaleString()}</td>
                </tr>
            `;
            ordersContainer.innerHTML += orderRow;
        });

    } catch (error) {
        console.error("Error fetching orders:", error);
        document.getElementById("ordersContainer").innerHTML = '<tr><td colspan="4" class="text-center text-danger">Failed to load orders.</td></tr>';
    }
}

// Load orders when the admin page loads
document.addEventListener("DOMContentLoaded", fetchOrders);



// Prevent XSS attacks
function sanitize(input) {
    return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Load contacts when the tab is clicked
document.getElementById("view-contacts-tab").addEventListener("click", loadContacts);


function logout() {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "admin-login.html";
}

loadDashboard();
