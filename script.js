let playerScore = 0;
let computerScore = 0;
const maxWins = 2; // Best of 3

// Tracks the number of rounds played
let roundCount = 0;

// Get computer choice
function getComputerChoice() {
  const choices = ["rock", "paper", "scissors"];
  return choices[Math.floor(Math.random() * choices.length)];
}

// Determine winner of a round
function getWinner(player, computer) {
  if (player === computer) return "draw";
  if (
    (player === "rock" && computer === "scissors") ||
    (player === "scissors" && computer === "paper") ||
    (player === "paper" && computer === "rock")
  ) return "player";
  return "computer";
}

// Play a round
function playRound(playerChoice) {
  if (roundCount >= 3) return; // Stop the game if 3 rounds are completed

  const computerChoice = getComputerChoice();
  const winner = getWinner(playerChoice, computerChoice);

  if (winner === "player") {
    playerScore++;
    updateStatus(`You win! ${playerChoice} beats ${computerChoice}`);
  } else if (winner === "computer") {
    computerScore++;
    updateStatus(`You lose! ${computerChoice} beats ${playerChoice}`);
  } else {
    updateStatus(`Draw! You both chose ${playerChoice}`);
  }

  updateScoreUI();
  roundCount++;

  // Check if the game is over
  if (roundCount === 3) {
    const finalWinner = playerScore > computerScore ? "Player" : playerScore < computerScore ? "Computer" : "Draw";
    showResult(finalWinner);
  }
}

// Update the score on the UI
function updateScoreUI() {
  document.getElementById("scores").innerText = `Computer: ${computerScore} | Player: ${playerScore}`;
}

// Update the game status message
function updateStatus(message) {
  document.getElementById("status-bar").innerText = message;
}

// Show the final result pop-up and reset game
function showResult(finalWinner) {
  const resultPopup = document.getElementById("resultPopup");
  resultPopup.innerText = finalWinner === "Draw" ? "It's a Draw!" : `${finalWinner} wins the match!`;
  resultPopup.style.display = "block";

  // Reset game after 3 seconds
  setTimeout(() => {
    resultPopup.style.display = "none";
    resetGame();
  }, 3000); // Show result for 3 seconds before resetting
}

// Reset the game for a new match
function resetGame() {
  playerScore = 0;
  computerScore = 0;
  roundCount = 0;
  updateScoreUI();
  updateStatus("Game Reset. Choose your move to start again!");
}

// Submit score to Cloudflare Worker → Firebase
function submitScore(player, score) {
  fetch("https://rps-backend.<your-username>.workers.dev/submitScore", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ player, score }),
  })
    .then((res) => res.text())
    .then((res) => console.log("Score submitted:", res))
    .catch((err) => console.error("Submission failed:", err));
}

// Game buttons event listeners
document.getElementById("Rock").addEventListener("click", () => playRound("rock"));
document.getElementById("Paper").addEventListener("click", () => playRound("paper"));
document.getElementById("Scissors").addEventListener("click", () => playRound("scissors"));
