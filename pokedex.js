function mostrarFiltros() {
    let option = {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        }
    }
    fetch('https://pokeapi.co/api/v2/type', option)
        .then(res => {
            if (res.status == 200) {
                return res.json();
            } else {
                throw new Error('no se pudo conectar');
            }
        })
        .then(data => {
            let filter = document.getElementById('filters');
            data.results.forEach(type => {
                let divFilter = document.createElement('div');
                divFilter.classList.add('filter');
                divFilter.textContent = type.name;
                filter.appendChild(divFilter);
                
            });
        });
}

async function mostrarPokemon(name) {
    
    let option = {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        }
    }
    let res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`, option)
    if (res.status == 200) {
        let data = await res.json();
        tarjetaPokemon(data);
        
        
    } else {
        throw new Error('No se pudo conectar');
    }
}

async function mostrarAllPokemons(pokemons) {
    let card = document.getElementById('cards');
    card.innerHTML = '';
    for (let i = 0; i < pokemons.length; i++) {
        await mostrarPokemon(pokemons[i].name);
    }
}

function tarjetaPokemon(pokemon) {
    let card = document.getElementById('cards');
    let div = document.createElement('div');
    div.classList.add('card');
    div.dataset.id = pokemon.id;
    card.appendChild(div);

    let image = document.createElement('img');
    image.src = pokemon.sprites.front_default;
    div.appendChild(image);

    let nombre = document.createElement('div');
    nombre.classList.add('data');
    div.appendChild(nombre);

    let h1 = document.createElement('h1');
    h1.textContent = pokemon.name;
    nombre.appendChild(h1);

    let numero = document.createElement('div');
    numero.classList.add('status');
    nombre.appendChild(numero);

    let number = document.createElement('span');
    number.classList.add('status_icon');
    number.textContent = `#${pokemon.id.toString().padStart(3, '0')}`;
    numero.appendChild(number);

    let tipo = document.createElement('h3');
    let tipoTexto = '';
    pokemon.types.forEach((tipos, index) => {
        if (index > 0) {
            tipoTexto += '/';
        }
        tipoTexto += tipos.type.name;
    });
    tipo.textContent = `Tipo: ${tipoTexto}`;
    nombre.appendChild(tipo);
    
}

async function obtenerTodosLosPokemons() {
    let option = {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        }
    };
    let res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1', option);
    if (res.status == 200) {
        let data = await res.json();
        let totalPokemons = data.count;
        let promises = [];
        let limit = 50; 
        for (let offset = 0; offset < totalPokemons; offset += limit) {
            promises.push(fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`, option).then(res => res.json()));
        }
        let results = await Promise.all(promises);
        let allPokemons = results.flatMap(result => result.results);
        mostrarAllPokemons(allPokemons);
    } else {
        throw new Error('no se pudo conectar');
    }
}

function detallesPokemon(id){
    let card = document.querySelectorAll('.card')
    let modal = document.getElementById('modal')
    let estadistica = document.getElementById('estadistica');
   
    card.forEach(element =>{
        
        element.addEventListener('click', function(event){
            event.preventDefault();
            modal.classList.remove('hidden')
            let option = {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                }
            }
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`, option)
            .then(res =>{
                if(res.status == 200){
                    return res.json();
                }else{
                    throw new Error('No se pudo conectar');
                }
            })
            .then(data =>{
                console.log(data);
                let descripcion = document.createElement('p');
                descripcion.classList.add('descripcion')
                let texto = data.flavor_text_entries.find(text => text.language.name === 'es')
                if(texto){
                    descripcion.innerHTML = texto.flavor_text;
                }
                estadistica.appendChild(descripcion)

                
                
                fetch(`https://pokeapi.co/api/v2/pokemon/${id}`, option)
                .then(res =>{
                    if(res.status == 200){
                        return res.json();
                    }else{
                        throw new Error('No se pudo conectar')
                    }
                })
                .then(data2 =>{
                    console.log(data2);
                    let foto = document.createElement('img');
                    foto.src = data2.sprites.front_default;
                    estadistica.appendChild(foto);

                    let cuadro = document.createElement('div');
                    cuadro.classList.add('azul');
                    estadistica.appendChild(cuadro);

                    let altura = document.createElement('h3');
                    altura.classList.add('altura');
                    altura.textContent = 'Altura';
                    cuadro.appendChild(altura);

                    let altura2 = document.createElement('p');
                    altura2.classList.add('altura2');
                    let alturaMetros = (data2.height / 10) + 'm';
                    altura2.textContent += alturaMetros
                    cuadro.appendChild(altura2);

                    let peso = document.createElement('h3');
                    peso.classList.add('peso');
                    peso.textContent = 'Peso';
                    cuadro.appendChild(peso);

                    let peso2 = document.createElement('p');
                    peso2.classList.add('peso2');
                    let pesoKilos = (data2.weight / 10) + 'Kg';
                    peso2.textContent += pesoKilos;
                    cuadro.appendChild(peso2);

                    fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`, option)
                    .then(res =>{
                        if(res.status == 200){
                            return res.json();
                        }else{
                            throw new Error('No se pudo conectar')
                        }
                    })
                    .then(data3 =>{
                        let categoria = document.createElement('h3');
                        categoria.classList.add('categoria');
                        categoria.textContent = 'Categoria';
                        cuadro.appendChild(categoria);

                        let categoria2 = document.createElement('p');
                        categoria2.classList.add('categoria2');
                        let categoriaEs = data3.genera.find(categoria => categoria.language.name == 'es');
                        categoria2.textContent = categoriaEs.genus;
                        cuadro.appendChild(categoria2);
                    })
                    
                    fetch(`https://pokeapi.co/api/v2/ability/${id}`, option)
                    .then(res =>{
                        if(res.status == 200){
                            return res.json();
                        }else{
                            throw new Error('No se pudo conectar');
                        }
                    })
                    .then(data4 =>{
                        console.log(data4);
                        let habilidad = document.createElement('h3');
                        habilidad.classList.add('habilidad');
                        habilidad.textContent = 'Habilidad';
                        cuadro.appendChild(habilidad);

                        let habilidad2 = document.createElement('p');
                        habilidad2.classList.add('habilidad2');
                        let habilidadEs = data4.names.find(names => names.language.name == 'es');
                        habilidad2.textContent = habilidadEs.name;
                        cuadro.appendChild(habilidad2);
                    })
                })

                

            })
            
        })
        
    })
}


document.addEventListener('DOMContentLoaded', () => {
    obtenerTodosLosPokemons();
    mostrarFiltros();
   
    document.getElementById('cards').addEventListener('click', function (event) {
        let target = event.target.closest('.card');
        console.log(target);
        if (target) {
            let id = target.dataset.id;
            detallesPokemon(id);
        }
    });
});
