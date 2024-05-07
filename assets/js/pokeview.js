const prevID = document.querySelector("[data-prev-id]");
const prevName = document.querySelector("[data-prev-name]");
const nextID = document.querySelector("[data-next-id]");
const nextName = document.querySelector("[data-next-name]");
const currentID = document.querySelector("[data-current-id]");
const currentName = document.querySelector("[data-current-name]");
const currentType = document.querySelector("[data-current-type]");

const pokeImg = document.querySelector("[data-img]");
const pokeWeak = document.querySelector("[data-weaknesses]");
const pokeDesc = document.querySelector("[data-desc]");
const pokeHeight = document.querySelector("[data-height]");
const pokeWeight = document.querySelector("[data-weight]");
const pokeCategory = document.querySelector("[data-category]");
const pokeAbility = document.querySelector("[data-ability]");

const HPText = document.querySelector("[data-hp-text]");
const HPProg = document.querySelector("[data-hp-prog]");
const ATKText = document.querySelector("[data-atk-text]");
const ATKProg = document.querySelector("[data-atk-prog]");
const DEFText = document.querySelector("[data-def-text]");
const DEFProg = document.querySelector("[data-def-prog]");
const SPATKText = document.querySelector("[data-spatk-text]");
const APATKProg = document.querySelector("[data-spatk-prog]");
const SPDEFText = document.querySelector("[data-spdef-text]");
const SPDEFProg = document.querySelector("[data-spdef-prog]");
const SPEEDText = document.querySelector("[data-speed-text]");
const SPEEDProg = document.querySelector("[data-speed-prog]");

const nextPokemon = document.querySelector("#loadNext");
const prevPokemon = document.querySelector("#loadPrev");
const disclaimer = document.querySelector("#disclaimer");

const FLAVOR_PATTERN = /\f/g;
const POKEMON_COUNT = 1010;

let loadedPokemon = JSON.parse(sessionStorage.getItem("loadedPokemon"));
let currentPokemonID = parseInt(loadedPokemon[0], 10);

// Utility functions
const titleCase = (name) => {
  return name.charAt(0).toUpperCase() + name.substr(1).toLowerCase();
};

const parseID = (IDtoParse) => {
  stringID = String(IDtoParse);
  return "0".repeat(4 - stringID.length) + stringID;
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

const toggleUnhide = (element) => {
  if (element.classList.contains("hide")) element.classList.toggle("hide");
};

// Scripts

// display pokemons
window.addEventListener("load", () => {
  showPokemon();
});

// display pokemons
const showPokemon = () => {
  showWeak();
  showImg();
  showID();
  showDesc();
  showMetaData();
  // const pokeDesc = document.querySelector("[data-desc]");
  // const pokeHeight = document.querySelector("[data-height]");
  // const pokeWeight = document.querySelector("[data-weight]");
  // const pokeCategory = document.querySelector("[data-category]");
  // const pokeAbility = document.querySelector("[data-ability]");
};

const showMetaData = () => {
  
}

const showDesc = () => {
  const filteredFlavor = loadedPokemon[2].flavor_text_entries.filter((a) => {
    return (a.language.name = "en");
  });
  pokeDesc.textContent = filteredFlavor[1].flavor_text 
};

const showImg = () => {
  urlID = currentPokemonID;
  if (String(currentPokemonID).length != 4)
    urlID =
      "0".repeat(3 - String(currentPokemonID).length) +
      String(currentPokemonID);
  pokeImg.src = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${urlID}.png`;
};

const showID = () => {
  if (currentPokemonID - 1 <= 0) {
    prevID.textContent = `BACK TO`;
    prevName.textContent = `Pokedex`;
  } else {
    prevID.textContent = `#${parseID(currentPokemonID - 1)}`;
    prevName.textContent = `${titleCase(loadedPokemon[3].name)}`;
  }
  if (currentPokemonID + 1 > POKEMON_COUNT) {
    nextID.textContent = `BACK TO`;
    nextName.textContent = `Pokedex`;
  } else {
    nextID.textContent = `#${parseID(currentPokemonID + 1)}`;
    nextName.textContent = `${titleCase(loadedPokemon[4].name)}`;
  }
  currentID.textContent = `#${parseID(currentPokemonID)}`;
  currentName.textContent = `${titleCase(loadedPokemon[1].name)}`;
  currentType.innerHTML = `${parseType(loadedPokemon[1].types)}`;
};

const showWeak = async () => {
  const weaknesses = await loadWeak();
  const typeList = loadedPokemon[1].types;
  if (typeList.length > 1) toggleUnhide(disclaimer);
  let weakString = "";
  let weakList = [];
  typeList.forEach((type) => {
    for (const [key, value] of Object.entries(weaknesses[type.type.name])) {
      weakList.push(key);
    }
  });
  const weakSet = new Set(weakList);
  weakSet.forEach((type) => {
    weakString += `<p class=${type}>${titleCase(type)}</p>\n`;
  });

  pokeWeak.innerHTML = weakString;
};

nextPokemon.addEventListener("click", async () => {
  if (currentPokemonID + 1 > POKEMON_COUNT)
    window.location.href = `./index.html`;
  preLoadView(currentPokemonID + 1).then((data) => {
    if (data) window.location.href = `./view.html?id=${currentPokemonID + 1}`;
  });
});

prevPokemon.addEventListener("click", async () => {
  if (currentPokemonID - 1 <= 0) {
    window.location.href = `./index.html`;
  } else {
    preLoadView(currentPokemonID - 1).then((data) => {
      if (data) window.location.href = `./view.html?id=${currentPokemonID - 1}`;
    });
  }
});
