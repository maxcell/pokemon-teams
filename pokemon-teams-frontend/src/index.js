//global backend API url constants
const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

  //global dynamic storage variables
  let trainers = []
  let pokemons = []

  //static containers variables
  const mainContainer = document.getElementById("main")

//onload functionality
document.addEventListener("DOMContentLoaded", function(event) {

  function buildCardPokemon(pokemon){
    return `<li>${pokemon.nickname} <button class="release" data-action="release" data-pokemon-id="${pokemon.id}">Release</button></li>`;
  }

  function filterTrainerPokemons(trainerId){
    let ownedPokemons = pokemons.filter(pokemon => pokemon.trainer_id === trainerId);
    return ownedPokemons;
  }

  function displayTrainerPokemons(trainerId){
    const ownedFilterPokemons = filterTrainerPokemons(trainerId);
    const mapPokemons = ownedFilterPokemons.map(function(pokemon) { return buildCardPokemon(pokemon)}).join("");
    return mapPokemons;
  }

  function returnAddBtn(trainerId) {
    return `<button id="${trainerId}" data-action="add" data-trainer-id="${trainerId}">Add Pokemon</button>`
  }

  function createTrainerCard(trainer){
    const amountPokemons = filterTrainerPokemons(trainer.id).length;
    return `<div class="card" data-id="${trainer.id}"><p>${trainer.name}</p>
      ${amountPokemons < 6 ? returnAddBtn(trainer.id)  : ""}
      <ul>
        ${displayTrainerPokemons(trainer.id)}
      </ul>
    </div>`
  }

  function displayTeams(){
    const cards = trainers.map(createTrainerCard).join("");
    mainContainer.innerHTML = cards;
  }

  //CRUD actions
  function addPokemon(eventTarget){
    const data = { trainer_id: eventTarget };
    const configObj = {method: "POST", headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)};
    fetch(POKEMONS_URL, configObj).then(r=>r.json()).then(console.log).then(init);
  };

  function releasePokemon(pokemonId){
    const POKEMONS_URL_DELETE = `${POKEMONS_URL}/${pokemonId}`;
    const configObj = {method: "DELETE"};
    fetch(POKEMONS_URL_DELETE, configObj).then(r=>r.json()).then(console.log).then(init);
  }

  //event listener router
  mainContainer.addEventListener("click", function(event){
    if (event.target.dataset.action === "add"){
      addPokemon(event.target.dataset.trainerId);
    }
    else if (event.target.dataset.action === "release"){
      releasePokemon(event.target.dataset.pokemonId);
    }
  })

  //init functionality
  function hashTrainer(trainer){
    return {id: trainer.id, name: trainer.name};
  }

  function hashPokemons(pokemon){
    return {id: pokemon.id, nickname: pokemon.nickname, species: pokemon.species, trainer_id: pokemon.trainer_id};
  }

  function saveTeams(responseTeams){
    pokemons = [];
    trainers = [];
    responseTeams.forEach(function(trainer){
      trainers.push(hashTrainer(trainer));
      trainer.pokemons.forEach(function(pokemon){
      pokemons.push(hashPokemons(pokemon));
      });
    })
  }

  function init(){
    fetch(TRAINERS_URL).then(r=>r.json()).then(saveTeams).then(displayTeams);
  };
  init();

});
