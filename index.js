const boxes = document.querySelectorAll(".box");
let seq = { 1: "", 2: "", 3: "", 4: "", 5: "", 6: "", 7: "", 8: "", 9: "" };  // Handles the current state of the game board
let gameEnd = false;

const select = (element) => document.querySelector(element);                 // For further handling queryselectors

const changed = (el) => {                                                    // changed function handles when player('X') makes a move
  if (el.checked) {                                                          // checks for win condition and makes AI move
    el.disabled = true;
    let n = el.getAttribute("data-num");
    seq[n] = "x";
    checkWin();
    if (Object.values(seq).filter(Boolean).length < 9 && !gameEnd) {
      calculateNextPosition();
    }
  }
};

const checkInclude =                                                       // chechInclude() checks if player has occupied certain indices 
  (player) =>
  (...indices) =>
    indices.every((i) => seq[i] === player);

const checkIncludeX = checkInclude("x");
const checkIncludeO = checkInclude("o");

const checkWin = () => {                                                  // checkWin() Checks if either player has won the game or 
  const gameWon = (player) =>                                             // if it's a draw
    checkInclude(player)(1, 2, 3) ||
    checkInclude(player)(4, 5, 6) ||
    checkInclude(player)(7, 8, 9) ||
    checkInclude(player)(1, 4, 7) ||
    checkInclude(player)(2, 5, 8) ||
    checkInclude(player)(3, 6, 9) ||
    checkInclude(player)(1, 5, 9) ||
    checkInclude(player)(3, 5, 7);

  if (gameWon("x") || gameWon("o")) {
    const playerWon = gameWon("x") ? ".win" : ".lost";
    boxes.forEach((box) => (box.querySelector("input").disabled = true));
    select(".msg").style.display = "block";
    select(playerWon).classList.add("show");
    gameEnd = true;
  } else if (Object.values(seq).filter(Boolean).length === 9) {
    select(".msg").style.display = "block";
    select(".draw").classList.add("show");
  }
};

const addCircle = (boxNumber) => {                                                 // addCircle() handles the AI's move('o') to the specified cell
  seq[boxNumber] = "o";
  select(".overlay").classList.add("show");

  setTimeout(() => {
    select(".box-" + boxNumber).classList.add("show-circle");
    select(".box-" + boxNumber).querySelector("input").disabled = true;
    select(".overlay").classList.remove("show");
    checkWin();
  }, 400);
};

function calculateNextPosition() {                                               // calculateNextPosition() handle AI's next move based on the 
  let isEmpty = Math.ceil(Math.random() * 9);                                    //  difficulty level
  const xo_includes = (_tar) => checkIncludeO(_tar) || checkIncludeX(_tar);
  const isValidNextPosition = (newPos) =>
    !xo_includes(newPos) ? (isEmpty = newPos) : null;

  while (checkIncludeO(isEmpty) || checkIncludeX(isEmpty)) {
    isEmpty = Math.ceil(Math.random() * 9);
  }
  if (!select(".tic-tac-toe").classList.contains("easy")) {
    for (let x = 1; x < 10; x++) {
      if (checkIncludeX(x, x + 1)) {                                                  // x x _ / _ x x
        if ([1, 4, 7].includes(x)) {
          isValidNextPosition(x + 2);
        } 
        else if ([2, 5, 8].includes(x)) {
          isValidNextPosition(x - 1);
        }
      }

      if (checkIncludeX(x, x + 2) && [1, 4, 7].includes(x)) {                         // x _ x
        isValidNextPosition(x + 1);
      }

      if (checkIncludeX(x, x + 3) && x <= 6) {                                        // x _ _ / _ x _ / _ _ x
        const _tar = x + 6 > 9 ? x - 3 : x + 6;                                       // x _ _ / _ x _ / _ _ x
        isValidNextPosition(_tar);
      }

      if ([1, 3].includes(x) && checkIncludeX(x, 5)) {                                // x _ _ / _ _ x
        const _tar = x == 1 ? 9 : 7;                                                  // _ x _ / _ x _
        isValidNextPosition(_tar);                                                    // _ _ _ / _ _ _ 
      }

      if ([7, 9].includes(x) && checkIncludeX(x, 5)) {                                 // _ _ _ / _ _ _
        const _tar = x == 7 ? 3 : 1;                                                   // _ x _ / _ x _
        isValidNextPosition(_tar);                                                     // _ _ x / x _ _ 
      }

      if (select(".tic-tac-toe").classList.contains("hard")) {
        if (checkIncludeX(x, x + 6) && x <= 3) {                                      // x _ _ / _ x _ / _ _ x
            isValidNextPosition(x + 3);                                               // _ _ _ / _ _ _ / _ _ _ 
        }                                                                             // x _ _ / _ x _ / _ _ x

        if ( (x == 1 && checkIncludeX(x, x + 8)) ||(x == 3 && checkIncludeX(x, x + 4))) {      // x _ _ / _ _ x
            isValidNextPosition(5);                                                            // _ _ _ / _ _ _                                   
        }                                                                                      // _ _ x / x _ _
      }
    }
  }
  addCircle(isEmpty);
}

function replay() {                                                         // replay() resets the game
  seq = {};
  boxes.forEach((box) => {
    box.querySelector("input").disabled = false;
    box.querySelector("input").checked = false;
    box.classList.remove("show-circle");
  });
  select(".msg").style.display = "none";
  select(".win").classList.remove("show");
  select(".lost").classList.remove("show");
  select(".draw").classList.remove("show");
  gameEnd = false;
}

level = (idx) => {                                                           // level() sets difficulty level
  const levels = ["easy", "normal", "hard"];
  levels.forEach((level) => {
    select(".tic-tac-toe").classList.remove(level);
    select(".controls ." + level).classList.remove("active");
  });
  select(".tic-tac-toe").classList.add(levels[idx]);
  select(".controls ." + levels[idx]).classList.add("active");
};
