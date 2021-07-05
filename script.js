let colorKeys = {'pink': 'rgb(245, 63, 102)', 'red': 'rgb(214, 6, 6)', 'orange': 'rgb(255, 123, 0)', 'yellow': 'rgb(255, 238, 0)', 'green': 'rgb(102, 255, 0)', 'blue': 'rgb(0, 195, 255)', 'white': 'white', 'silver': 'rgb(172, 172, 172)'}
const guesses = document.querySelector('.board').querySelectorAll('.guess');
const selectionColors = document.querySelectorAll('.selectionColor');
const checkButtons = document.querySelectorAll('.check');
const mainBody = document.querySelectorAll('div:not(.message)');
let guessNum = 1;
let numKeys = Object.keys(colorKeys);
let colorCount;
let gameIsFinished = false;
let code = generateColorCode();
code = [numKeys[code[0]], numKeys[code[1]], numKeys[code[2]], numKeys[code[3]]];
let guessArr = new Array(4).fill();
allowColorChange(0);
let personalBest = localStorage.getItem('personalBest') || Infinity;
updateBestScore()
// get rid of finishing message
document.addEventListener('click', e => {
    // if anywhere on the page is clicked that isn't a div, hide message and remove blur effect
    if (e.target.tagName === 'BODY' || e.target.tagName === 'H1' || e.target.tagName === 'HTML' || e.target.classList.contains('close')) {
        document.querySelector('.message').style.display = 'none';
        mainBody.forEach(el => el.classList.remove('blur'));
        document.querySelector('.title').classList.remove('blur');
        document.querySelector('.restart').classList.remove('blur');
        gameIsFinished = true;
    } else if (e.target.classList.contains('replay')) {
        // hide message and remove blur effect
        if (e.target.classList.contains('replay-mess')) {
            document.querySelector('.message').style.display = 'none';
            mainBody.forEach(el => el.classList.remove('blur'));
            document.querySelector('.title').classList.remove('blur');
            document.querySelector('.restart').classList.remove('blur');
        }
        // restart game
        restart();
    }
});

// check buttons: marks score of row on click
checkButtons.forEach(check => {
    check.addEventListener('click', () => {
            let score = markScore(guessArr);
            let redTag = guesses[guessNum - 2].querySelector('.redTag');
            let whiteTag = guesses[guessNum - 2].querySelector('.whiteTag');
            if (score.red === 4) {
                setTimeout(function(){
                    if (guessNum - 1 < personalBest) {
                        document.querySelector('.message').querySelector('h1').innerText = `You Win! You've solved it in ${guessNum - 1} guesses and beat your personal best!`;
                        personalBest = guessNum - 1;
                        updateBestScore();
                        localStorage.setItem('personalBest', personalBest);
                        document.querySelector('.message').style.display = 'block';
                        mainBody.forEach(el => el.classList.add('blur'));
                        document.querySelector('.title').classList.add('blur');
                        document.querySelector('.restart').classList.add('blur');
                    } 
                }, 800);
                console.log(`you win! you\'ve solved it in ${guessNum - 1} guesses!`)
                // game is finished, user has won
            } else if (guessNum === 10) {
                setTimeout(function(){ 
                    document.querySelector('.message').querySelector('h1').innerText = `You lose. 😢 Better luck next time.`;
                    document.querySelector('.message').style.display = 'block';
                    mainBody.forEach(el => el.classList.add('blur'));
                    document.querySelector('.title').classList.add('blur');
                    document.querySelector('.restart').classList.add('blur');
                }, 1000);
                // game is finished, user has lost
                console.log('user has lost')
            }
            console.log(code)
            if (score.red > 0) redTag.innerText = score.red;
            if (score.white > 0) whiteTag.innerText = score.white;
            guessArr = new Array(4).fill();
            colorCount = 0;
        checkButtons[guessNum - 2].style.display = 'none';
        console.log(colorCount, 'here')
    })
})

