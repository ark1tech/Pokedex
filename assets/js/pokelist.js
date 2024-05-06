const load = document.getElementById("load");
const monsterList = document.getElementById("monster-list");
const sort = document.getElementById("currentOption");
const sortChoice = document.getElementById("option");

const POKEMON_COUNT = 1010;
let count = 10;
let loadedMonsters = [];

// UTILITY FUNCTIONS --------------

// proper naming utility function
const titleCase = (name) => {
  return name.charAt(0).toUpperCase() + name.substr(1).toLowerCase();
};

// Convert type table to html
const parseType = (typeList) => {
  let currentString = "";
  typeList.forEach((type) => {
    currentString += `<p class=${type.type.name}>${titleCase(
      type.type.name
    )}</p>\n`;
  });
  let parsedType = `
  <div class="cards-content">
    ${currentString}
  </div>
  `;
  return parsedType;
};

// API CALLS --------------

// get all monsters (we're fetching everything since it's a relatively small dataset)
const loadMonsters = async () => {
  const url = `https://pokeapi.co/api/v2/pokemon?limit=1010`;
  const response = await fetch(url);
  const data = await response.json();
  // console.log(data.results);
  if (sort.textContent === "Name") {
    return [...data.results].sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
  } else {
    return [...data.results];
  }
};

// get type
const loadType = async (id) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}/`;
  const response = await fetch(url);
  const data = await response.json();
  return data.types;
};

// pagination
const viewMonsters = () => {
  loadMonsters().then(async (data) => {
    for (let i = count - 10; i < count; i++) {
      // console.log(data[i]);
      await showMonsters(data[i]);
    }
  });
};

// initial 10
window.addEventListener("load", (e) => {
  viewMonsters();
});

// add more 10
load.onclick = () => {
  count += 10;
  if (count >= POKEMON_COUNT) {
    count = POKEMON_COUNT;
    load.classList.add("hide");
  }
  viewMonsters();
};

// display
const showMonsters = async (pokemon) => {
  const numberID = pokemon.url.split("/")[6];

  // assets url id + frontend id conventions
  let urlID = numberID;
  let displayID = numberID;
  if (numberID.length != 4) {
    urlID = "0".repeat(3 - numberID.length) + numberID;
    displayID = "0".repeat(4 - numberID.length) + numberID;
  }

  // get type
  const typeList = await loadType(numberID);
  let pokemonType = parseType(typeList);
  // setTimeout(parseType(typeList), 2000);

  const card = document.createElement("div");
  card.className = "card-bg";
  card.innerHTML = `
      <div class="cards-poke-bg">
          <img src="https://assets.pokemon.com/assets/cms2/img/pokedex/full/${urlID}.png" />
      </div>
      <div class="card">
          <div class="cards-img-container">
              <img src="https://assets.pokemon.com/assets/cms2/img/pokedex/full/${urlID}.png" />
          </div>
          <div class="cards-text">
              <div class="cards-title">
                  <p>
                      #${displayID}
                  </p>
                  <h4>
                      ${titleCase(pokemon.name)}
                  </h4>
              </div>
              ${pokemonType}
          </div>
      </div>
    `;
  monsterList.append(card);
};

{
  /* 
<div class="card-bg">
    <div class="cards-poke-bg">
        <img src="https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png" />
    </div>
    <div class="card">
        <div class="cards-img-container">
            <img src="https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png" />
        </div>
        <div class="cards-text">
            <div class="cards-title">
                <p>
                    #646
                </p>
                <h4>
                    Ekans
                </h4>
            </div>
            <div class="cards-content">
                <p class="dragon">
                    Dragon
                </p>
                <p class="psychic">
                    Psychic
                </p>
            </div>
        </div>
    </div>
</div> */
}
