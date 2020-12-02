/* ========== GLOBAL VARS ========== */

const START_BALANCE = 1500;
const MAX_BALANCE = 50000;
const GET_FROM_BET = 10;
const strategy = strategy3;

const ITERATIONS = 1000;





/* ========== GAME SIMULATION ========== */

let successIterations = 0;
let totalMaxLoseStreak = 0;
let maxBetsCount = 0;

let loseStreak = 0;
let maxBalance = 0;

for (let i = 0; i < ITERATIONS; i++) {

    let game = {
        startBalance: START_BALANCE,
        currBalance: START_BALANCE,
        maxBalance: MAX_BALANCE,
        wantToGetFromBet: GET_FROM_BET,
        lostOnBets: 0
    }

    let iterationMaxLoseStreak = 0;
    maxBalance = 0;
    loseStreak = 0;
    let betsCount = 0;

    while (true) {
        betsCount++;
        let roll = getRollResult();
        let bet = strategy(game);

        if (bet.color === roll.color) {
            // Победа
            iterationMaxLoseStreak < loseStreak ? iterationMaxLoseStreak = loseStreak : null;
            loseStreak = 0;

            game.currBalance += bet.bet * roll.multiplayer;
            game.lostOnBets = 0;

            maxBalance < game.currBalance ? maxBalance = game.currBalance : null;
        } else {
            // Поражение
            loseStreak++;
            iterationMaxLoseStreak < loseStreak ? iterationMaxLoseStreak = loseStreak : null;

            game.currBalance -= bet.bet;
            game.lostOnBets += bet.bet;
        }


        if (game.currBalance <= 0) {
            // Все деньги проиграны
            totalMaxLoseStreak < iterationMaxLoseStreak ? totalMaxLoseStreak = iterationMaxLoseStreak : null;
            maxBetsCount < betsCount ? maxBetsCount = betsCount : null;

            console.log('Симуляция провалилась на ставке №', betsCount, ', луз стрик - ', loseStreak, ', максимальный баланс - ', maxBalance);

            break;
        }
        if (game.currBalance >= MAX_BALANCE) {
            // Успешно дошел до цели
            totalMaxLoseStreak < iterationMaxLoseStreak ? totalMaxLoseStreak = iterationMaxLoseStreak : null;
            maxBetsCount < betsCount ? maxBetsCount = betsCount : null;

            successIterations++;
            break;
        }
    }
}


console.log('\n\nСимуляция ставок окончена. Стартовый баланс - ', START_BALANCE, ', цель - ', MAX_BALANCE, ', планируется получать за ставку - ', GET_FROM_BET)
console.log('Успешных симуляций: ', successIterations, ' из ', ITERATIONS);
console.log('Максимальный луз стрик - ', totalMaxLoseStreak);
console.log('Максимальное количество ставок для достижения цели - ', maxBetsCount, ' = ', (maxBetsCount*32/60/60/24).toFixed(3), ' дней'); // время одной ставки 32сек

/* ========== END GAME SIMULATION ========== */











/* ========== Strategies ========== */

function strategy1(options) { // только серое
    const minimalBet = 10;

    let color = 'gray';
    let winMultiplier = 2;

    bet = Math.ceil( (options.wantToGetFromBet + options.lostOnBets) / winMultiplier );
    if (bet < minimalBet) bet = minimalBet;

    return {color: color, bet: bet};
}


function strategy2(options) { // только серое, максимум 10 лузов подряд
    const minimalBet = 10;
    const maxLoseStreak = 10;

    let color = 'gray';
    let winMultiplier = 2;

    if (loseStreak >= maxLoseStreak) {
        options.lostOnBets = 0;
    }

    bet = Math.ceil( (options.wantToGetFromBet + options.lostOnBets) / winMultiplier );
    if (bet < minimalBet) bet = minimalBet;

    return {color: color, bet: bet};
}



function strategy3(options) { // только серое, удваиваем на 2 при проигрыше

    return {color: 'gray', bet: 10 }; // * 2 ** loseStreak};
}

function strategy4(options) { // только серое, максимум 10 лузов подряд v2
    const minimalBet = 10;
    const maxLoseStreak = 10;

    let color = 'gray';
    let winMultiplier = 2;

    if (loseStreak >= maxLoseStreak) {
        options.lostOnBets = 0;
    }

    bet = Math.ceil( (options.wantToGetFromBet + options.lostOnBets) / winMultiplier );
    if (bet < minimalBet) bet = minimalBet;

    return {color: color, bet: bet};
}











/* ========== Functions ========== */

function getRollResult() {
    let rnd = randomInteger(1, 54);

    if (rnd == 1) return {color: 'gold', multiplayer: 50};            // x50 Gold, 1
    else if (rnd <= 1+10) return {color: 'blue', multiplayer: 5};    // x5 Blue, 2 to 11
    else if (rnd <= 1+10+17) return {color: 'red', multiplayer: 3};  // x3 Red, 12 to 28
    else return {color: 'gray', multiplayer: 2};                     // x2 Gray, 29 to 54
}

function randomInteger(min, max) {
    // случайное число от min до (max+1)
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}