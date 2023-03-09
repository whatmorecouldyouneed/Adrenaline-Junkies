const sentence = `So close! ${localStorage.getItem('playerName')} just couldn't quite cut it though. Better luck next time.`;
const backToMenuBtn = document.getElementById("back-to-menu");
const sentenceElement = document.getElementById("sentence");
const cursorElement = document.getElementById("cursor");
let currentIndex = 0;
const typingInterval = setInterval(() => {
  if (currentIndex < sentence.length) {
    sentenceElement.textContent = sentence.slice(0, currentIndex + 1);
    currentIndex++;
  } else {
    clearInterval(typingInterval);
    // Display the button after 4.5 seconds
    setTimeout(() => {
      backToMenuBtn.style.display = "block";
    }, 1000);
  }
}, 50);
setInterval(() => {
  cursorElement.style.visibility =
    cursorElement.style.visibility === "visible" ? "hidden" : "visible";
}, 500);

// Hide the button initially
backToMenuBtn.style.display = "none";

backToMenuBtn.addEventListener("click", () => {
  window.location.href = "/Adrenaline-Junkies/start-page/index.html";
});

