// node simulation/siteRandomNums.js  
var SHA256 = require("crypto-js/sha256");
const crypto = val => SHA256(val).toString();

const secret = "9ea2acccfb3ad9f9e7fac8a5df4e9c0c57f072fb4aff8826d58dafca01275377";
const nonce = 1;

function getRandom({ secret, nonce, divisions = 54 }) {
	const fullSeed = crypto(`${secret}:${nonce}`);

	const seed = fullSeed.substr(0, 8);

	return parseInt(seed, 16) % divisions;
}

console.log( getRandom({ secret, nonce }) );






const choices = [
    [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52],
    [3, 5, 7, 13, 15, 17, 23, 25, 27, 29, 31, 37, 39, 41, 47, 49, 51],
    [1, 9, 11, 19, 21, 33, 35, 43, 45, 53],
    [0],
];

function getColor(num) {
    for (let i = 0; i < choices.length; i++)
        for (let j = 0; j < choices[i].length; j++)
            if (num == choices[i][j]) 
                switch(j) {
                    case 0: return 'gray';
                    case 1: return 'red';
                    case 2: return 'blue';
                    case 3: return 'gold';
                }
}


