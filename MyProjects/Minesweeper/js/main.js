'use strict';


console.log('Mines Sweeper');

var FLAG = '⚑';
var MINE = '💣'

console.log(gBoard);
var gLevel = {
    SIZE: 4,
    MINES: 2
};
var gGameFinished = false;
var gBoard;

var gState = {
    openCount: 0,
    markedCount: 0,
    secsPassed: 0,

}

var gFirstClickDone = false;
var gElTimer = document.querySelector('.timer');
var gElMinesCount = document.querySelector('.mines-count');
var gElEndGame = document.querySelector('.end-game')
var gtimerInterval;

initGame();
function newGame(size, minesCount) {
    gLevel.SIZE = size;
    gLevel.MINES = minesCount;
    gState.openCount = 0;
    gState.markedCount = 0;
    initGame();
    gGameFinished = false;
}

function initGame() {
    clearInterval(gtimerInterval);
    gElTimer.innerHTML = '000'
    gElMinesCount.innerHTML = ('000' + gLevel.MINES).substr(-3);
    gFirstClickDone = false;
    gElEndGame.innerHTML = ''
    gBoard = buildBoard(gBoard);
    renderBoard(gBoard)
}

function buildBoard() {
    var board = [];
    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = [];
        for (var j = 0; j < gLevel.SIZE; j++) {
            var cell = { sign: '', value: '', state: 'close' }
            board[i][j] = cell;
        }
    }
    putMines(board, gLevel.SIZE, gLevel.MINES);
    putCellValues(board, gLevel.SIZE);
    return board;
}

function putMines(board, lengthBoard, minesNum) {
    for (var i = 0; i < minesNum; i++) {
        putMine(board, lengthBoard);
    }
}

function putMine(board, lengthBoard) {
    var rowIdx = getRandomIntInclusive(0, lengthBoard - 1);
    var colIdx = getRandomIntInclusive(0, lengthBoard - 1);

    while (board[rowIdx][colIdx].value === MINE) {
        rowIdx = getRandomIntInclusive(0, lengthBoard - 1);
        colIdx = getRandomIntInclusive(0, lengthBoard - 1);
    }
    board[rowIdx][colIdx].value = MINE
}

function putCellValues(board, lengthBoard) {
    for (var i = 0; i < lengthBoard; i++) {
        for (var j = 0; j < lengthBoard; j++) {
            //  console.log('value in ', board[i][j]);
            var cell = board[i][j];
            if (cell.value !== MINE) cell.value = getMinesNegsCount(board, i, j);
            if (cell.value === 0) cell.value = '';
        }
    }
}

function renderBoard(board) {
    var strHtml = '';
    for (var i = 0; i < gLevel.SIZE; i++) {
        var row = board[i];

        strHtml += '<tr>';
        for (var j = 0; j < gLevel.SIZE; j++) {
            var cell = board[i][j];
            var cellValue = cell.value;
            var mineClass = '';
            if (cellValue === MINE) {
                mineClass = "mine"
            }
            var tdId = 'cell-' + i + '-' + j;
            strHtml += '<td id="' + tdId + '" onclick="cellClicked(this, ' + i + ',' + j + ')" '
                + 'oncontextmenu="cellMarked(this)"'
                + '>'
                + '<span class="hide ' + mineClass + '">' + cell.value + '</span>'
                + '<span class="sign hide">' + FLAG + '</span>'
                + '</td>';
        }
        strHtml += '</tr>';

    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHtml;
}

function cellClicked(elCell, i, j) {
    if (gBoard[i][j].sign !== FLAG && !gGameFinished) {
        cellOpen(elCell, i, j);
        if (gFirstClickDone === false) setTimer();
        gFirstClickDone = true;
        checkValue(i, j);
    }
}
function checkValue(i, j) {
    if (gBoard[i][j].value === MINE) gameOver('loose');
    if (checkWin()) gameOver('win');
    else if (gBoard[i][j].value === '') {
        expandShown(i, j);
    }
}

function checkWin() {
    var res = false;
    var board = gBoard;
    var openCellsTarget = board.length * board.length - gLevel.MINES;
    if ((gState.openCount === openCellsTarget) && (gState.markedCount === +gLevel.MINES)) res = true;
    return res;
}

function getSelector(i, j) {
    return '#' + 'cell-' + i + '-' + j;
}

function getMinesNegsCount(board, rowIdx, colIdx) {
    var minesCount = 0;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (!(i >= 0 && i < board.length)) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            // If middle cell or out of mat - continue;
            if ((i === rowIdx && j === colIdx) ||
                (j < 0 || j >= board[i].length)) continue;
            if (board[i][j].value === MINE) minesCount++;
        }
    }
    return minesCount;
}

function runTimer(startTimerTime) {
    gState.secsPassed = parseInt((Date.now() - startTimerTime) / 1000);
    var timePresent = ('000' + gState.secsPassed).substr(-3)
    gElTimer.innerHTML = timePresent;

}

function setTimer() {
    //timer appear
    var startTimerTime = Date.now();
    gtimerInterval = setInterval(runTimer, 10, startTimerTime);
}

