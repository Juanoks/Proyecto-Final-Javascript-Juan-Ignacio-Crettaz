const entradaTarea = document.getElementById('entrada-nueva-tarea');
const botonAgregarTarea = document.getElementById('boton-agregar-tarea');
const listaTareas = document.getElementById('lista-tareas');
const entradaBusquedaTarea = document.getElementById('entrada-busqueda-tarea');

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
}


function cargarTareas() {
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


cargarTareas();