//filamentColor.js
import { API_BASE_URL } from "./config.js";
// ✅ Ensure function is defined globally
export async function loadFilamentColors() {
    try {
        console.log("📌 Fetching filament colors...");
        const token = localStorage.getItem("adminToken");
        const response = await fetch(`${API_BASE_URL}/api/filament-colors`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error("❌ Failed to fetch colors");
        }

        const colors = await response.json();
        console.log("✅ Colors Received:", colors);

        const tableBody = document.querySelector("#filamentColorsTable");
        if (!tableBody) {
            console.warn("⚠️ Warning: Element #filamentColorsTable not found!");
            return;
        }

        tableBody.innerHTML = ""; // Clear table before adding new data

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
        console.error("❌ Error loading filament colors:", error);
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

        loadFilamentColors(); // ✅ Refresh table after deletion
    } catch (error) {
        console.error("❌ Error deleting filament color:", error);
    }
}

// ✅ Ensure function is available globally
window.loadFilamentColors = loadFilamentColors;

// ✅ Ensure "View Filament Colors" tab loads colors
const viewFilamentTab = document.querySelector("#view-filament-colors-tab");
if (viewFilamentTab) {
    viewFilamentTab.addEventListener("click", loadFilamentColors);
} else {
    console.warn("⚠️ Warning: #view-filament-colors-tab not found!");
}