// the 8 colors you select from for your guesses
selectionColors.forEach(color => {
    color.addEventListener('click', () => {
        if (!gameIsFinished) {
            let color1 = guesses[guessNum - 1].querySelector('.color1');
            let color2 = guesses[guessNum - 1].querySelector('.color2');
            let color3 = guesses[guessNum - 1].querySelector('.color3');
            let color4 = guesses[guessNum - 1].querySelector('.color4');
            let colors = [color1, color2, color3, color4];
            colorCount = 0;
            for (var i = 0; i < colors.length; i++) {
                if (colors[i].style.backgroundColor !== '' && colors[i].style.backgroundColor !== 'grey') colorCount++;
            }
            for (var i = 0; i < colors.length; i++) {
                let colorCode = colorKeys[color.classList[color.classList.length - 1]];
                let colorName = color.classList[color.classList.length - 1];
                if (colors[i].style.backgroundColor === '' || colors[i].style.backgroundColor === 'grey') {
                    guessArr[i] = colorName;
                    colors[i].style.backgroundColor = colorCode;
                    colors[i].style.border = `1px solid ${colorCode}`;
                    break;
                }
            }
            if (colorCount === 3) {
                checkButtons[guessNum - 1].style.display = 'block';
                console.log(guessNum, 'guessNum', colorCount)
                guessNum++;
                allowColorChange(guessNum - 1);
            }
            }
    })
});

// marks score
function markScore(guess) {
    let codeObj = {};
    for (var j = 0; j < code.length; j++) codeObj[code[j]] = true;  
    let red = 0, white = 0;
    let guessObj = {};
    for (var i = 0; i < guess.length; i++) {
        if (guess[i] === code[i]) {
            if (guessObj[guess[i]]) {
                white = white - guessObj[guess[i]];
                guessObj[guess[i]] = 1;
            }
            red++;
            guessObj[guess[i]] = true;
        } else if (codeObj[guess[i]] && !guessObj[guess[i]]) {
            white++;
            guessObj[guess[i]] = (guessObj[guess[i]] || 0) + 1;
        }
    }
    return {red, white};
}

// generates new color code each call
function generateColorCode() {
    let colors = {};
    let code = new Array(4).fill();
    for (var i = 0; i < code.length; i++) {
        let newCode = Math.floor(Math.random() * 7);
        if (!colors[newCode]) {
            code[i] = newCode;
            colors[newCode] = true;
        } else {
            while (colors[newCode]) {
                newCode = Math.floor(Math.random() * 7);
            }
            code[i] = newCode;
            colors[newCode] = true;
        }
    }
    return code;
}
function allowColorChange(row) {
    if (row === guessNum - 1) {
        if (row === 0) {
            guesses[row].querySelectorAll('.colors').forEach(color => {
                color.addEventListener('click', () => {
                    if (row === guessNum - 1) {
                        color.style.backgroundColor = 'grey';
                        color.style.border = '1px solid white';
                    }
                })
            })
        } else {
            guesses[row].querySelectorAll('.colors').forEach(color => {
                color.addEventListener('click', () => {
                    if (row === guessNum - 1) {
                        color.style.backgroundColor = 'grey';
                        color.style.border = '1px solid white';
                    }
                })
            })
        }
    }
}
function restart() {
    code = generateColorCode();
    code = [numKeys[code[0]], numKeys[code[1]], numKeys[code[2]], numKeys[code[3]]];
    guessNum = 1;
    guesses.forEach(row => {
        const colors = row.querySelectorAll('.colors');
        colors.forEach(bead => {
            bead.style.backgroundColor = 'grey';
            bead.style.border = '1px solid white';
        });
        row.querySelector('.redTag').innerText = '';
        row.querySelector('.whiteTag').innerText = '';
        row.querySelector('.check').style.display = 'none';
        console.log(colors)
    });
}
function updateBestScore() {
    personalBest === Infinity ? document.querySelector('.personal-best').innerText = `Personal Best: ?` : document.querySelector('.personal-best').innerText = `Personal Best: ${personalBest}`;
}