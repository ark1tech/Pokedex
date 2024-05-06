const option = document.getElementById("option");
const currentOption = document.getElementById("currentOption");
const dropDown = document.getElementById("dropdown");
const option2 = document.getElementById("option2");
const currentOption2 = document.getElementById("currentOption2");
const dropDown2 = document.getElementById("dropdown2");

document.onclick = (e) => {
  if (!e.target.closest("[data-dropdown]")) {
    if (option.classList.contains("show")) {
      option.classList.toggle("show");
    }
    if (option2.classList.contains("show")) {
      option2.classList.toggle("show");
    }
  }
};

dropDown.onclick = () => {
  option.classList.toggle("show");
};

dropDown2.onclick = () => {
  option2.classList.toggle("show");
};

option.onclick = () => {
  const temp = option.textContent;
  option.textContent = currentOption.textContent;
  currentOption.textContent = temp;

  // reset
  monsterList.innerHTML = "";
  count = 10;
  viewMonsters();
};

option2.onclick = () => {
  const temp = option2.textContent;
  option2.textContent = currentOption2.textContent;
  currentOption2.textContent = temp;

  // reset
  monsterList.innerHTML = "";
  count = 10;
  viewMonsters();
};
