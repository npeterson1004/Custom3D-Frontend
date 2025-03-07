//admin-dashboard.js

import { API_BASE_URL } from "./config.js";

/* ✅ Ensure Admin is Authenticated Before Loading Dashboard */
document.addEventListener("DOMContentLoaded", function () {
    console.log("🔍 Checking Admin Token on Page Load...");

    setTimeout(() => {  
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

/* ✅ Function to Verify Admin Authentication */
async function checkAdminAuth() {
    setTimeout(async () => {
        const token = localStorage.getItem("adminToken");

        console.log("🔍 Checking Admin Token:", token);

        if (!token) {
            console.log("🚨 No admin token found. Redirecting...");
            return window.location.href = "admin-login.html";
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/dashboard`, {
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

/* ✅ Load Dashboard Data */
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

/* ✅ Handle Product Submission */
document.getElementById("addProductForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    
    // Debugging: Log FormData entries
    for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
    }

    try {
        const token = localStorage.getItem("adminToken");

        const response = await fetch(`${API_BASE_URL}/api/products`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` },
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

/* ✅ Fetch and Display Contacts */
async function loadContacts() {
    try {
        const token = localStorage.getItem("adminToken");
        if (!token) return window.location.href = "admin-login.html";

        const response = await fetch(`${API_BASE_URL}/api/contact`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("⚠️ Failed to fetch contacts.");

        const contacts = await response.json();
        const contactsContainer = document.getElementById("contactsContainer");
        contactsContainer.innerHTML = "";

        if (contacts.length === 0) {
            contactsContainer.innerHTML = '<tr><td colspan="6" class="text-center">No contact requests available.</td></tr>';
            return;
        }

        contacts.forEach(contact => {
            let fileLink = contact.fileUrl?.startsWith("http")
                ? `<a href="${contact.fileUrl}" target="_blank" download>📂 Download File</a>` 
                : "No file uploaded";

            contactsContainer.innerHTML += `
                <tr>
                    <td>${sanitize(contact.name)}</td>
                    <td>${sanitize(contact.email)}</td>
                    <td>${sanitize(contact.number)}</td>
                    <td>${sanitize(contact.description)}</td>
                    <td>${fileLink}</td>
                    <td>${new Date(contact.createdAt).toLocaleString()}</td>
                </tr>`;
        });

    } catch (error) {
        console.error("❌ Error loading contacts:", error);
    }
}

/* ✅ Fetch and Display Orders */
async function fetchOrders() {
    try {
        const token = localStorage.getItem("adminToken");
        if (!token) return window.location.href = "admin-login.html";

        const response = await fetch(`${API_BASE_URL}/api/orders`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("⚠️ Failed to fetch orders.");

        const orders = await response.json();
        const ordersContainer = document.getElementById("ordersContainer");
        ordersContainer.innerHTML = "";

        if (orders.length === 0) {
            ordersContainer.innerHTML = '<tr><td colspan="6" class="text-center">No orders available.</td></tr>';
            return;
        }

        orders.forEach(order => {
            const orderRow = document.createElement("tr");

            // ✅ Determine the color based on the payment status
            let statusColor = "";
            if (order.paymentStatus === "Completed") statusColor = "status-completed";
            else if (order.paymentStatus === "Processing Payment") statusColor = "status-processing";
            else statusColor = "status-pending"; // Default for pending

            orderRow.innerHTML = `
                <td>${order.userEmail}</td>
                <td>
                    ${order.items.map(item => `
                        <div>
                            <span class="order-quantity">${item.quantity}</span> x ${item.name}
                            ${item.color?.image 
                                ? `<img src="${item.color.image}" alt="${item.color.name}" class="tiny-color-img" style="width: 20px; height: 20px;"> <span>${item.color.name}</span>`
                                : "<span>No color selected</span>"
                            }
                        </div>
                    `).join("")}
                </td>
                <td>$${order.totalAmount.toFixed(2)}</td>
                <td>${new Date(order.orderDate).toLocaleString()}</td>
                <td>
                    <select class="payment-status-dropdown ${statusColor}" data-order-id="${order._id}">
                        <option value="Pending" ${order.paymentStatus === "Pending" ? "selected" : ""}>Pending</option>
                        <option value="Processing Payment" ${order.paymentStatus === "Processing Payment" ? "selected" : ""}>Processing Payment</option>
                        <option value="Completed" ${order.paymentStatus === "Completed" ? "selected" : ""}>Completed</option>
                    </select>
                </td>
            `;

            ordersContainer.appendChild(orderRow);
        });

        // ✅ Attach event listeners after adding rows
        document.querySelectorAll(".payment-status-dropdown").forEach(select => {
            select.addEventListener("change", function () {
                const orderId = this.getAttribute("data-order-id");
                const newStatus = this.value;
                updatePaymentStatus(orderId, newStatus);
            });
        });

    } catch (error) {
        console.error("❌ Error fetching orders:", error);
    }
}






/* ✅ Update Payment Status */
async function updatePaymentStatus(orderId, newStatus) {
    try {
        const token = localStorage.getItem("adminToken");

        const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/payment-status`, {
            method: "PATCH",
            headers: { 
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ paymentStatus: newStatus })
        });

        if (!response.ok) {
            throw new Error("❌ Failed to update payment status.");
        }

        console.log(`✅ Payment status updated successfully to ${newStatus}`);

        // ✅ Refresh orders to reflect changes
        setTimeout(fetchOrders, 500); // ✅ Delay slightly to ensure backend updates

    } catch (error) {
        console.error("❌ Error updating payment status:", error);
    }
}




// ✅ Load orders when the admin page loads
document.addEventListener("DOMContentLoaded", fetchOrders);


/* ✅ Tab Navigation - Ensure First Tab Doesn't Stay Active */
document.addEventListener("DOMContentLoaded", function () {
    const firstTab = document.querySelector(".nav-tabs .nav-item:first-child .nav-link");

    // Remove 'active' class on page load
    if (firstTab.classList.contains("active")) {
        firstTab.classList.remove("active");
    }

    // Make sure clicking tabs behaves normally
    document.querySelectorAll(".nav-tabs .nav-link").forEach(tab => {
        tab.addEventListener("click", function () {
            document.querySelectorAll(".nav-tabs .nav-link").forEach(t => t.classList.remove("active"));
            this.classList.add("active");
        });
    });
});

/* ✅ XSS Prevention */
function sanitize(input) {
    return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* ✅ Load Necessary Data */
document.getElementById("view-contacts-tab").addEventListener("click", loadContacts);
document.getElementById("view-filament-colors-tab").addEventListener("click", loadFilamentColors);
document.addEventListener("DOMContentLoaded", fetchOrders);

/* ✅ Logout Function */
async function logout() {
    localStorage.removeItem("adminToken");
    window.location.href = "admin-login.html";
}

loadDashboard();
