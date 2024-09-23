let gif = document.getElementById('loading');

function mostrarGIF() {
    gif.classList.remove('hidden');
}

function ocultarGIF() {
    gif.classList.add('hidden');
}

// Cargar y mostrar filtros
async function datosfiltros() {
    try {
       
        let respuesta = await fetch(`https://rickandmortyapi.com/api/character`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            }
        });

        let datos = await respuesta.json();
        let conjuntoEspecies = new Set();

        for (let pagina = 1; pagina <= datos.info.pages; pagina++) {
            let respuestaPagina = await fetch(`https://rickandmortyapi.com/api/character/?page=${pagina}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                }
            });

            let datosPagina = await respuestaPagina.json();
            datosPagina.results.forEach(elemento => {
                conjuntoEspecies.add(elemento.species);
            });
        }

        mostarfiltros(conjuntoEspecies);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        
    }
}

function mostarfiltros(especies) {
    let divFiltros = document.getElementById('filters');
    
    especies.forEach(species => {
        let divGrupo = document.createElement('div');
        divGrupo.classList.add('filter');
        divGrupo.textContent = species;
        divGrupo.addEventListener('click', () => {
            document.querySelectorAll('.filter.selected').forEach(element => element.classList.remove('selected'));
            divGrupo.classList.add('selected');
            filtrarEspecies(species);
        });
        divFiltros.appendChild(divGrupo);
    });
}

// Mostrar las especies seleccionadas
function filtrarEspecies(especieSeleccionada) {
    let tarjetas = document.querySelectorAll('.card');
    tarjetas.forEach(tarjeta => {
        if (tarjeta.querySelector('.status h2').textContent.includes(especieSeleccionada)) {
            tarjeta.classList.remove('opacity');
        } else {
            tarjeta.classList.add('opacity');
        }
    });
}

// Cargar y mostrar personajes
let paginaActual = 1;
let cargando = false;

window.addEventListener('scroll', async () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !cargando) {
        cargando = true;
        await datospersonajes();
        cargando = false;
    }
});

async function datospersonajes() {
    try {
        mostrarGIF();
        let respuesta = await fetch(`https://rickandmortyapi.com/api/character/?page=${paginaActual}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            }
        });

        let datos = await respuesta.json();
        mostrarpersonajes(datos);
        paginaActual++;

    } catch (error) {
        console.error('Error:', error);
    } finally {
        ocultarGIF();
    }
}

// Mostrar Personajes
function mostrarpersonajes(datos) {
    let divTarjetas = document.getElementById('cards');

    datos.results.forEach(async (personaje) => {
        try {
            let respuestaEpisodio = await fetch(personaje.episode[0], {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                }
            });

            let datosEpisodio = await respuestaEpisodio.json();

            // Crear la tarjeta para cada personaje
            let tarjeta = document.createElement('div');
            tarjeta.classList.add('card');
            tarjeta.innerHTML = `
                <img src="${personaje.image}">
                <div class="data">
                    <h1>${personaje.name}</h1>
                    <div class="status">
                        <span class="status_icon"></span>
                        <h2>${personaje.status} - ${personaje.species}</h2>
                    </div>
                    <h3>Last known location</h3>
                    <span>${personaje.location.name}</span>
                    <h3>First seen in</h3>
                    <span class="last_seen">${datosEpisodio.name}</span>
                </div>
            `;

            let iconoestado = tarjeta.querySelector('.status_icon');
            switch (personaje.status) {
                case 'Alive':
                    iconoestado.classList.add('green')
                    break;
                case 'Dead':
                    iconoestado.classList.add('red')
                    break;
                default:
                    iconoestado.classList.add('yellow')
            }

            divTarjetas.appendChild(tarjeta);

        } catch (error) {
            console.error('Error:', error);
        }
    });
}

datosfiltros();
datospersonajes();
