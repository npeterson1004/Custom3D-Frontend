//admin-dashboard.js
import { API_BASE_URL } from "./config.js";

document.addEventListener("DOMContentLoaded", function () {
    console.log("🔍 Checking Admin Token on Page Load...");
    
    setTimeout(() => {  // ✅ Short delay to allow localStorage to update
        const token = localStorage.getItem("adminToken");
        console.log("🔍 Retrieved Admin Token:", token);

        if (!token) {
            console.log("🚨 No admin token found. Redirecting to login.");
            window.location.href = "admin-login.html";
        } else {
            checkAdminAuth(); // ✅ Verify token before loading dashboard
        }
    }, 300);
});


async function checkAdminAuth() {
    setTimeout(async () => {
        const token = localStorage.getItem("adminToken");

        console.log("🔍 Checking Admin Token:", token);

        if (!token) {
            console.log("🚨 No admin token found. Redirecting...");
            return window.location.href = "admin-login.html";
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/dashboard`, {  // ✅ Correct admin verification endpoint
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!response.ok) {
                const errorMsg = await response.json();
                console.error("🚨 Admin verification failed:", errorMsg.message);
                localStorage.removeItem("adminToken");
                return window.location.href = "admin-login.html";
            }

            console.log("✅ Admin Verified. Proceeding to Dashboard...");
            loadDashboard(); 

        } catch (error) {
            console.error("❌ Admin verification failed:", error);
            localStorage.removeItem("adminToken");
            window.location.href = "admin-login.html";
        }
    }, 500);
}



async function loadDashboard() {
    try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            console.warn("⚠️ No admin token found. Redirecting...");
            window.location.href = "admin-login.html";
            return;
        }

        const res = await fetch(`${API_BASE_URL}/api/admin/dashboard`, {
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

    } catch (error) {
        console.error("Dashboard Load Error:", error);
        localStorage.removeItem("adminToken");
        window.location.href = "admin-login.html";
    }
}




document.getElementById("addProductForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    
    // Debugging: Check if FormData contains expected values
    for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]); // This will print key-value pairs
    }

    try {
        const token = localStorage.getItem("adminToken");

const response = await fetch(`${API_BASE_URL}/api/products`, {
    method: "POST",
    headers: { 
        "Authorization": `Bearer ${token}`
    },
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
        const token = localStorage.getItem("adminToken");

        if (!token) {
            console.error("🚨 No admin token found. Redirecting...");
            return window.location.href = "admin-login.html";
        }

        const response = await fetch(`${API_BASE_URL}/api/contact`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error("⚠️ Failed to fetch contacts. Check authentication.");
        }

        const contacts = await response.json();
        const contactsContainer = document.getElementById("contactsContainer");
        contactsContainer.innerHTML = ""; // Clear previous entries

        if (contacts.length === 0) {
            contactsContainer.innerHTML = '<tr><td colspan="6" class="text-center">No contact requests available.</td></tr>';
            return;
        }

        contacts.forEach(contact => {
            let fileLink = contact.fileUrl && contact.fileUrl.startsWith("http")
                ? `<a href="${contact.fileUrl}" target="_blank" download>📂 Download File</a>` 
                : "No file uploaded";

            const contactRow = `
                <tr>
                    <td>${sanitize(contact.name)}</td>
                    <td>${sanitize(contact.email)}</td>
                    <td>${sanitize(contact.number)}</td>
                    <td>${sanitize(contact.description)}</td>
                    <td>${fileLink}</td>
                    <td>${new Date(contact.createdAt).toLocaleString()}</td>
                </tr>`;
            contactsContainer.innerHTML += contactRow;
        });

    } catch (error) {
        console.error("❌ Error loading contacts:", error);
        document.getElementById("contactsContainer").innerHTML = '<tr><td colspan="6" class="text-center text-danger">⚠️ Failed to load contacts.</td></tr>';
    }
}



// ✅ Load contacts when the "View Contacts" tab is clicked
document.getElementById("view-contacts-tab").addEventListener("click", loadContacts);




async function fetchOrders() {
    try {
        const token = localStorage.getItem("adminToken");

        if (!token) {
            console.error("🚨 No admin token found. Redirecting...");
            return window.location.href = "admin-login.html";
        }

        const response = await fetch(`${API_BASE_URL}/api/orders`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error("⚠️ Failed to fetch orders. Check authentication.");
        }

        const orders = await response.json();
        const ordersContainer = document.getElementById("ordersContainer");
        ordersContainer.innerHTML = ""; // Clear previous entries

        if (orders.length === 0) {
            ordersContainer.innerHTML = '<tr><td colspan="4" class="text-center">No orders available.</td></tr>';
            return;
        }

        orders.forEach(order => {
            const orderRow = `
                <tr>
                    <td>${order.userEmail}</td>
            <td>
                ${order.items.map(item => 
                    `<span class="order-quantity">${item.quantity}</span> x ${item.name}`
                ).join(", ")}
            </td>
                    <td>$${order.totalAmount.toFixed(2)}</td>
                    <td>${new Date(order.orderDate).toLocaleString()}</td>
                </tr>
            `;
            ordersContainer.innerHTML += orderRow;
        });

    } catch (error) {
        console.error("❌ Error fetching orders:", error);
        document.getElementById("ordersContainer").innerHTML = '<tr><td colspan="4" class="text-center text-danger">⚠️ Failed to load orders.</td></tr>';
    }
}

// ✅ Load orders when the admin page loads
document.addEventListener("DOMContentLoaded", fetchOrders);


document.addEventListener("DOMContentLoaded", function () {
    loadFilamentColors();
});

// Function to add a filament color
document.getElementById("addFilamentColorForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    const token = localStorage.getItem("adminToken");

    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/filament-colors`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` },
            body: formData
        });

        const result = await response.json();
        document.getElementById("colorMessage").textContent = result.message;

        if (response.ok) {
            this.reset();
            loadFilamentColors(); // Reload colors
        }
    } catch (error) {
        console.error("Error adding filament color:", error);
        document.getElementById("colorMessage").textContent = "❌ Failed to add filament color.";
    }
});

// Function to fetch and display filament colors
async function loadFilamentColors() {
    try {
        const token = localStorage.getItem("adminToken");
        const response = await fetch(`${API_BASE_URL}/api/admin/filament-colors`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });

        const colors = await response.json();
        const tableBody = document.getElementById("filamentColorsTable");
        tableBody.innerHTML = "";

        colors.forEach(color => {
            const row = `
                <tr>
                    <td>${color.name}</td>
                    <td>${color.type}</td>
                    <td><img src="${color.image}" alt="${color.name}" width="50"></td>
                    <td><button class="btn btn-danger" onclick="deleteFilamentColor('${color._id}')">Delete</button></td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error("Error loading filament colors:", error);
    }
}

// Function to delete a filament color
async function deleteFilamentColor(colorId) {
    if (!confirm("Are you sure you want to delete this color?")) return;

    try {
        const token = localStorage.getItem("adminToken");
        await fetch(`${API_BASE_URL}/api/admin/filament-colors/${colorId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        loadFilamentColors();
    } catch (error) {
        console.error("Error deleting filament color:", error);
    }
}

async function loadFilamentColors() {
    try {
        const token = localStorage.getItem("adminToken");
        const response = await fetch(`${API_BASE_URL}/api/admin/filament-colors`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });

        const colors = await response.json();
        const tableBody = document.getElementById("filamentColorsTable");
        tableBody.innerHTML = ""; // Clear previous entries

        if (colors.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="4" class="text-center">No filament colors available.</td></tr>';
            return;
        }

        colors.forEach(color => {
            const row = `
                <tr>
                    <td>${color.name}</td>
                    <td>${color.type}</td>
                    <td><img src="${color.image}" alt="${color.name}" width="50"></td>
                    <td><button class="btn btn-danger" onclick="deleteFilamentColor('${color._id}')">Delete</button></td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });

    } catch (error) {
        console.error("Error loading filament colors:", error);
        document.getElementById("filamentColorsTable").innerHTML = '<tr><td colspan="4" class="text-center text-danger">⚠️ Failed to load filament colors.</td></tr>';
    }
}

document.getElementById("view-filament-colors-tab").addEventListener("click", loadFilamentColors);



// Prevent XSS attacks
function sanitize(input) {
    return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Load contacts when the tab is clicked
document.getElementById("view-contacts-tab").addEventListener("click", loadContacts);


async function logout() {
    const token = localStorage.getItem("adminToken");

    if (token) {
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` }
        });
    }

    localStorage.removeItem("adminToken");
    window.location.href = "admin-login.html";
}


loadDashboard();
