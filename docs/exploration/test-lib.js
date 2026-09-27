//test del funzionamento e dell'output della libreria integrata
const { Connect4, Connect4AI} = require('connect4-ai');


// ===============
// TEST 1: Umano vs Umano
// ===============
console.log("======== TEST umano vs Umano =========");
const game1= new Connect4();
const moveHistory1 = [];
const playerMove = 3;
if (game1.canPlay(playerMove)){
    game1.play(playerMove);
    moveHistory1.push(playerMove);
}
console.log("Posso gioca 3:",game1.canPlay(playerMove));
console.log("status della partita:", JSON.stringify(game1.gameStatus()));
console.log("Storia dei movimenti:", moveHistory1);
console.log("Board ascii:\n:", game1.ascii());

// ---- Test mossa singola + mossa AI ------
console.log("======== TEST2 umano vs AI =========");
const game2= new Connect4AI();
const moveHistory2 = [];

const playerMove2 = 3;
if (game2.canPlay(playerMove2)){
    game2.play(playerMove2);
    moveHistory2.push(playerMove2);
}
console.log("Mossa umana colonna 3:");
console.log("status della partita:", JSON.stringify(game2.gameStatus()));

const aiColumnPlayed = game2.playAI('hard');
moveHistory2.push(aiColumnPlayed);
console.log("status della partita:", JSON.stringify(game2.gameStatus()));
console.log("Storia dei movimenti:", moveHistory2);
console.log("Board ascii:\n:", game2.ascii());

// ======= TEST sequenza di più mosse fino a possibile vittoria
console.log("======== TEST23 sequenza completa vs AI =========");
const game3= new Connect4AI();
const moveHistory3 = [];
function handlePlay(playFunction, label) {
  if(game3.gameStatus().gameOver) {
    console.log(`[${label}] Partita già finita, mossa saltata`);
    return;
  }
  
    
  const result = playFunction();
  console.log(`[${label}] eseguita. Valore restituito:`, result);
  console.log(game3.ascii());
  console.log("status della partita:", JSON.stringify(game3.gameStatus()));
}

const movesPlayer1 = [3, 4, 3, 2, 1];
movesPlayer1.forEach((humanPlay,i) => {
  handlePlay(() => {game3.play(humanPlay), moveHistory3.push(humanPlay);}, `Umano #${i} col ${humanPlay}`);
  handlePlay(() => {const aiCol=game3.playAI('hard');
    moveHistory3.push(aiCol);
    return aiCol;
  },`IA #${i}`);  // or 'easy' or 'medium'
});

console.log("status della partita:", JSON.stringify(game3.gameStatus()));
console.log("Storia dei movimenti:", moveHistory3);

// ====== Test 4: Forzare una vittoria verticale =====
console.log("======== TEST4: Vittoria =========");
const game4= new Connect4();
winSequence = [0,1,0,1,0,1,0];

winSequence.forEach((col) => {
  if(!game4.gameStatus().gameOver && game4.canPlay(col)){
    game4.play(col);
  }
});

console.log("Stato finale", JSON.stringify(game4.gameStatus()));
console.log("Board finale", game4.ascii());
