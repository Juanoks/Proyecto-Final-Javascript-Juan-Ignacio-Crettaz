const entradaTarea = document.getElementById('entrada-nueva-tarea');
const botonAgregarTarea = document.getElementById('boton-agregar-tarea');
const listaTareas = document.getElementById('lista-tareas');
const entradaBusquedaTarea = document.getElementById('entrada-busqueda-tarea');
const mensajeError = document.getElementById('mensaje-error');

botonAgregarTarea.addEventListener('click', agregarTarea);
entradaBusquedaTarea.addEventListener('input', filtrarTareas);
entradaTarea.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        agregarTarea();
    }
});

function agregarTarea() {
    const textoTarea = entradaTarea.value.trim();
    if (textoTarea) {
        const li = crearElementoTarea(textoTarea);
        listaTareas.appendChild(li);
        entradaTarea.value = '';
        guardarTareas();
        mostrarMensajeError(''); 
    }
}

function crearElementoTarea(texto) {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = texto;
    li.appendChild(span);

    const botonCompletar = crearBoton('Completar', () => {
        li.classList.toggle('completada');
        guardarTareas();
    });

    const botonEliminar = crearBoton('Eliminar', () => {
        li.remove();
        guardarTareas();
    });

    li.appendChild(botonCompletar);
    li.appendChild(botonEliminar);
    return li;
}

function crearBoton(texto, accion) {
    const boton = document.createElement('button');
    boton.textContent = texto;
    boton.addEventListener('click', accion);
    return boton;
}

function guardarTareas() {
    try {
        const tareas = [];
        listaTareas.querySelectorAll('li').forEach(li => {
            const texto = li.querySelector('span').textContent;
            const completada = li.classList.contains('completada');
            const tarea = {
                texto: texto,
                completada: completada
            };
            tareas.push(tarea);
        });
        localStorage.setItem('tareas', JSON.stringify(tareas));
        mostrarMensajeError(''); 
    } catch (error) {
        console.error("Error al guardar tareas en localStorage:", error);
        mostrarMensajeError("Hubo un problema al guardar las tareas. Por favor, inténtalo nuevamente.");
    }
}

function cargarTareas() {
    try {
        const tareas = JSON.parse(localStorage.getItem('tareas'));
        if (tareas) {
            tareas.forEach(tarea => {
                const li = crearElementoTarea(tarea.texto);
                if (tarea.completada) {
                    li.classList.add('completada');
                }
                listaTareas.appendChild(li);
            });
        }
        mostrarMensajeError(''); 
    } catch (error) {
        console.error("Error al cargar tareas desde localStorage:", error);
        mostrarMensajeError("Hubo un problema al cargar tus tareas. Se mostrarán las tareas vacías por ahora.");
    }
}

function filtrarTareas() {
    const filtro = entradaBusquedaTarea.value.toLowerCase();
    listaTareas.querySelectorAll('li').forEach(li => {
        const texto = li.querySelector('span').textContent.toLowerCase();
        if (texto.includes(filtro)) {
            li.style.display = '';
        } else {
            li.style.display = 'none';
        }
    });
} 

function mostrarMensajeError(mensaje) {
    mensajeError.textContent = mensaje;
    mensajeError.style.display = mensaje ? 'block' : 'none';
}

cargarTareas();