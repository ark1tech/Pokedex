const load = document.getElementById("load");
const monsterList = document.getElementById("monster-list");
const sort = document.getElementById("currentOption");
const sortChoice = document.getElementById("option");
const sort2 = document.getElementById("currentOption2");
const sortChoice2 = document.getElementById("option2");
const search = document.getElementById("searchBar");
const nonfound = document.getElementById("nothing-found");
const yesfound = document.getElementById("thereis-found");

const POKEMON_COUNT = 1010;
const INT_PATTERN = /\s*^\d+$\s*/;
const loadList = []

let timer;
let count = 10;
let loadedMonsters;

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

// Sort
const sortMonsters = (data) => {
  if (sort.textContent.trim() === "Name" && sort2.textContent.trim() === "Descending") {
    return data.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
  } else if (sort.textContent.trim() === "Name" && sort2.textContent.trim() === "Ascending") {
    return data.sort((a, b) => {
      if (a.name > b.name) {
        return -1;
      }
      if (a.name < b.name) {
        return 1;
      }
      return 0;
    });
  } else if (sort2.textContent.trim() === "Ascending") {
    return data.sort((a, b) => {
      firstId = parseInt(a.url.split("/")[6]);
      secondId = parseInt(b.url.split("/")[6]);
      if (firstId > secondId) {
        return -1;
      }
      if (firstId < secondId) {
        return 1;
      }
      return 0;
    });
  } else return data;
};

const parseID = (IDtoParse) => {
  stringID = String(IDtoParse);
  return "0".repeat(4 - stringID.length) + stringID;
};

const toggleUnhide = (element) => {
  if (element.classList.contains("hide")) element.classList.toggle("hide");
};

const toggleDisable = (element) => {
  element.classList.toggle("disabled");
};

const toggleHide = (element) => {
  if (!element.classList.contains("hide")) element.classList.toggle("hide");
};

// API CALLS --------------

// pagination
const viewMonsters = async () => {
  // ui checks
  toggleUnhide(load);
  toggleHide(yesfound);
  toggleHide(nonfound);
  
  toggleDisable(load);
  const loaded = await loadMonsters();
  for (let i = count - 10; i < count; i++) {
    const monster = await showMonsters(loaded[i]);
    loadList.push(monster);
  }
  for (let i = 0; i < 10; i++) {
    monsterList.append(loadList[i]);
  }
  toggleDisable(load);
  loadList.length = 0;
};

const searchMonsters = () => {
  searchInput = search.value.toLowerCase().trim();
  if (searchInput === "") {
    searchResult = loadedMonsters;
  } else if (INT_PATTERN.test(searchInput)) {
    searchResult = loadedMonsters.filter((pokemon) => {
      numberID = pokemon.url.split("/")[6];
      displayID = parseID(numberID);
      return displayID.startsWith(searchInput);
    });
  } else {
    searchResult = loadedMonsters.filter((pokemon) => {
      return pokemon.name.startsWith(searchInput);
    });
  }

  if (searchInput.length === 0) {
    monsterList.innerHTML = "";
    count = 10;
    viewMonsters();
  } else {
    toggleHide(load);
    monsterList.innerHTML = "";
    if (searchResult.length === 0 && searchInput.length !== 0) {
      toggleHide(yesfound);
      toggleUnhide(nonfound);
    } else {
      yesfound.textContent = `${searchResult.length} Pokémon${
        searchResult.length === 1 ? " was" : "s were"
      } found.`;
      toggleUnhide(yesfound);
      toggleHide(nonfound);
      for (let i = 0; i < searchResult.length; i++) {
        showMonsters(searchResult[i]);
      }
    }
  }
};

// display pokemons
const showMonsters = async (pokemon) => {
  const numberID = pokemon.url.split("/")[6];

  // assets url id + frontend id conventions
  let urlID = numberID;
  let displayID = numberID;
  if (numberID.length != 4) {
    urlID = "0".repeat(3 - numberID.length) + numberID;
    displayID = parseID(numberID);
  }

  // get type
  const typeList = await loadType(numberID);
  let pokemonType = parseType(typeList);

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
  card.addEventListener("click", async () => {
    preLoadView(numberID).then((data) => {
      if (data)
        window.location.href = `./view.html?id=${parseInt(numberID, 10)}`;
    });
  });
  return card;
};

// Listeners --------------

// initial 10
window.addEventListener("load", () => {
  viewMonsters();
});

// add more 10, wait til the next batch has been loaded
load.addEventListener("click", async () => {
  if (load.classList.contains("disabled")) load.removeEventListener("click");
  count += 10;
  if (count >= POKEMON_COUNT) {
    count = POKEMON_COUNT;
    toggleHide(load);
  }
  await viewMonsters();
});

// search
search.addEventListener("input", () => {
  // debounce
  clearTimeout(timer);
  timer = setTimeout(() => {
    searchMonsters();
  }, 300);
});

// const skeleton = () => {
//   const skeletonBatch = document.createElement("div");
//   skeletonBatch.className = "skeleton-batch";
//   monsterList.append(skeletonBatch);
//   for (let index = 0; index < 10; index++) {
//     const card = document.createElement("div");
//     card.className = "card-bg";
//     card.innerHTML = `
//       <div class="cards-poke-bg skeleton">
//       </div>
//       <div class="card transparent">
//           <div class="cards-img-container">
//               <img src=".assets/icons/placehold.png" />
//           </div>
//           <div class="cards-text">
//               <div class="cards-title">
//                   <p>
//                       ...
//                   </p>
//                   <h4>
//                   ...
//                   </h4>
//               </div>
//               ..
//           </div>
//       </div>
//     `;
//     skeletonBatch.append(card);
//   }
// };
