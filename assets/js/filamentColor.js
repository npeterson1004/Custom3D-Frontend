//filamentColor.js
import { API_BASE_URL } from "./config.js";


document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ FilamentColor.js Loaded");

    const addFilamentForm = document.querySelector("#addFilamentColorForm");

    if (addFilamentForm) {
        addFilamentForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            const formData = new FormData(this);
            const token = localStorage.getItem("adminToken");

            try {
                console.log("📌 Adding Filament Color...");
                const response = await fetch(`${API_BASE_URL}/api/filament-colors`, {
                    method: "POST",
                    headers: { "Authorization": `Bearer ${token}` }, // ✅ FormData does NOT need 'Content-Type'
                    body: formData
                });

                const result = await response.json();
                console.log("✅ Response:", result);

                document.querySelector("#colorMessage").textContent = result.message;

                if (response.ok) {
                    this.reset();
                    loadFilamentColors(); // ✅ Refresh table after adding a color
                }
            } catch (error) {
                console.error("❌ Error adding filament color:", error);
                document.querySelector("#colorMessage").textContent = "❌ Failed to add filament color.";
            }
        });
    }
});


// ✅ Load filament colors when "View Filament Colors" is clicked
document.addEventListener("DOMContentLoaded", function () {
    const viewFilamentTab = document.querySelector("#view-filament-colors-tab");
    if (viewFilamentTab) {
        viewFilamentTab.addEventListener("click", function () {
            console.log("📌 View Filament Colors Tab Clicked");
            loadFilamentColors();
        });
    } else {
        console.warn("⚠️ Warning: #view-filament-colors-tab not found!");
    }
});




// ✅ Load filament colors and allow toggling between images
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
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${color.name}</td>
                <td>${color.type}</td>
                <td>
                    <div class="image-container" style="display: flex; align-items: center;">
                        <button class="arrow-btn left-arrow" data-color-id="${color._id}">⬅</button>
                        <img src="${color.images[0]}" class="filament-image" style="width: 40px; height: 40px; margin-right: 5px;"
                             data-index="0" data-color-id="${color._id}" 
                             alt="${color.name}" width="80" style="margin: 0 10px;">
                        <button class="arrow-btn right-arrow" data-color-id="${color._id}">➡</button>
                    </div>
                </td>
                <td>
                    <button class="btn btn-danger" onclick="deleteFilamentColor('${color._id}')">Delete</button>
                </td>
            `;

            tableBody.appendChild(row);
        });

        // ✅ Attach event listeners for arrows
        document.querySelectorAll(".arrow-btn").forEach(button => {
            button.addEventListener("click", function () {
                const colorId = this.getAttribute("data-color-id");
                const imgElement = document.querySelector(`img[data-color-id='${colorId}']`);
                const currentIndex = parseInt(imgElement.getAttribute("data-index"), 10);
                const color = colors.find(c => c._id === colorId);

                if (!color || !color.images || color.images.length < 2) return;

                let newIndex = currentIndex;
                if (this.classList.contains("left-arrow")) {
                    newIndex = currentIndex === 0 ? 1 : 0; // Toggle between 0 and 1
                } else if (this.classList.contains("right-arrow")) {
                    newIndex = currentIndex === 0 ? 1 : 0;
                }

                imgElement.src = color.images[newIndex];
                imgElement.setAttribute("data-index", newIndex);
            });
        });

    } catch (error) {
        console.error("❌ Error loading filament colors:", error);
    }
}

// ✅ Ensure function is available globally
window.loadFilamentColors = loadFilamentColors;


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