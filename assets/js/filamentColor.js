//filamentColor.js
import { API_BASE_URL } from "./config.js";

// ✅ Ensure the DOM is fully loaded before accessing elements
document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ FilamentColor.js Loaded");

    // ✅ Get elements safely
    const viewFilamentTab = document.querySelector("#view-filament-tab");
    const addFilamentForm = document.querySelector("#addFilamentColorForm");
    const filamentTable = document.querySelector("#filamentColorsTable");

    if (viewFilamentTab) {
        viewFilamentTab.addEventListener("click", loadFilamentColors);
    } else {
        console.warn("⚠️ Warning: Element #view-filament-tab not found!");
    }

    if (addFilamentForm) {
        addFilamentForm.addEventListener("submit", async function (e) {
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
                document.querySelector("#colorMessage").textContent = result.message;

                if (response.ok) {
                    this.reset();
                    loadFilamentColors(); // ✅ Refresh table after adding a color
                }
            } catch (error) {
                console.error("Error adding filament color:", error);
                document.querySelector("#colorMessage").textContent = "❌ Failed to add filament color.";
            }
        });
    } else {
        console.warn("⚠️ Warning: Element #addFilamentColorForm not found!");
    }

    if (!filamentTable) {
        console.warn("⚠️ Warning: Element #filamentColorsTable not found!");
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
        console.error("Error loading filament colors:", error);
        const tableBody = document.querySelector("#filamentColorsTable");
        if (tableBody) {
            tableBody.innerHTML = '<tr><td colspan="4" class="text-center text-danger">⚠️ Failed to load filament colors.</td></tr>';
        }
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
        console.error("Error deleting filament color:", error);
    }
}
