'use strict';

export {adjustGridDimensions, createGrid};
import Node from './node.js';
import {handleMouseDownAndEnter} from './mouseEvents.js';

let board = document.getElementById('board');
let startRow, startCol, finishRow, finishCol;

function adjustGridDimensions() {
    //let board = document.getElementById('board');
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    let boardWidth = windowWidth - 100 - 
        (windowWidth % 100);
    let boardHeight = windowHeight - 200 -
        (windowHeight % 100);

    board.style.width = `${boardWidth}px`;
    board.style.height = `${boardHeight}px`;
    board.style.marginLeft = `${(windowWidth - 
        boardWidth) / 2}px`;
    /* board.style.marginTop = `${(windowHeight - 
        boardHeight) / 2}px`; */
    board.style.marginTop = '50px';
    board.style.gridTemplateColumns = `${Math.floor(boardWidth / 20)}`;
    board.style.gridTemplateRows = `${Math.floor(boardHeight / 20)}`;
}

function createGrid(gridBoard) {
    console.log('x');
    /* Remove all previous children */
    board.innerHTML = '';
    //let board = document.getElementById('board');
    console.log(board.style.width);
    let boardWidth = parseInt(board.style.width, 10);
    let boardHeight = parseInt(board.style.height, 10);
    let numOfCols = Math.floor(boardWidth / 20);
    let numOfRows = Math.floor(boardHeight / 20);

    gridBoard.rows = numOfRows;
    gridBoard.columns = numOfCols;

    gridBoard.startRow = Math.floor(numOfRows / 2);
    gridBoard.startCol = Math.floor(numOfCols / 4);
    gridBoard.finishRow = Math.floor(numOfRows / 2);
    gridBoard.finishCol = Math.floor((numOfCols / 4) * 3);

    console.log(`${boardWidth}, ${boardHeight}`);
    for (let row = 0; row < numOfRows; row++) {
        const newGridArr = [];
        for (let col = 0; col < numOfCols; col++) {
            let newNodeIndex = `${row}-${col}`, newNodeClass, newNode;

            if (row === gridBoard.startRow && col === gridBoard.startCol) {
                gridBoard.startIsPlaced = true;
                newNodeClass = 'start';
            }

            else if (row === gridBoard.finishRow && col === gridBoard.finishCol) {
                gridBoard.finishIsPlaced = true;
                newNodeClass = 'finish';
            }

            else {
                newNodeClass = 'unvisited';
            }

            newNode = new Node(newNodeIndex, row, col, newNodeClass);
            // gridBoard.nodesMatrix.push(newNode);
            newGridArr.push(newNode);

            let newNodeDiv = document.createElement('div');
            newNodeDiv.id = `node-${newNodeIndex}`;
            newNodeDiv.className = `${newNodeClass}`;
            // console.log(newNodeDiv);
            // newNodeDiv.push(newNode);
            /* CSS Grid Layout starts indexing at 1 instead of 0 */
            newNodeDiv.style.gridRow = `${row + 1}`;
            newNodeDiv.style.gridColumn = `${col + 1}`;

            newNodeDiv.addEventListener('mousedown', function(ev) {
                handleMouseDownAndEnter.call(this, ev, 'mouseDown', gridBoard);
            });

            newNodeDiv.addEventListener('mouseenter', function(ev) {
                handleMouseDownAndEnter.call(this, ev, 'mouseEnter', gridBoard);
            });

            newNodeDiv.addEventListener('mouseup', function(ev) {
                ev.preventDefault();

                gridBoard.mouseIsPressed = false;
            });

            board.appendChild(newNodeDiv);
            
        }
        gridBoard.nodesMatrix.push(newGridArr);
    }
}