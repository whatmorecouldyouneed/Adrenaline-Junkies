const sentence = `${localStorage.getItem('playerName')} was a track runner from a small town with limited resources and no access to proper coaching. Despite the odds stacked against him, he refused to give up on his dream. He saved every penny he could, trained harder than ever, and now it is ${localStorage.getItem('playerName')}'s time to shine.`;      


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