'use strict';

export {adjustGridDimensions, createGrid};

import Node from './node.js';

let board = document.getElementById('board');
const NODE_WIDTH = 20;
const NODE_HEIGHT = 20;
const MOBILE_MAX_WIDTH = 1050;
let mobileDesign = false;

function adjustGridDimensions() {
    let windowWidth = window.innerWidth;

    if (windowWidth <= MOBILE_MAX_WIDTH) {
        mobileDesign = true;
    }

    let windowHeight = window.innerHeight;
    let boardWidth = windowWidth - 40 - 
        (windowWidth % 100);
    let boardHeight = windowHeight - 200 -
        (windowHeight % 100);

    board.style.width = `${boardWidth}px`;
    board.style.height = `${boardHeight}px`;
    board.style.marginLeft = `${(windowWidth - boardWidth) / 2}px`;
    board.style.marginTop = '50px';
    board.style.gridTemplateColumns = `${Math.floor(boardWidth / NODE_WIDTH)}`;
    board.style.gridTemplateRows = `${Math.floor(boardHeight / NODE_HEIGHT)}`;
}

function createGrid(gridBoard) {
    /* Remove all previous children (divs that contain the grid cells)
        in case of resizing */
    board.innerHTML = '';
    let boardWidth = parseInt(board.style.width, 10);
    let boardHeight = parseInt(board.style.height, 10);
    let numOfCols = Math.floor(boardWidth / NODE_WIDTH);
    let numOfRows = Math.floor(boardHeight / NODE_HEIGHT);

    gridBoard.rows = numOfRows;
    gridBoard.columns = numOfCols;

    if (gridBoard.columns >= gridBoard.rows) {
        gridBoard.startRow = Math.floor(numOfRows / 2);
        gridBoard.startCol = Math.floor(numOfCols / 4);
        gridBoard.finishRow = Math.floor(numOfRows / 2);
        gridBoard.finishCol = Math.floor((numOfCols / 4) * 3);
    }

    /* Place them under each other for the mobile version */
    else {
        gridBoard.startRow = Math.floor(numOfRows / 4);
        gridBoard.startCol = Math.floor(numOfCols / 2);
        gridBoard.finishRow = Math.floor((numOfRows / 4) * 3);
        gridBoard.finishCol = Math.floor(numOfCols / 2);
    }

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
            newGridArr.push(newNode);

            let newNodeDiv = document.createElement('div');
            newNodeDiv.id = `node-${newNodeIndex}`;
            newNodeDiv.className = `${newNodeClass}`;
            /* CSS Grid Layout starts indexing at 1 instead of 0 */
            newNodeDiv.style.gridRow = `${row + 1}`;
            newNodeDiv.style.gridColumn = `${col + 1}`;

            board.appendChild(newNodeDiv);
        }
        gridBoard.nodesMatrix.push(newGridArr);
    }
}