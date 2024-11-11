const gridContainer = document.querySelector(".grid-container");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;

// Initialize score display
document.querySelector(".score").textContent = score;

// Fade-out welcome message on load
document.addEventListener("DOMContentLoaded", () => {
    const header = document.getElementById('welcomeMessage');

    setTimeout(() => {
        header.classList.add("fade-out");
        header.addEventListener("animationend", () => {
            header.style.display = "none";
        });
    }, 1000);
});

// Home screen animation using anime.js
anime({
  targets: '#homeScreen',
  translateY: [-100, 0],
  easing: 'easeInOutSine',
  duration: 2000,
  loop: true
});

function startGame() {
    document.getElementById('homeScreen').style.display = "none"; // Hide home screen
    document.getElementById('gameScreen').style.display = "block"; // Display game screen

    // Fetch and initialize cards
    fetch("./data/cards.json")
      .then((res) => res.json())
      .then((data) => {
        cards = [...data, ...data];
        shuffleCards();
        generateCards();
      });
}

function shuffleCards() {
  let currentIndex = cards.length,
    randomIndex,
    temporaryValue;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }
}

function generateCards() {
  gridContainer.innerHTML = ""; // Clear previous cards if restarting
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
      <div class="front">
        <img class="front-image" src=${card.image} />
      </div>
      <div class="back"></div>
    `;
    gridContainer.appendChild(cardElement);
    cardElement.addEventListener("click", flipCard);
  }
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  lockBoard = true;

  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;
  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  score++; // Increment score on a match
  document.querySelector(".score").textContent = score;

  resetBoard();
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
}

function resetBoard() {
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

function restart() {
  resetBoard();
  shuffleCards();
  score = 0; // Reset score on restart
  document.querySelector(".score").textContent = score;
  gridContainer.innerHTML = ""; // Clear previous cards
  generateCards();
}


function showCustomizationScreen() {
  // Show customization screen
  document.getElementById('customizationScreen').style.display = "block";
  
  // Hide other screens
  document.getElementById('homeScreen').style.display = "none";
  document.getElementById('gameScreen').style.display = "none";
}

// Event listener for color customization
document.querySelectorAll('.color-option').forEach(button => {
  button.addEventListener('click', (event) => {
    // Apply chosen color to the body background
    const color = event.target.getAttribute('data-color');
    document.body.style.backgroundColor = color;
  });
});

// Event listener for card background customization
document.querySelectorAll('.image-option').forEach(button => {
  button.addEventListener('click', (event) => {
    // Apply chosen image to grid-container background
    const image = event.target.getAttribute('data-image');
    document.querySelector('.grid-container').style.backgroundImage = `url('${image}')`;
  });
});
// Show home screen logic with a smooth transition
function showHomeScreen() {
  const backButton = document.querySelector('.back-button');
  
  if (backButton) {
    backButton.addEventListener('click', () => {
      // Hide game screen and show home screen
      document.getElementById('gameScreen').style.display = "none";
      document.getElementById('homeScreen').style.display = "block";
    });
  }
}

function newStart() {
  // Hide home screen and show game screen
  document.getElementById('homeScreen').style.display = "none";
  document.getElementById('gameScreen').style.display = "block";
}

// Call showHomeScreen to attach the event listener for the back button
showHomeScreen();
