// Elementos del DOM
const listadoLibros = document.getElementById('listadoLibros');
const contenedor = document.getElementById('items-carrito');
const divCarrito = document.getElementById('divCarrito');
const btnToggleCarrito = document.getElementById('toggleCarrito');
const btnFinalizarCompra = document.getElementById('finalizar-compra');
const tituloCarrito = document.querySelector("#divCarrito h2"); // Seleccionamos el título
let carrito = [];

//Función para cargar libros desde JSON
async function cargarLibrosJSON(){
    try {
        const response = await fetch('books.json');
        const data = await response.json();
        return data.books;
    } catch (error) {
        console.error("Error al cargar los libros:", error);
    }
}

// Función para mostrar libros
async function mostrarLibros() {
    let libros = await cargarLibrosJSON();

    if (!libros) {
        listadoLibros.innerHTML += "<p>Error al cargar los libros.</p>";
        return;
    }

    libros.forEach(libro => {
        const bookCard = document.createElement("div");
        bookCard.classList.add("book-card");

        bookCard.innerHTML = `
            <img src="${libro.img}" alt="${libro.title}">
            <h3>${libro.title}</h3>
            <p><strong>Autor:</strong> ${libro.author}</p>
            <p><strong>Año:</strong> ${libro.year}</p>
            <p><strong>Precio:</strong> $${libro.price}</p>
            <button onclick="agregarCarrito('${libro.title}', ${libro.price})">Agregar al Carrito</button>
        `;

        listadoLibros.appendChild(bookCard);
    });
};

// Función para actualizar el carrito
function actualizarCarrito() {
    contenedor.innerHTML = '';
    carrito.forEach((item, index) => {
        const elemento = document.createElement('div');
        elemento.className = 'item-carrito';
        elemento.innerHTML = `
            <span>${item.nombre} - $${item.precio}</span>
            <button onclick="eliminarProducto(${index})">Eliminar</button>
        `;
        contenedor.appendChild(elemento);
    });
}

// Función para agregar un producto al carrito
function agregarCarrito(nombre, precio) {
    carrito.push({ nombre, precio });
    Toastify({
        text: `¡${nombre} agregado al carrito!`,
        duration: 2000,
        gravity: "bottom",
        position: "right",
        style: {
            background: "#4CAF50",
        }
    }).showToast();

    actualizarCarrito();
}

// Función para eliminar un producto del carrito
function eliminarProducto(index) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¿Quieres eliminar este producto?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        confirmButtonColor: "#d33",
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            carrito.splice(index, 1);
            actualizarCarrito();
            Toastify({
                text: "Producto eliminado",
                duration: 2000,
                gravity: "bottom",
                style: {
                    background: "#ff4444",
                }
            }).showToast();
        }
    });
}

// Función para finalizar la compra
function finalizarCompra() {
    if (carrito.length === 0) {
        Swal.fire('El carrito está vacío', 'Agrega algunos productos', 'info');
        return;
    }

    const total = carrito.reduce((sum, item) => sum + item.precio, 0);
    
    Swal.fire({
        title: 'Resumen de compra',
        html: `<p>Total a pagar: $${total}</p><p>¿Deseas confirmar tu compra?</p>`, 
        icon: 'question', 
        showCancelButton: true,
        confirmButtonText: 'Confirmar', 
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            carrito = [];
            actualizarCarrito();
            Swal.fire('¡Compra exitosa!', 'Gracias por tu compra', 'success');
        }
    });
}

// Función para alternar la visibilidad del carrito
function toggleCarrito() {
    divCarrito.classList.toggle('visible');
}

// Evento para mostrar/ocultar carrito al hacer clic en el botón
btnToggleCarrito.addEventListener('click', toggleCarrito);

// Evento para cerrar el carrito al hacer clic en el título "Carrito de Compras"
tituloCarrito.addEventListener('click', () => {
    if (divCarrito.classList.contains('visible')) {
        divCarrito.classList.remove('visible');
    }
});

// Evento para finalizar la compra
btnFinalizarCompra.addEventListener('click', finalizarCompra);

// Cargar y mostrar libros al iniciar
mostrarLibros();
