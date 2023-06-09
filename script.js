const wordEl = document.querySelector('#word');
const wrongLettersEl = document.querySelector('#wrong-letters');
const playAgainBtn = document.querySelector('#play-button');
const popup = document.querySelector('#popup-container');
const notification = document.querySelector('#notification-container');
const finalMessage = document.querySelector('#final-message');

const figureParts = document.querySelectorAll('.figure-part');

const rndInt = Math.floor(Math.random() * 8) + 3;
const BASE_URL = `https://random-word-api.herokuapp.com/word?length=${rndInt}`;

let selectedWord;

const correctLetters = [];
const wrongLetters = [];

async function getRandomWord() {
  const response = await fetch(BASE_URL);
  const words = await response.json();

  selectedWord = words[0];
  displayWord();
}

getRandomWord();

function displayWord() {
  wordEl.innerHTML = `
    ${selectedWord
      .split('')
      .map(
        (letter) =>
          `<span class='letter'>${
            correctLetters.includes(letter) ? letter : ''
          }</span>`
      )
      .join('')}`;

  const innerWord = wordEl.innerText.replace(/\n/g, '');

  if (innerWord === selectedWord) {
    finalMessage.innerText = 'Congratulations! You won! 😃';
    popup.style.display = 'flex';
  }
}

// Update wrong letters
function updateWrongLettersEl() {
  // Display wrong letters
  wrongLettersEl.innerHTML = `
  ${wrongLetters.length > 0 ? `<p>Wrong</p>` : ''}
  ${wrongLetters.map((letter) => `<span>${letter}</span>`)}
  `;

  // Display parts
  figureParts.forEach((part, index) => {
    const errors = wrongLetters.length;

    if (index < errors) {
      part.style.display = 'block';
    } else {
      part.style.display = 'none';
    }
  });

  // Check if lost
  if (wrongLetters.length === figureParts.length) {
    finalMessage.innerText = `You lost that game 😕 The correct word is "${selectedWord}"`;
    popup.style.display = 'flex';
  }
}

// Show notification
function showNotification() {
  notification.classList.add('show');

  setTimeout(() => {
    notification.classList.remove('show');
  }, 2000);
}

window.addEventListener('keydown', (e) => {
  console.log(e.key);
  console.log(e.key.charCodeAt(0));
  if (e.key.charCodeAt(0) >= 97 && e.key.charCodeAt(0) <= 122) {
    const letter = e.key;

    if (selectedWord.includes(letter)) {
      if (!correctLetters.includes(letter)) {
        correctLetters.push(letter);

        displayWord();
      } else {
        showNotification();
      }
    } else {
      if (!wrongLetters.includes(letter)) {
        wrongLetters.push(letter);

        updateWrongLettersEl();
      } else {
        showNotification();
      }
    }
  } else if (e.key.charCodeAt(0) >= 65 && e.key.charCodeAt(0) <= 90) {
    notification.textContent = 'Only lowercase letters are allowed';
    showNotification();
  }
});

// Play again
playAgainBtn.addEventListener('click', () => {
  correctLetters.splice(0);
  wrongLetters.splice(0);

  getRandomWord();
  displayWord();
  updateWrongLettersEl();
  popup.style.display = 'none';
});

displayWord();
