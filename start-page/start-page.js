// Get the start game and multiplayer buttons, and the button group container
const startGameBtn = document.getElementById('start-game-btn'),
  multiplayerBtn = document.getElementById('multiplayer-btn'),
  buttonGroup = document.querySelector('.button-group');

// Create the form, input, and submit button
const form = document.createElement('form'),
  input = document.createElement('input'),
  submitBtn = document.createElement('button');

// Player name
export let playerName = '';

// When the start game button is clicked, do the following:
startGameBtn.addEventListener('click', function() {
  // Set the type and placeholder text for the input field
  input.type = 'text';
  input.placeholder = 'ENTER NAME';

  // Set the type and text for the submit button, and apply button styling
  submitBtn.type = 'submit';
  submitBtn.textContent = 'START';
  submitBtn.style = "width: 150px;margin: 20px;all: unset;border: 1px white solid;font-weight: bold;padding: 15px;width: 300px;margin: 17px;border-radius: 5px;font-size: 35px;cursor: pointer";

  // Add the input and submit button to the form
  form.appendChild(input);
  form.appendChild(submitBtn);

  // Replace the button group container with the form
  buttonGroup.parentNode.replaceChild(form, buttonGroup);
});

// Prevent the form from refreshing the page on submit


form.addEventListener('submit', e => {
  e.preventDefault();
  playerName = input.value;
  localStorage.setItem("playerName", playerName);
  window.location.href = "./lore-pages/lore.html";
});

