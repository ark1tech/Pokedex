const prevID = document.querySelector("[data-prev-id]");
const prevName = document.querySelector("[data-prev-name]");
const nextID = document.querySelector("[data-next-id]");
const nextName = document.querySelector("[data-next-name]");
const currentID = document.querySelector("[data-current-id]");
const currentName = document.querySelector("[data-current-id]");
const currentType = document.querySelector("[data-current-type]");

const pokeImg = document.querySelector("[data-img]");
const pokeWeak = document.querySelector("[data-weaknesses]");
const pokeDesc = document.querySelector("[data-desc]");
const pokeHeight = document.querySelector("[data-height]");
const pokeWeight = document.querySelector("[data-weight]");
const pokeGender = document.querySelector("[data-gender]");
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

// load monster
const loadMonster = async (numberID) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${numberID}`;
    const response = await fetch(url);
    const data = await response.json();
  
    // sort
    loadedMonsters = [...data.results];
    return sortMonsters(loadedMonsters);
};

// display pokemons
const showMonsterDetails = async (pokemon) => {
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
    // const success = async (numberID) => {
    //   console.log("haha");
    // };
    window.location.href = `./view.html?id=${numberID}`;
  });
  monsterList.append(card);
};
