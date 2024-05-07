// ALL LOADING API CALLS

// get all monsters (we're fetching everything since it's a relatively small dataset)
const loadMonsters = async () => {
  const url = `https://pokeapi.co/api/v2/pokemon?limit=1010`;
  const response = await fetch(url);
  const data = await response.json();

  // sort
  loadedMonsters = [...data.results];
  return sortMonsters(loadedMonsters);
};

const loadPokeData = async (id) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}/`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

const loadPokeDescription = async (id) => {
  const url = `https://pokeapi.co/api/v2/pokemon-species/${id}/`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

// get type
const loadType = async (id) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}/`;
  const response = await fetch(url);
  const data = await response.json();
  return data.types;
};

const loadWeak = async () => {
  const response = await fetch("./weaknesses.json");
  const data = await response.json();
  return data;
}

// preload view from cards and from next and prev pokemons
// altho hahaha maybe better with loading animation if mag preload
const preLoadView = async (numberID) => {
  let currentID = parseInt(numberID, 10);
  let prevID = currentID - 1;
  let nextID = currentID + 1;

  if (prevID <= 0) {
    prevID = currentID;
  }
  if (currentID + 1 > POKEMON_COUNT) {
    nextID = currentID;
  }

  const pokemonMetaData = await Promise.all([
    loadPokeData(currentID),
    loadPokeDescription(currentID),
    loadPokeData(prevID),
    loadPokeData(nextID),
  ]);
  sessionStorage.setItem(
    "loadedPokemon",
    JSON.stringify([currentID, ...pokemonMetaData])
  );
  return true;
};
