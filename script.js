// URL del archivo JSON con datos de ferretería
const ferreteriaDataURL = 'productos.json';

// Arreglo para almacenar productos cargados desde el JSON
let productos = [];

// Arreglo para almacenar productos en el carrito
let cart = [];

let tabla = document.getElementById("cartTableBody");

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
    const row = 
    `
    <tr>
      <td>${product.id}</td>
      <td>${product.nombre}</td>
      <td>${product.descripción}</td>
      <td>${product.cantidad}</td>
      <td>${product.costo}</td>
      <td><button onclick="addToCart('${product.id}')">Agregar al Carrito</button></td>
    </tr>s
    `;
    tableBody.innerHTML += row;
  });
}


// Función para actualizar la tabla del carrito
function updateCart() {
  let totalPrice = 0;
  tabla.innerHTML = '';

  cart.forEach(item => {
    const row = document.createElement("tr");
    row.setAttribute("id", `cartItem_${item.id}`)
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>${item.cost}</td>
      <td>${item.quantity * item.cost}</td>
      <td><button onclick="removeFromCart('${item.id}')">Eliminar</button></td>
    `;
    totalPrice += item.quantity * item.cost;
    tabla.appendChild(row);
  });
  
  document.getElementById("totalPrice").textContent = totalPrice;
}

function addToCart(productId) {
  let product;
  let b = false;

  for (let i = 0; i < productos.length; i++) {
    if (productId == productos[i].id) {
      product = productos[i];
      break;
    }
  }

  if (product && product.cantidad > 0) {
    for (let j = 0; j < cart.length; j++) {
      if (product.id == cart[j].id) {
        cart[j].quantity++;
        b = true;
        break;
      }
    }

    if (b == false) {
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

//Funcion para remover un articulo del carrito.
function removeFromCart(productId) {
  let product;
  for (let j = 0; j < productos.length; j++) {
    if (productId == productos[j].id) {
      product = productos[j];
      break;
    }
  }

  let cartItem;
  let cartIndex;
  for (let i = 0; i < cart.length; i++) {
    if (productId == cart[i].id) {
      cartItem = cart[i];
      cartIndex = i;
      break;
    }
  }

  if (cartItem) {
    product.cantidad += cartItem.quantity;
    
    const cartTableRow = document.getElementById(`cartItem_${productId}`);
    if (cartTableRow) {
      cartTableRow.remove();
    }
    cart.splice(cartIndex, 1);
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