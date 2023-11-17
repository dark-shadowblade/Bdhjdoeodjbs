window.addEventListener("load", function () {
  setTimeout(function () {
    window.scrollTo(0, 0);
  }, 100);
});

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}



 function newTab() {
  const userInput = document.getElementById("userInput").value;
  
  let flag = 0;
  let wt = parseInt(userInput) * 1000;
  
  if (wt> 900000000) {
    return;
  } else {
    let words = [];
    try {
      const response = await fetch("words.json");
      words = await response.json();
      shuffleArray(words);

      const used = new Set();
      for (let i = 1; i <= 36; i++) {
        let index = Math.floor(Math.random() * words.length);
        while (used.has(index)) {
          index = Math.floor(Math.random() * words.length);
        }
        used.add(index);
        var a = i%8;
        if(a==0){
          a=8;
        }
        const openedWindow = window.open(
          `https://www.bing.com/search?q=${words[index]}+${words[index+2]}+&FORM=QSRE${a}`,
          "_blank"
        );
            
            setTimeout(function() {
      openedWindow.close();
      window.close();
    }, 5000);
  }, 0);
        
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
}
