// URL del archivo JSON con datos de ferretería
const ferreteriaDataURL = 'productos.json';

// Arreglo para almacenar productos cargados desde el JSON
let productos = [];

// Arreglo para almacenar productos en el carrito
let cart = [];

// Función para cargar productos desde el JSON
async function loadProductsFromJSON() {
  try {
    const response = await fetch(ferreteriaDataURL);
    const data = await response.json();
    productos = data.productos;
    loadProducts(); // Llamada a la función loadProducts después de cargar los productos desde el JSON
  } catch (error) {
    console.error('Error al cargar datos desde el JSON:', error);
  }
}

// Llamada a la función para cargar productos al cargar la página
loadProductsFromJSON();

// Función para cargar productos en la tabla de registro
function loadProducts() {
  const tableBody = document.getElementById("productTableBody");
  tableBody.innerHTML = "";
  productos.forEach(product => {
    const row = `<tr>
      <td>${product.id}</td>
      <td>${product.nombre}</td>
      <td>${product.descripción}</td>
      <td>${product.cantidad}</td>
      <td>${product.costo}</td>
      <td><button onclick="addToCart(${product.id})">Agregar al Carrito</button></td>
    </tr>`;
    tableBody.innerHTML += row;
  });
}

function addToCart(productId) {
  const product = productos.find(p => p.id === productId);

  if (product && product.cantidad > 0) {
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
      cartItem.quantity++;
    } else {
      cart.push({
        id: product.id,
        name: product.nombre,
        cost: product.costo,
        quantity: 1
      });
    }

    product.cantidad--;
    loadProducts();
    updateCart();
  } else {
    alert("No hay stock disponible para este producto.");
  }
}






// Función para actualizar la tabla del carrito
function updateCart() {
  cartTable.innerHTML = "";
  let totalPrice = 0;
  cart.forEach(item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>${item.cost}</td>
      <td>${item.quantity * item.cost}</td>
      <td><button onclick="removeFromCart(${item.id})">Eliminar</button></td>
    `;
    cartTable.appendChild(row);
    totalPrice += item.quantity * item.cost;
  });
  document.getElementById("totalPrice").textContent = totalPrice;
}

function removeFromCart(productId) {
  const product = productos.find(p => p.id === productId);
  const cartItem = cart.find(item => item.id === productId);
  
  if (product && cartItem) {
    product.cantidad += cartItem.quantity;
    cart = cart.filter(item => item.id !== productId);
    updateCart();
  } else {
    console.error("Error al eliminar del carrito: Producto no encontrado en el carrito.");
  }
}


// Función para realizar la compra
function buy() {
  const paymentMethod = prompt("Seleccione el método de pago: Efectivo, Crédito o Débito");
  let totalPrice = cart.reduce((total, item) => total + item.quantity * item.cost, 0);

  if (paymentMethod.toLowerCase() === "efectivo") {
    totalPrice *= 0.9; // Aplica el 10% de descuento
  } else if (paymentMethod.toLowerCase() === "crédito") {
    totalPrice *= 1.07; // Aplica el 7% de aumento
  }

  alert(`Compra realizada. Total a pagar: ${totalPrice.toFixed(2)} pesos.`);
  cart = [];
  updateCart();
}

// Carga inicial de productos y carrito
loadProducts();
updateCart();
