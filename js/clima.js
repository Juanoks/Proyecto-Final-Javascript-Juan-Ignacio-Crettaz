const contenedorClima = document.getElementById('contenedor-clima');


function obtenerClima(ciudad = 'Buenos Aires') {
    const apiKey = 'b507dcc2916e4ae383010314242308';
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${ciudad}&days=7&lang=es`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const { location, current, forecast } = data;
            const temperatura = current.temp_c;
            const descripcion = current.condition.text.toLowerCase();
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


            document.body.classList.remove('soleado', 'nublado', 'lluvioso');


            if (descripcion.includes('nublado')) {
                document.body.classList.add('nublado');
            } else if (descripcion.includes('soleado')) {
                document.body.classList.add('soleado');
            } else if (descripcion.includes('lluvia') || descripcion.includes('tormenta')) {
                document.body.classList.add('lluvioso');
            } else {
                document.body.style.background = '#a7c4bc';
            }
        })
        .catch(error => {
            console.error('Error al obtener el clima:', error);
            contenedorClima.textContent = 'No se pudo obtener el clima.';
        });
}


obtenerClima();