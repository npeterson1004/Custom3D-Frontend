//Home.js
async function fetchProducts() {
    const res = await fetch('http://localhost:5000/api/products');
    const products = await res.json();
    document.getElementById('products').innerHTML = products.map(p => `
        <div>
            <h3>${p.name}</h3>
            <p>${p.description}</p>
            <img src="${p.image}" width="100">
        </div>
    `).join('');
}
fetchProducts();
