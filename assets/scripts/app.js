const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 20;

const MODE_ATTACK = "ATTACK";
const MODE_STRONG_ATTACK = "STRONG_ATTACK_MODE";
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVENT_GAME_OVER = "GAME_OVER";
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';

let chosenLife = prompt("Choose the amount of life you want", "100");
let chosenDaveLife = parseInt(chosenLife);

if (isNaN(chosenLife) || chosenLife <= 0) {
    chosenLife = 100;
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

  if (currentPlayerHealth <= 0 && hasBonusLife) {
    hasBonusLife = false;
    removeBonusLife();
    currentPlayerHealth = initialPlayerHealth;
    setPlayerHealth(initialPlayerHealth);
    alert("You would be dead, but your bonus health saved you")
  }
  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert('You won!');
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert('You lost!');
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
    alert('You have a draw!');
  }

  if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0 ){
    reset()
    
  }
}

function attackMonster(mode) {
  let maxDamage;
  if (mode === MODE_ATTACK) {
    maxDamage = ATTACK_VALUE;
  } else if (mode === MODE_STRONG_ATTACK) {
    maxDamage = STRONG_ATTACK_VALUE;
  }
  const damage = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= damage;
  endRound();
}


function writeToLog(event, value, monster_health, player_health) {
  let logEntry;
  if (event === LOG_EVENT_PLAYER_ATTACK) {
    logEntry = {
      event: event,
      value: value,
      finalMonsterHealth: monster_health,
      finalPlayerHealth: player_health
    }
    battleLog.push(logEntry);
  }
}



function attackHandler() {
  attackMonster(MODE_ATTACK);
}

function strongAttackHandler() {
  attackMonster(MODE_STRONG_ATTACK);
}

function healPlayerHealth() {
  let healValue;
  if (currentPlayerHealth >= chosenDaveLife - HEAL_VALUE){
    alert ("You can't heal more than your maximum health")
    healValue = chosenDaveLife - currentPlayerHealth;
  }else {
    healValue = HEAL_VALUE;
  }
  currentPlayerHealth += healValue;
  increasePlayerHealth(healValue);
  endRound();
}



attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healPlayerHealth);


