// Elementos del DOM
const listadoLibros = document.getElementById('listadoLibros');
const botonAgregar = document.getElementById('agregarLibro');
const resultado = document.getElementById('resultado');
const botonVaciar = document.getElementById('vaciarLibreria');
const botonCaro = document.getElementById('libroCaro');
const botonViejo = document.getElementById('libroViejo');

// Función para cargar libros desde localStorage
function cargarLibros() {
    let libros = JSON.parse(localStorage.getItem('libros')) || [];
    return libros;
}

// Función para guardar libros en localStorage
function guardarLibros(libros) {
    localStorage.setItem('libros', JSON.stringify(libros));
}

// Función para actualizar estado botones
function actualizarEstadoBotones() {
    let libros = cargarLibros();
    const estado = libros.length === 0;

    botonVaciar.disabled = estado;
    botonCaro.disabled = estado;
    botonViejo.disabled = estado;
}

// Función para mostrar libros en la tabla
function mostrarLibros() {
    listadoLibros.innerHTML = "<h2>Libros Ingresados</h2>"; // Limpiar contenido previo
    let libros = cargarLibros();

    if (libros.length === 0) {
        const advertencia = document.createElement('p');
        advertencia.innerHTML = "<p>No hay libros cargados</p>";
        advertencia.classList.add('advertencia');
        listadoLibros.appendChild(advertencia);
        actualizarEstadoBotones();
        return;
    }

    const tablaLibros = document.createElement('table');
    tablaLibros.innerHTML = `
        <thead>
            <tr>
                <th>Título</th>
                <th>Año</th>
                <th>Precio</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

    const tbody = tablaLibros.querySelector('tbody');

    libros.forEach((libro, index) => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${libro.titulo}</td>
            <td>${libro.anio}</td>
            <td>$${libro.precio}</td>
            <td><button class="borrar" data-index="${index}">Borrar</button></td>
        `;
        tbody.appendChild(fila);
    });

    listadoLibros.appendChild(tablaLibros);

    // Agregar eventos a los botones de borrar
    document.querySelectorAll('.borrar').forEach(boton => {
        boton.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            borrarLibro(index);
        });
    });

    actualizarEstadoBotones();
}

// Función para agregar un libro
function agregarLibro() {
    const titulo = document.getElementById('titulo').value.trim();
    const anio = parseInt(document.getElementById('anio').value);
    const precio = parseFloat(document.getElementById('precio').value);

    if (!titulo || isNaN(anio) || isNaN(precio)) {
        alert("Por favor, complete todos los campos correctamente.");
        return;
    }

    let libros = cargarLibros();
    libros.push({ titulo, anio, precio });
    guardarLibros(libros);
    mostrarLibros();

    // Limpiar inputs
    document.getElementById('titulo').value = "";
    document.getElementById('anio').value = "";
    document.getElementById('precio').value = "";
}

// Función para borrar un libro por índice
function borrarLibro(index) {
    let libros = cargarLibros();
    libros.splice(index, 1);
    guardarLibros(libros);
    mostrarLibros();
}

// Función para vaciar toda la librería con confirmación
function vaciarLibreria() {
    const confirmacion = confirm("¿Estás seguro de que deseas eliminar todos los libros?");
    if (confirmacion) {
        localStorage.removeItem('libros');
        mostrarLibros();
    }
}

// Función para mostrar libro mas caro  
function mostrarLibroMasCaro(){
    resultado.innerHTML = "";
    let libros = cargarLibros();
    let libroMasCaro = libros[0];
    for (let i = 1; i < libros.length; i++){
        if (libros[i].precio > libroMasCaro.precio){
            libroMasCaro = libros[i];
        }
    }
    resultado.innerHTML = "<p>El libro más caro es " + libroMasCaro.titulo + ", y cuesta $" + libroMasCaro.precio +" </p>";
    return;
}

// Función para mostrar libro mas viejo
function mostrarLibroMasViejo(){
    resultado.innerHTML = "";
    let libros = cargarLibros();
    let libroMasViejo = libros[0];
    for (let i = 1; i < libros.length; i++){
        if (libros[i].anio < libroMasViejo.anio){
            libroMasViejo = libros[i];
        }
    }
    resultado.innerHTML = "<p>El libro más viejo es " + libroMasViejo.titulo + ", publicado en el año " + libroMasViejo.anio +" </p>";
    return;
}

// Eventos
botonAgregar.addEventListener('click', agregarLibro);
botonVaciar.addEventListener('click', vaciarLibreria);
botonCaro.addEventListener('click', mostrarLibroMasCaro);
botonViejo.addEventListener('click', mostrarLibroMasViejo);

// Borrar contenido de resultado al hacer click en cualquier otro botón
document.addEventListener('click', (event) => {
    const botonesIgnorados = [botonCaro, botonViejo];

    if (event.target.tagName === 'BUTTON' && !botonesIgnorados.includes(event.target)) {
        resultado.innerHTML = "";
    }
});

// Cargar y mostrar libros al iniciar
mostrarLibros();
