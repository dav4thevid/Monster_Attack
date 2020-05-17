const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 20;

const MODE_ATTACK = "ATTACK";
const MODE_STRONG_ATTACK = "STRONG_ATTACK_MODE";

const LOG_EVENT_PLAYER_ATTACK = "PLAYER_ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVENT_GAME_OVER = "GAME_OVER";
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK";


function getDavidLiveValues() {
  const chosenValue = prompt("Choose the amount of life you want", "100");
  
  const valueParsed = parseInt(chosenValue);
  if (isNaN(valueParsed) || valueParsed <= 0) {
    throw {message: "A value that is not a number was entered,"}
  }
  return valueParsed;
}

let chosenDaveLife ;

try {
  chosenDaveLife = getDavidLiveValues();
} catch (error){
  console.log(error)
  chosenDaveLife = 100;
  alert('You entered an invalid input, default value 100 is been used');
}

let currentMonsterHealth = chosenDaveLife;
let currentPlayerHealth = chosenDaveLife;
let hasBonusLife = true;
let battleLog = [];

adjustHealthBars(chosenDaveLife);


function reset() {
  currentPlayerHealth = chosenDaveLife;
  currentMonsterHealth = chosenDaveLife;
  resetGame(chosenDaveLife);
}

function endRound() {
  const initialPlayerHealth = currentPlayerHealth;
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;

  writeToLog(
    LOG_EVENT_MONSTER_ATTACK,
    playerDamage,
    currentMonsterHealth,
    currentPlayerHealth
  );

  if (currentPlayerHealth <= 0 && hasBonusLife) {
    hasBonusLife = false;
    removeBonusLife();
    currentPlayerHealth = initialPlayerHealth;
    setPlayerHealth(initialPlayerHealth);
    alert("You would be dead, but your bonus health saved you");
  }
  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert("You won!");
    writeToLog(
      LOG_EVENT_MONSTER_ATTACK,
      'PLAYER WON',
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert("You lost!");
    writeToLog(
      LOG_EVENT_MONSTER_ATTACK,
      'MONSTER WON',
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
    alert("You have a draw!");
    writeToLog(
      LOG_EVENT_MONSTER_ATTACK,
      "THIS WAS A DRAW",
      currentMonsterHealth,
      currentPlayerHealth
    );
  }

  if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
    reset();
  }
}

function attackMonster(mode) {
  let maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
  let logEvent = mode === MODE_ATTACK ? LOG_EVENT_PLAYER_ATTACK : LOG_EVENT_PLAYER_STRONG_ATTACK;
  // if (mode === MODE_ATTACK) {
  //   maxDamage = ATTACK_VALUE;
  //   logEvent = LOG_EVENT_PLAYER_ATTACK
  // } else if (mode === MODE_STRONG_ATTACK) {
  //   maxDamage = STRONG_ATTACK_VALUE;
  //   logEvent = LOG_EVENT_STRONG_PLAYER_ATTACK;
  // }
  const damage = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= damage;
  writeToLog(
    logEvent,
    damage,
    currentMonsterHealth,
    currentPlayerHealth
  );
  endRound();
}

function writeToLog(event, value, monster_health, player_health) {
  let logEntry = {
    event: event,
    value: value,
    target: "MONSTER",
    finalMonsterHealth: monster_health,
    finalPlayerHealth: player_health,
  };
  switch(event){
    case LOG_EVENT_PLAYER_ATTACK:
      logEntry.target = "MONSTER";
      break;
    case LOG_EVENT_PLAYER_STRONG_ATTACK:
      logEntry.target = "MONSTER";
      break;
    case LOG_EVENT_MONSTER_ATTACK:
      logEntry.target = "PLAYER";
      break;
    case LOG_EVENT_PLAYER_HEAL:
      logEntry.target = "PLAYER";
      break;
    case LOG_EVENT_GAME_OVER:
      logEntry.target = "GAME_OVER";
      break;
      // default:
      //   logEntry = {}
  }
    battleLog.push(logEntry) ;  
  // if (event === LOG_EVENT_PLAYER_ATTACK) {
  //   logEntry.target = "MONSTER";
  //  ;
  // } else if (event === LOG_EVENT_PLAYER_STRONG_ATTACK) {
  //   logEntry.target = "MONSTER";
  //  ;
  // } else if (event === LOG_EVENT_MONSTER_ATTACK) {
  //   logEntry.target = "PLAYER";
  //  ;
  // } else if (event === LOG_EVENT_PLAYER_HEAL) {
  //   logEntry.target = "PLAYER";
  //  ;
  // }
}

function attackHandler() {
  attackMonster(MODE_ATTACK);
}

function strongAttackHandler() {
  attackMonster(MODE_STRONG_ATTACK);
}

function healPlayerHealth() {
  let healValue;
  if (currentPlayerHealth >= chosenDaveLife - HEAL_VALUE) {
    alert("You can't heal more than your maximum health");
    healValue = chosenDaveLife - currentPlayerHealth;
  } else {
    healValue = HEAL_VALUE;
  }
  currentPlayerHealth += healValue;
  writeToLog(
    LOG_EVENT_PLAYER_HEAL,
    healValue,
    currentMonsterHealth,
    currentPlayerHealth
  );
  increasePlayerHealth(healValue);
  endRound();
}

function printLogHandler() {
  // console.log(battleLog);

  // for (let i = 0; i < battleLog.length; i++) {
  //   console.log(battleLog[i])
  // }
let i = 0;
  for (const logEntry of battleLog){
    console.log(`#${i}`);
    for (const key in logEntry) {
    console.log(`${key} => ${logEntry[key]}`)
    }i++
  } 
  
}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayerHealth);
logBtn.addEventListener("click", printLogHandler);
