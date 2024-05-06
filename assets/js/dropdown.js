const option = document.getElementById("option");
const currentOption = document.getElementById("currentOption");
const dropDown = document.getElementById("dropdown");

document.onclick = (e) => {
  if (!e.target.closest('[data-dropdown]')) {
    if (option.classList.contains("show")) {
      option.classList.toggle("show");
    }
  }
};

dropDown.onclick = () => {
  option.classList.toggle("show");
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