document.addEventListener("DOMContentLoaded", function () {
    const addPokemonButton = document.getElementById("add-pokemon-button");
    const addPokemonForm = document.getElementById("add-pokemon-form");

    let pokemonData = [];

    addPokemonButton.addEventListener("click", function () {
        openModal();
    });

    addPokemonForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const nameInput = document.getElementById("pokemon-name");
        const typeInput = document.getElementById("pokemon-type");

        const newPokemon = {
            name: nameInput.value,
            type: typeInput.value,
            // Properties die benutzt wurden
        };

        try {
            await addPokemon(newPokemon);
            closeModal();
        } catch (error) {
            console.error("Error adding Pokemon:", error);
            alert("An error occurred while adding the Pokemon. Please try again.");
        }
    });

    function openModal() {
        const modal = document.getElementById("add-pokemon-modal");
        modal.style.display = "block";
    }

    window.closeModal = function () {
        const modal = document.getElementById("add-pokemon-modal");
        modal.style.display = "none";
    };

    document.addEventListener("click", function (event) {
        const modal = document.getElementById("add-pokemon-modal");
        if (event.target === modal) {
            closeModal();
        }
    });

    const apiUrl = "http://localhost:2940/api/v1/entities";

    function fetchAndRenderPokemon() {
        fetch(`${apiUrl}/pokemon`)
            .then(response => response.json())
            .then(data => {
                pokemonData = data;
                renderPokemonCards(pokemonData);
            })
            .catch(error => console.error("Error fetching Pokemon data:", error));
    }

    function renderPokemonCards(pokemonList) {
        const pokedexContainer = document.getElementById("poke-container");
        pokedexContainer.innerHTML = "";

        pokemonList.forEach((pokemon, index) => {
            const card = createPokemonCard(pokemon);
            pokedexContainer.appendChild(card);
        });
    }

    function createPokemonCard(pokemon) {
        const card = document.createElement("div");
        card.classList.add("card");

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", function () {
            deletePokemon(pokemon.id);
        });

        const modifyButton = document.createElement("button");
        modifyButton.textContent = "Modify Type";
        modifyButton.addEventListener("click", function () {
            modifyPokemonType(pokemon.id);
        });

        const name = document.createElement("h2");
        name.textContent = pokemon.name;

        const type = document.createElement("p");
        type.textContent = `Type: ${pokemon.type}`;

        card.appendChild(deleteButton);
        card.appendChild(modifyButton);
        card.appendChild(name);
        card.appendChild(type);

        return card;
    }

    function addPokemon(newPokemon) {
        return fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newPokemon),
        })
            .then(response => response.json())
            .then(data => {
                newPokemon.id = data.id;
                pokemonData.push(newPokemon);
                renderPokemonCards(pokemonData);
            });
    }

    function deletePokemon(pokemonId) {
        fetch(`http://localhost:2940/api/v1/entities/${pokemonId}`, {
            method: "DELETE",
        })
            .then(() => {
                const index = pokemonData.findIndex(pokemon => pokemon.id === pokemonId);
                if (index !== -1) {
                    pokemonData.splice(index, 1);
                    renderPokemonCards(pokemonData);
                }
            })
            .catch(error => console.error("Error deleting Pokemon:", error));
    }

    function modifyPokemonType(pokemonId) {
        const index = pokemonData.findIndex(pokemon => pokemon.id === pokemonId);
        if (index !== -1) {
            const newType = prompt("Enter the new type for the Pokemon:");
            if (newType !== null) {
                fetch(`http://localhost:2940/api/v1/entities/${pokemonId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ type: newType }),
                })
                    .then(response => response.json())
                    .then(data => {
                        pokemonData[index].type = data.type;
                        renderPokemonCards(pokemonData);
                    })
                    .catch(error => console.error("Error modifying Pokemon type:", error));
            }
        }
    }


    fetchAndRenderPokemon();
});
