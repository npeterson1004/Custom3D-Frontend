import { API_BASE_URL } from "./config.js"; // ✅ Ensure correct API base URL

document.addEventListener("DOMContentLoaded", () => {
    loadCart();
});

// ✅ Load Cart Items from Local Storage
function loadCart() {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    const cartTable = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");

    cartTable.innerHTML = "";
    let total = 0;

    if (cartItems.length === 0) {
        cartTable.innerHTML = '<tr><td colspan="6" class="text-center">Your cart is empty.</td></tr>';
        cartTotal.textContent = "0.00";
        return;
    }

    cartItems.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const row = `
            <tr>
                <td><img src="${item.image}" alt="${item.name}" style="width: 50px;"></td>
                <td>${item.name}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>
                    <input type="number" min="1" value="${item.quantity}" onchange="updateQuantity(${index}, this.value)">
                </td>
                <td>$${itemTotal.toFixed(2)}</td>
                <td><button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">Remove</button></td>
            </tr>
        `;
        cartTable.innerHTML += row;
    });

    cartTotal.textContent = total.toFixed(2);
}

// ✅ Add Item to Cart
function addToCart(name, price, image) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, image, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}

// ✅ Update Quantity in Cart
function updateQuantity(index, quantity) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (quantity > 0) {
        cart[index].quantity = parseInt(quantity);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}

// ✅ Remove Item from Cart
function removeFromCart(index) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}

// ✅ Send Order to Admin
async function sendOrder() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const token = localStorage.getItem("token") || localStorage.getItem("adminToken");

    if (!token) {
        alert("Please log in to place an order.");
        window.location.href = "login.html";
        return;
    }

    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const userEmail = localStorage.getItem("userEmail");

    const orderData = { userEmail, items: cart, totalAmount };

    try {
        const response = await fetch(`${API_BASE_URL}/api/orders`, {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(orderData)
        });

        const result = await response.json();

        if (response.ok) {
            alert("✅ Order placed successfully!");
            localStorage.removeItem("cart");
            loadCart();
        } else {
            alert(`❌ Error: ${result.error}`);
        }
    } catch (error) {
        console.error("❌ Error placing order:", error);
        alert("❌ Failed to place order.");
    }
}

// ✅ Make functions globally accessible
window.addToCart = addToCart;
window.sendOrder = sendOrder;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
