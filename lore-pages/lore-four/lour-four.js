const sentence = `${localStorage.getItem('playerName')}'s hard work, dedication, and determination finally paid off as he crossed the finish line of the last and final race. Overcome with emotion, he collapsed onto the ground, tears of joy streaming down his face. As he stood up and lifted his arms in victory, he knew that nothing could stop him now - he had achieved his dream and proven that anything is possible with perseverance.`;      

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