const sentence = `${localStorage.getItem('playerName')} came in first place! They will be moving onto the next round. Lets hope they don't crack under the pressure...`;      

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