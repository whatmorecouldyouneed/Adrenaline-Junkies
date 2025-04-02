const sentence = `${localStorage.getItem('playerName')}'s perseverance paid off as they finally crossed the finish line of the final race. Overwhelmed with joy, ${localStorage.getItem('playerName')} collapsed to the ground in tears. But as they stood up, arms lifted in victory, they knew that anything was possible with hard work and dedication.`;      


const sentenceElement = document.getElementById("sentence");
      const cursorElement = document.getElementById("cursor");
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex < sentence.length) {
          sentenceElement.textContent = sentence.slice(0, currentIndex + 1);
          currentIndex++;
        } else {
          clearInterval(typingInterval);
        }
      }, 50);
      setInterval(() => {
        cursorElement.style.visibility =
          cursorElement.style.visibility === "visible" ? "hidden" : "visible";
      }, 500);