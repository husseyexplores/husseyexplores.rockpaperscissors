console.log(
  "%cscript.js Loaded",
  "color: #b5f5bd; font-size: 12px; padding: 5px 15px; background: #404040; border-radius: 3px;"
);

// SCORE CONTROLLER
const scoreController = (function() {

  const data = {
    scores: {
      you: 0,
      computer: 0
    },
    rounds: {
      currentRound: 0
    }
  }

  const getScore = () => {
    return data.scores;
  };

  const getRounds = () => {
    return data.rounds;
  };

  const updateScore = plyr => {
    const newScore = data.scores[plyr] += 1;
    return newScore;
  }

  const resetScore = () => {
    data.scores.you = 0;
    data.scores.computer = 0;
    data.rounds.currentRound = 0;
  }

  return {
    getScore,
    getRounds,
    updateScore,
    resetScore
  };

})();

// UI CONTROLLER
const UIController = (function() {

  const selectorClasses  = {
    playerInputSelector: '[name=user-choice]',
    pointsToWin: '#points-to-win',
    youPlayed: '#you-played',
    cpuPlayed: '#cpu-played',
    roundWinner: '#round-winner',
    yourResultSelector: '#player-points-res',
    cpuResultSelector: '#cpu-points-res',
    winnerWrapper: '.winner',
    winnerSelector: '#winner',
    restartGameSelector: '#restart-game'
  }

  const selectors  = {
    playerInputSelector: document.querySelectorAll(selectorClasses.playerInputSelector),
    pointsToWin: document.querySelector(selectorClasses.pointsToWin),
    youPlayed: document.querySelector(selectorClasses.youPlayed),
    cpuPlayed: document.querySelector(selectorClasses.cpuPlayed),
    roundWinner: document.querySelector(selectorClasses.roundWinner),
    yourResultSelector: document.querySelector(selectorClasses.yourResultSelector),
    cpuResultSelector: document.querySelector(selectorClasses.cpuResultSelector),
    winnerWrapper: document.querySelector(selectorClasses.winnerWrapper),
    winnerSelector: document.querySelector(selectorClasses.winnerSelector),
    restartGameSelector: document.querySelector(selectorClasses.restartGameSelector)
  }

  const updateUI = (youPlyd, yourPnts, cpuPlyd, cpuPnts, winner) => {
    // Update Player Data
    selectors.youPlayed.innerHTML = youPlyd;
    selectors.yourResultSelector.innerHTML = yourPnts;

    // Update CPU Data
    selectors.cpuPlayed.innerHTML = cpuPlyd;
    selectors.cpuResultSelector.innerHTML = cpuPnts;

    // Update Round Winner
    selectors.roundWinner.innerHTML = winner;
  }

  const updateGameWinner = (winner) => {
    // Update Game Winner and display it
    selectors.winnerSelector.innerHTML = winner;
    selectors.winnerWrapper.style.opacity = 1;
  }

  const disableRadioInput = (listenerFunc) => {
    selectors.playerInputSelector.forEach(el => {
      el.removeEventListener('change', listenerFunc);
      el.disabled = true;
    });
  }

  const enableRadioInput = (listenerFunc) => {
    selectors.playerInputSelector.forEach(el => {
      el.addEventListener('change', listenerFunc);
      el.disabled = false;
    });
  }

  const resetFields = () => {
    selectors.yourResultSelector.innerHTML = 0;
    selectors.cpuResultSelector.innerHTML = 0;
    selectors.youPlayed.innerHTML = '';
    selectors.cpuPlayed.innerHTML = '';
    selectors.roundWinner.innerHTML = '';
    selectors.winnerWrapper.style.opacity = 0;
  }

  const getPointsToWin = () => {
    return parseInt(selectors.pointsToWin.value, 10);
  }

  const getSelectors = () => {
    return selectors;
  }

  return {
    resetFields,
    getSelectors,
    updateUI,
    updateGameWinner,
    disableRadioInput,
    enableRadioInput,
    getPointsToWin
  }

})();

// APP CONTROLLER 
const appController = (function(scrCtrl, UICtrl) {

  let gameEnd = false;
  let tieCount = 0;
  const options = ['Rock', 'Paper', 'Scissors'];
  const players = ['you', 'computer'];

  const computerChoiceGenerator = () => {
    return options[Math.floor(Math.random() * options.length)];
  }

  const checkRoundWinner = (plyrChoice, cmpChoice) => {
    if (plyrChoice === cmpChoice) {
      tieCount++;
      if (tieCount > 2) M.toast({html: `What the heck!! ${tieCount} ties in a row 😅`});
      return 'It\'s a tie!'; // It's a tie
    } else if (plyrChoice === "Paper" && cmpChoice === "Rock") {
      tieCount = 0;
      return players[0];
    } else if (plyrChoice === "Scissors" && cmpChoice === "Rock") {
      tieCount = 0;
      return players[1];
    } else if (plyrChoice === "Rock" && cmpChoice === "Scissors") {
      tieCount = 0;
      return players[0];
    } else if (plyrChoice === "Paper" && cmpChoice === "Scissors") {
      tieCount = 0;
      return players[1];
    } else if (plyrChoice === "Rock" && cmpChoice === "Paper") {
      tieCount = 0;
      return players[1];
    } else if (plyrChoice === "Scissors" && cmpChoice === "Paper") {
      tieCount = 0;
      return players[0];
    }
  }

  const checkGameWinner = () => {
    const ptw = UICtrl.getPointsToWin();
    return scrCtrl.getScore().you === ptw ? 'You' : scrCtrl.getScore().computer === ptw ? 'CPU' : false;
  }

  const isGameEnd = (gWinner) => {
    UICtrl.updateGameWinner(gWinner);
    gameEnd = true;
    UICtrl.disableRadioInput(playRound);
  }

  const playRound = (el) => {
    let yourChoice;
    let cpuChoice;
    let yourPoints;
    let cpuPoints;
    let roundWinner;
    let gameWinner;

    if (el.target.checked && !gameEnd) {
      yourChoice = options[el.target.value];
      cpuChoice = computerChoiceGenerator();
      roundWinner = checkRoundWinner(yourChoice, cpuChoice);

      scrCtrl.updateScore(roundWinner);

      yourPoints = scrCtrl.getScore().you;
      cpuPoints = scrCtrl.getScore().computer;

      UICtrl.updateUI(yourChoice, yourPoints, cpuChoice, cpuPoints, roundWinner);

      gameWinner = checkGameWinner();

      if (gameWinner) {
        isGameEnd(gameWinner);
      }

        setTimeout(() => el.target.checked = false, 300);
    }
  }

  const setupEventsListeners = () => {

    const selectors = UICtrl.getSelectors();
  
    selectors.pointsToWin.addEventListener('keyup', (e) => {
      if (e.target.value === '') return;
      if (e.target.value > 0 && e.target.value <= 10) {
        init();
      } else {
        M.toast({html: 'Please enter a number between 1 to 10'});
      }
    });

    selectors.playerInputSelector.forEach( el => {
      el.addEventListener('change', playRound);
    });

    selectors.restartGameSelector.addEventListener('click', init);

  }

  const init = () => {
    setupEventsListeners();
    UICtrl.resetFields();
    UICtrl.enableRadioInput(playRound);
    gameEnd = false;
    scrCtrl.resetScore();
    console.log(
      "%cApp initialized!",
      "color: #b5f5bd; font-size: 12px; padding: 5px 15px; background: #404040; border-radius: 3px;"
    );
  }

  return {
    init
  }
})(scoreController, UIController);

appController.init();