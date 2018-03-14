'use strict';


console.log('Sokoban');
var BOX = '☐';
var PLAYER = '🚶🏼'


console.log(gBoard);
var gBoardSize = {
    length: 6,
    height: 7
};
var gPlayerCoord = {
    i: '',
    j: ''
};

var gTargets = [];
 


console.log
var gameFinished = false;

var gBoard = buildBoard();
printBoard(gBoard);
renderBoard(gBoard);


var gState = {
    steps: 0,
    score: 0,
       
}

var gFirstClickDone = false;




//renderBoard(gBoard);

function newGame() {
    initGame();
    gameFinished = false;

}

function initGame() {
    elSteps.innerHTML = 'Steps:'
    elEndGame.innerHTML = '';
    elScore.innerHTML = 'Score:';
    gState.steps = 0;
    gState.score = 0;
    gameFinished = false;
    gBoard = buildBoard(gBoard);
    renderBoard(gBoard)

}

var elScore = document.querySelector('.score')
var elSteps = document.querySelector('.steps')
var elEndGame = document.querySelector('.end-game')




function printBoard(board) {
    var showBoard = [];
    console.log(gBoardSize.height);
    for (var i = 0; i < gBoardSize.height; i++) {
        showBoard[i] = [];
        for (var j = 0; j < gBoardSize.length; j++) {
            showBoard[i][j] = board[i][j].type;

        }
    }
   
}

//renderBoard(gBoard);



function buildBoard() {
    var board = [];
    for (var i = 0; i < gBoardSize.height; i++) {
        board[i] = [];
        for (var j = 0; j < gBoardSize.length; j++) {
            var cell = { type: '', value: '' }
            board[i][j] = cell;
            cell.type = 'floor';
            if (i === 0 || i === gBoardSize.height - 1 || j === 0 || j === gBoardSize.length - 1) {
                cell.type = 'wall';
            }
        }

    }

    board[1][2].type = 'target'
    board[1][3].type = 'target'
    board[4][4].type = 'wall';
    board[5][4].type = 'wall';
    board[6][4].type = 'wall';
    board[0][1].type = 'wall';
    board[1][1].type = 'wall';
    board[2][0].type = 'wall';
    board[2][1].type = 'wall';
    board[2][2].type = 'wall';

    board[3][2].value = BOX;
    board[4][2].value = BOX;

    board[5][2].value = PLAYER;
    updatePlayerCoord(5, 2);
    gTargets.push (board[1][2]);
    gTargets.push (board[1][3]);
    
    return board;

}

function updatePlayerCoord(i, j) {
    gPlayerCoord.i = i;
    gPlayerCoord.j = j;

}


function renderBoard(board) {
    var strHtml = '';
    for (var i = 0; i < gBoardSize.height; i++) {
        var row = board[i];
        strHtml += '<tr>';
        for (var j = 0; j < gBoardSize.length; j++) {
            var cell = board[i][j];

            var tdId = 'cell-' + i + '-' + j;
            strHtml += '<td id="' + tdId + '" onclick="cellClicked(' + i + ',' + j + ')" class="' + cell.type + '" >'
                + cell.value
                + '</td>';
        }
        strHtml += '</tr>';

    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHtml;

}


function movePiece(piece, currCoord , nextCoord) {
    var selector = getSelector(nextCoord.i, nextCoord.j);
    var elToCell = document.querySelector(selector);
    console.log(elToCell);
    var selector = getSelector(currCoord.i, currCoord.j);
    var elFromCell = document.querySelector(selector);
    console.log(elFromCell)
    elToCell.innerHTML = piece;
    elFromCell.innerHTML = "";
    

    gBoard[nextCoord.i][nextCoord.j].value = piece;
    gBoard[currCoord.i][currCoord.j].value = '';
   if (piece === PLAYER){
    updatePlayerCoord(nextCoord.i , nextCoord.j);
   }

}


function checkWin() {
    var board = gBoard;
    console.log('count ', gState.openCount);
    var openCellsTarget = board.length * board.length - gLevel.MINES;
    var res = gState.openCount === openCellsTarget ? true : false;
    return res;
}

function getSelector(i, j) {
    return '#' + 'cell-' + i + '-' + j;
}
function cellClicked(i, j) {
    if (!gameFinished){
        console.log('i', i, 'j', j);
        console.log('gBoard[i][j]', gBoard[i][j]);
        var cell = gBoard[i][j]
        console.log(gBoard[i][j].type)
        if (cell.value === BOX) {
            checkBoxMove(i, j)
        }
        else if ((cell.type === 'floor' || cell.type === 'target') && cell.value === '') {
            checkPlayerMove(i, j);
        }    console.log('i', i, 'j', j);
        console.log('gBoard[i][j]', gBoard[i][j]);
        var cell = gBoard[i][j]
        console.log(gBoard[i][j].type)
        if (cell.value === BOX) {
            checkBoxMove(i, j)
        }
        else if ((cell.type === 'floor' || cell.type === 'target') && cell.value === '') {
            checkPlayerMove(i, j);
        }
    }
}


function checkPlayerMove(i, j) {
    var res = false;
    console.log(gBoard[i][j]);
    var nextCoord = {i: i, j: j}
    console.log(gPlayerCoord.i, i, )
    if (Math.abs(gPlayerCoord.i - i) + Math.abs(gPlayerCoord.j - j) === 1) {
        gState.steps++;
        elSteps.innerHTML = 'Steps: ' +  gState.steps ;
        gState.score = 100 - gState.steps;
        elScore.innerHTML = 'Score: ' +  gState.score ;
        if (gState.steps > 100 ){
            gameOver ('loose')
        }
        movePiece(PLAYER, gPlayerCoord, nextCoord);
    }
}
function checkBoxMove(i, j) {
    if (Math.abs(gPlayerCoord.i - i) + Math.abs(gPlayerCoord.j - j) === 1) {
        var currCoord = {i: i , j: j}
        var nextCoord = { i: i, j: j }
        if (gPlayerCoord.i > i)  nextCoord.i = i-1;
        else if (gPlayerCoord.i < i)  nextCoord.i = i+1;
        else if (gPlayerCoord.j > j)  nextCoord.j = j-1;
        else  nextCoord.j = j+1;
        
        var cell = gBoard[nextCoord.i][nextCoord.j]

         if ((cell.type === 'floor' || cell.type === 'target') && cell.value === ''){
            movePiece(BOX , currCoord , nextCoord);
            if (checkWin()) gameOver('win');
            checkPlayerMove (i,j); 
         }       
    }
}

function checkWin (){
    var res = true;
    for (var i=0; i < gTargets.length; i++){
        if (gTargets[i].value!== BOX){
            res = false;
            break;
        } 
    }
    return res;
}




function gameOver(str) {
    console.log('Game Finish');
    if (str === 'loose') elEndGame.innerHTML = "You lost!!"
    else if (str === 'win')   elEndGame.innerHTML = "You Win with score of " + (gState.score - 1) +"!!";
    gameFinished = true;


}






function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}