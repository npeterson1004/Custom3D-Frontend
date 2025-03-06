import { API_BASE_URL } from "./config.js";

// ✅ Load Filament Colors when "View Filament Colors" tab is clicked
document.getElementById("view-filament-tab").addEventListener("click", loadFilamentColors);

// ✅ Function to add a filament color
document.getElementById("addFilamentColorForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    const token = localStorage.getItem("adminToken");

    try {
        const response = await fetch(`${API_BASE_URL}/api/filament-colors`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` },
            body: formData
        });

        const result = await response.json();
        document.getElementById("colorMessage").textContent = result.message;

        if (response.ok) {
            this.reset();
        }
    } catch (error) {
        console.error("Error adding filament color:", error);
        document.getElementById("colorMessage").textContent = "❌ Failed to add filament color.";
    }
});

// ✅ Function to fetch and display filament colors
async function loadFilamentColors() {
    try {
        const token = localStorage.getItem("adminToken");
        const response = await fetch(`${API_BASE_URL}/api/filament-colors`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });

        const colors = await response.json();
        const tableBody = document.getElementById("filamentColorsTable");
        tableBody.innerHTML = "";

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
                    <td>
                        <button class="btn btn-danger" onclick="deleteFilamentColor('${color._id}')">Delete</button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });

    } catch (error) {
        console.error("Error loading filament colors:", error);
        document.getElementById("filamentColorsTable").innerHTML = '<tr><td colspan="4" class="text-center text-danger">⚠️ Failed to load filament colors.</td></tr>';
    }
}

// ✅ Function to delete a filament color
async function deleteFilamentColor(colorId) {
    if (!confirm("Are you sure you want to delete this color?")) return;

    try {
        const token = localStorage.getItem("adminToken");
        await fetch(`${API_BASE_URL}/api/filament-colors/${colorId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        loadFilamentColors();
    } catch (error) {
        console.error("Error deleting filament color:", error);
    }
}