function cellMarked(elCell) {
    
    var strCellId = elCell.id;
    var i = +strCellId.substring(5, strCellId.lastIndexOf('-'));
    var j = +strCellId.substring(strCellId.lastIndexOf('-') + 1);
    if (gBoard[i][j].state !== 'open'){
        if (gBoard[i][j].sign === FLAG) {
            var elSign = elCell.querySelector('.sign');
            gBoard[i][j].sign = '';
            gState.markedCount--;
            elSign.classList.add('hide');
        }
        else {
            gBoard[i][j].sign = FLAG;
            console.log(elCell);
            var elSign = elCell.querySelector('.sign');
            elSign.classList.remove('hide');
            gState.markedCount++
            if (checkWin()) gameOver('win');
        }
    }
    gElMinesCount.innerHTML = ('000' + (gLevel.MINES - gState.markedCount)).substr(-3);
}

function cellOpen(elCell, i, j) {
    console.log(40);
    if (gBoard[i][j].state != 'open') gState.openCount++;
    gBoard[i][j].state = 'open';

    // console.log('kkk', elCell.querySelector('span'));
    elCell.classList.add('color');
    var elSpan = elCell.querySelector('span');
    //console.log('elSpan', elSpan);
    elSpan.classList.remove('hide');
    checkWin();
}

//This is my old expansion because of unclear explanations
/*function expandShown(rowIdx, colIdx) {
    var board = gBoard;
    for (var i = rowIdx - 2; i <= rowIdx + 2; i++) {
        if (!(i >= 0 && i < board.length)) continue;
        for (var j = colIdx - 2; j <= colIdx + 2; j++) {
            // If middle cell or out of mat - continue;
            if ((i === rowIdx && j === colIdx) ||
                (j < 0 || j >= board[i].length)) continue;
            var cell = board[i][j];
            if (cell.value !== MINE && cell.sign !== FLAG) {
                var selector = getSelector(i, j);
                var elCell = document.querySelector(selector);
                cellOpen(elCell, i, j)
            }
        }
    }
}*/

//this was my seccond attempt  
function expandShown(rowIdx, colIdx) {
    //Going right

    for (var idx = colIdx; idx <= colIdx + 2 && idx < gLevel.SIZE; idx++) {
        var right = idx;
        if (gBoard[rowIdx][idx].value !== '') break;
    }
    // Going left
    for (idx = colIdx; idx >= colIdx - 2 && idx >= 0; idx--) {
        var left = idx;
        if (gBoard[rowIdx][idx].value !== '') break;

    }
    // Going Down
    for (idx = rowIdx; idx >= rowIdx - 2 && idx >= 0; idx--) {
        var down = idx;
        if (gBoard[idx][colIdx].value !== '') break;

    }
    // Going Up
    for (idx = rowIdx; idx <= rowIdx + 2 && idx < gLevel.SIZE; idx++) {
        var up = idx;
        if (gBoard[idx][colIdx].value !== '') break;
    }
    console.log('up', up, 'down', down, 'right', right, 'left', left);
    for (var i = down; i <= up; i++) {
        for (var j = left; j <= right; j++) {
            if (gBoard[i][j].sign !== FLAG && gBoard[i][j].value !== MINE) {
                console.log(55);
                var selector = getSelector(i, j);
                var elCell = document.querySelector(selector);
                cellOpen(elCell, i, j);

            }
        }
    }

}


function expandShownRecurs(rowIdx, colIdx) {
    console.log('balagan2');
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {

        if (!(i >= 0 && i < gBoard.length)) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (!(j >= 0 && j < gBoard.length)) continue;

            console.log('i', i, 'j', j);
            var cell = gBoard[i][j];
            if (cell.value !== MINE) {
                var selector = getSelector(i, j);
                var elCell = document.querySelector(selector);
                console.log('cell', elCell);
                cellOpen(elCell, i, j);
            }
            if (cell.value === '' && cell.sign !== FLAG) {
                console.log('balagan');
                expandShownRecurs(i, j);
            }
            else return;
        }
    }
}

function gameOver(str) {
    console.log('Game Finish');
    if (str === 'loose') {
        gElEndGame.innerHTML = "You lost!!"
        showMines();
    }
    else if (str === 'win') gElEndGame.innerHTML = "You Win!!"
    clearInterval(gtimerInterval);
    gGameFinished = true;

}

function showMines() {
    console.log('kkkkk');
    /*var elMines = document.querySelectorAll('.mine');
    for (var i=0; i< elMines.length; i++ ){
        console.log (elMines);
        elMines[i].classList.remove('hide');
    }*/
    var elTds = document.querySelectorAll('td');
    for (var i = 0; i < elTds.length; i++) {
        var elTd = elTds[i];
        var elMine = elTd.querySelector('.mine');
        console.log(elMine);
        if (elMine !== null) {
            var elSign = elTd.querySelector('.sign');
            if (elSign.classList.contains('hide')) {
                //only if there is no flag on it
                elTd.classList.add('color');
                elMine.classList.remove('hide');
            }
        }


    }
}


function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}