document.addEventListener("DOMContentLoaded", async function () {
    const warehouseContainer = document.getElementById("warehouseContainer");

    try {
        const response = await fetch("https://custom3d-backend.onrender.com/api/products");
        const products = await response.json();

        if (!warehouseContainer) {
            console.error("Error: 'warehouseContainer' element not found.");
            return;
        }

        warehouseContainer.innerHTML = "";

        if (products.length === 0) {
            warehouseContainer.innerHTML = '<p class="text-center">No products available.</p>';
            return;
        }

        products.forEach(product => {
            const productCard = `
                <div class="col-md-4">
                    <div class="card mb-4 shadow-sm">
                        <img src="https://custom3d-backend.onrender.com${product.image}" class="card-img-top" alt="${product.name}">
                        <div class="card-body">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text">${product.description}</p>
                            <p class="text-muted">$${product.price}</p>
                        </div>
                    </div>
                </div>
            `;
            warehouseContainer.innerHTML += productCard;
        });

    } catch (error) {
        console.error("❌ Error fetching warehouse products:", error);
        warehouseContainer.innerHTML = '<p class="text-center text-danger">Failed to load products.</p>';
    }
});
