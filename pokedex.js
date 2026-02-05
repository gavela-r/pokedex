
let renderToken = 0;

function mostrarFiltros() {
    fetch('https://pokeapi.co/api/v2/type')
        .then(res => res.json())
        .then(data => {
            const filter = document.getElementById('filters');
            filter.innerHTML = '';
            filter.style.overflowY = 'auto';
            filter.style.maxHeight = '100vh';

            data.results.forEach(type => {
                const div = document.createElement('div');
                div.classList.add('filter');
                div.textContent = type.name;

                div.addEventListener('click', () => {
                    document.querySelectorAll('.filter.selected')
                        .forEach(f => f.classList.remove('selected'));

                    div.classList.add('selected');
                    filtrarPokemons(type.name);
                });

                filter.appendChild(div);
            });
        });
}

function filtrarPokemons(type) {
    fetch(`https://pokeapi.co/api/v2/type/${type}`)
        .then(res => res.json())
        .then(data => {
            const pokemons = data.pokemon.map(p => p.pokemon);
            mostrarAllPokemons(pokemons);
        });
}


async function mostrarPokemon(name, token) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const data = await res.json();

    if (token !== renderToken) return;
    tarjetaPokemon(data);
}

async function mostrarAllPokemons(pokemons) {
    const cards = document.getElementById('cards');
    cards.innerHTML = '';

    const currentToken = ++renderToken;

    for (const p of pokemons) {
        if (currentToken !== renderToken) return;
        await mostrarPokemon(p.name, currentToken);
    }
}

function tarjetaPokemon(pokemon) {
    const cards = document.getElementById('cards');

    const div = document.createElement('div');
    div.classList.add('card');
    div.dataset.id = pokemon.id;

    div.innerHTML = `
        <img src="${pokemon.sprites.front_default}">
        <div class="data">
            <h1>${pokemon.name}</h1>
            <span>#${pokemon.id.toString().padStart(3, '0')}</span>
            <h3>Tipo: ${pokemon.types.map(t => t.type.name).join('/')}</h3>
        </div>
    `;

    cards.appendChild(div);
}


async function obtenerTodosLosPokemons() {
    const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1');
    const data = await res.json();

    const total = data.count;
    const limit = 50;
    const requests = [];

    for (let offset = 0; offset < total; offset += limit) {
        requests.push(
            fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`)
                .then(res => res.json())
        );
    }

    const results = await Promise.all(requests);
    const allPokemons = results.flatMap(r => r.results);

    mostrarAllPokemons(allPokemons);
}


async function mostrarDetallesPokemon(id) {
    const modal = document.getElementById('modal');
    const estadistica = document.getElementById('estadistica');

    estadistica.innerHTML = '';
    modal.classList.remove('hidden');

    const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
    const species = await speciesRes.json();

    const texto = species.flavor_text_entries.find(t => t.language.name === 'es');
    if (texto) {
        const p = document.createElement('p');
        p.textContent = texto.flavor_text;
        estadistica.appendChild(p);
    }

    const pokeRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const poke = await pokeRes.json();

    estadistica.innerHTML += `
        <img src="${poke.sprites.front_default}">
        <p>Altura: ${poke.height / 10} m</p>
        <p>Peso: ${poke.weight / 10} kg</p>
    `;
}


document.addEventListener('DOMContentLoaded', () => {
    obtenerTodosLosPokemons();
    mostrarFiltros();

    document.getElementById('cards').addEventListener('click', e => {
        const card = e.target.closest('.card');
        if (card) {
            mostrarDetallesPokemon(card.dataset.id);
        }
    });
});
