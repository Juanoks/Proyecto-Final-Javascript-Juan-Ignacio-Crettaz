const entradaTarea = document.getElementById('entrada-nueva-tarea');
const botonAgregarTarea = document.getElementById('boton-agregar-tarea');
const listaTareas = document.getElementById('lista-tareas');
const entradaBusquedaTarea = document.getElementById('entrada-busqueda-tarea');
const contenedorClima = document.getElementById('contenedor-clima');

botonAgregarTarea.addEventListener('click', agregarTarea);
entradaBusquedaTarea.addEventListener('input', filtrarTareas);

obtenerClima();

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

function obtenerClima(ciudad = 'Buenos Aires') {
    const apiKey = 'b507dcc2916e4ae383010314242308';
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${ciudad}&days=7&lang=es`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const { location, current, forecast } = data;
            const temperatura = current.temp_c;
            const descripcion = current.condition.text;
            const icono = current.condition.icon;

            let html = `
                <div class="clima-info">
                    <h2>Clima en ${location.name}</h2>
                    <img src="${icono}" alt="${descripcion}">
                    <p>${temperatura}°C, ${descripcion}</p>
                </div>
            `;

            html += '<div class="pronostico-semanal">';
            forecast.forecastday.forEach(day => {
                const fecha = new Date(day.date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
                const iconoDia = day.day.condition.icon;
                const descripcionDia = day.day.condition.text;
                const maxTemp = day.day.maxtemp_c;
                const minTemp = day.day.mintemp_c;

                html += `
                    <div class="pronostico-dia">
                        <h3>${fecha}</h3>
                        <img src="${iconoDia}" alt="${descripcionDia}">
                        <p>${maxTemp}°C / ${minTemp}°C</p>
                        <p>${descripcionDia}</p>
                    </div>
                `;
            });
            html += '</div>';

            contenedorClima.innerHTML = html;

            if (descripcion.includes('nublado')) {
                document.body.style.backgroundColor = '#d3d3d3';
            } else if (descripcion.includes('soleado')) {
                document.body.style.backgroundColor = '#ffe57f';
            } else {
                document.body.style.backgroundColor = '#a7c4bc';
            }
        })
        .catch(error => {
            console.error('Error al obtener el clima:', error);
            contenedorClima.textContent = 'No se pudo obtener el clima.';
        });
}


cargarTareas();
