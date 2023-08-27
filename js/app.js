//cargo los productos desde el archivo json en un array vacio con fetch
let productos = [];
fetch("../js/productos.json")
	.then(response => response.json())
	.then(data => {
		productos = data;
		mostrarProductos(productos);
	})
//declaro la variable carrito con el contenido de localStorage y si no hay se crea comoo un array vacío
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// muestro los productos
const mostrarProductos = (productos) => {
	// Capturo el contenedor donde voy a renderizar los productos
	const contenedorProductos = document.querySelector(".product-list");
	// Limpio el contenedor por si habia algo de antemano
	contenedorProductos.innerHTML = "";
	// Recorro el array y por cada uno creo una card para mostrar en pantalla
	productos.forEach((producto) => {
		const li = document.createElement("li");
		li.innerHTML = `
    <img src="${producto.imagen}" alt="${producto.nombre}" />
    <h3>${producto.nombre}</h3>
    <p class="product-description">${producto.descripcion}</p>
    <p class="product-price">$${producto.precio}</p>
    <button id="agregar-${producto.id}" class="add-to-cart">Agregar al carrito</button>
    `;
		// Agrego la card al contenedor
		contenedorProductos.appendChild(li);
		// Ahora la card está en el dom El boton ya existe por lo tanto lo capturo
		const boton = document.getElementById(`agregar-${producto.id}`);
		// Agrego evento al botón capturado
		boton.addEventListener("click", () => {
			// Si hacemos clic en el boton se agrega al carrito
			agregarAlCarrito(producto.id);
		});
	});
};

//agrego un producto al carrito

const agregarAlCarrito = (id) => {
	Toastify({
		text: "Producto Agregado",
		duration: 3000,
		destination: "https://github.com/apvarun/toastify-js",
		newWindow: true,
		close: true,
		gravity: "top", // `top` or `bottom`
		position: "right", // `left`, `center` or `right`
		stopOnFocus: true, // Prevents dismissing of toast on hover
		style: {
			background: "linear-gradient(to right, #e76800, #96c93d)",
			borderRadius : "5rem",
		},
		onClick: function(){} // Callback after click
	  }).showToast();
	// Si el producto no está en el carrito lo agregamos
	if (!carrito.some((producto) => producto.id === id)) {
		// Buscamos el producto en el array de productos
		const producto = productos.find((producto) => producto.id === id);
		// Agregamos un nuevo objeto con el contenido del producto y un campo cantidad en 1
		carrito.push({ ...producto, cantidad: 1 });
	} else {
		// Si el producto esta en el carrito lo buscamos y le incrementamos las unidades
		const producto = carrito.find((producto) => producto.id === id);
		producto.cantidad++;
	}
	// Guardamos el carrito en el localStorage para tenerlo actualizado si recargamos la página porque hicimos cambios
	localStorage.setItem("carrito", JSON.stringify(carrito));
	// Actualizamos la vista del carrito porque hemos hecho cambios
	mostrarCarrito();
};

const mostrarCarrito = () => {
	// Capturo el contenedor donde voy a renderizar los productos
	const contenedorCarrito = document.querySelector(".carrito");
	// Limpio el contenedor por si había algo anteriormente
	contenedorCarrito.innerHTML = "";
	// Sólo agregaremos un contenedor con productos si el carrito no está vacío
	if (carrito.length > 0) {
		// Creo el contenedor donde colocaré los productos y lo agrego al dom
		const productsCart = document.createElement("ul");
		productsCart.classList.add("productsCart");
		contenedorCarrito.appendChild(productsCart);
		// Creo el contenedor donde colocaré el total lo calculo y lo agrego al dom
		const contenedorTotal = document.createElement("p");
		actualizarTotal(contenedorTotal);
		contenedorCarrito.appendChild(contenedorTotal);
		// Recorro el array y por cada uno creo una card para mostrar en pantalla
		carrito.forEach((producto) => {
			const li = document.createElement("li");
			li.innerHTML = `
			<img src="${producto.imagen}" alt="${producto.nombre}" />
			<div class="productContent">
				<h3>${producto.nombre}</h3>
				<p class="product-description">${producto.descripcion}</p>
				<p class="product-price">$${producto.precio}</p>
				<div class="counter">
				<button id="decrementar-${producto.id}" class="button">-</button>
				<span class="product-price">${producto.cantidad}u.</span>
				<button id="incrementar-${producto.id}" class="button">+</button>
				</div>
			</div>
			<button id="eliminar-${producto.id}" class="remove">Eliminar</button>
		`;
			// Agrego la card al contenedor
			productsCart.appendChild(li);
			// Ahora la card está en el dom
			// El botón ya existe por lo tanto lo capturo
			const boton = document.getElementById(`eliminar-${producto.id}`);
			// Agrego evento al botón capturado
			boton.addEventListener("click", () => {
				// Si hacemos clic en el botón se elimina del carrito
				eliminarProducto(producto.id);
			});

			// Agrego evento al botón decrementar
			const decrementar = document.getElementById(`decrementar-${producto.id}`);
			decrementar.addEventListener("click", () => {
				decrementarProducto(producto.id);
			});

			// Agrego evento al boton incrementar
			const incrementar = document.getElementById(`incrementar-${producto.id}`);
			incrementar.addEventListener("click", () => {
				incrementarProducto(producto.id);
			});
		});
	} else {
		// Si el carrito está vacío muestro un texto
		contenedorCarrito.innerHTML = '<p class="empty">No hay productos</p>';
	}
};

const decrementarProducto = (id) => {
	const producto = carrito.find((prod) => prod.id === id);
	// Si es 1 hay que eliminarlo porque no podemos tener cantidad cero
	if (producto.cantidad === 1) {
		eliminarProducto(producto.id);
	} else {
		producto.cantidad--;
		// Guardamos el carrito en el localStorage para tenerlo actualizado si recargamos la página porque hicimos cambios
		localStorage.setItem("carrito", JSON.stringify(carrito));
		// Actualizamos la vista del carrito porque hemos hecho cambios
		mostrarCarrito();
	}
};

const incrementarProducto = (id) => {
	const producto = carrito.find((prod) => prod.id === id);
	producto.cantidad++;
	// Guardamos el carrito en el localStorage para tenerlo actualizado si recargamos la página porque hicimos cambios
	localStorage.setItem("carrito", JSON.stringify(carrito));
	// Actualizamos la vista del carrito porque hemos hecho cambios
	mostrarCarrito();
};

const eliminarProducto = (id) => {
	//nuevo carrito con todos los productos menos el seleccionado
	carrito = carrito.filter((producto) => producto.id !== id);
	// Guardamos el carrito en el localStorage para tenerlo actualizado si recargamos la página porque hicimos cambios
	localStorage.setItem("carrito", JSON.stringify(carrito));
	// Actualizamos los cambios
	mostrarCarrito();
};

const actualizarTotal = (contenedor) => {
	const total = carrito.reduce((acumulador, producto) => acumulador + producto.precio * producto.cantidad, 0);
	contenedor.textContent = `Total a Pagar: $${total}`;
};
mostrarCarrito();