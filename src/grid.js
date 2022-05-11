'use strict';

export {adjustGridDimensions, createGrid};

import Node from './node.js';

const board = document.getElementById('board');
const NODE_WIDTH = 20;
const NODE_HEIGHT = 20;
const MOBILE_MAX_WIDTH = 1050;

function adjustGridDimensions() 
{
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    let boardWidth = 0;
    let boardHeight = 0;

    /* Desktop version */
    if (windowWidth > MOBILE_MAX_WIDTH)
    {
        /* Leave at least one cell worth of space at the left and right edge of the
            grid */
        boardWidth = windowWidth - (2 * NODE_WIDTH) - (windowWidth % 100);
        /* 200 = 100 + 50 + 50 (menu bar height + node color legend height + extra
            margin) */
        boardHeight = windowHeight - 200 - (windowHeight % 100);
        board.style.marginTop = '50px';
    }

    /* Mobile version */
    else
    {
        /* Leaves at least the widht of a node from the grid as space on both sides */
        boardWidth = windowWidth - (2 * NODE_WIDTH) - (windowWidth % NODE_WIDTH);
        /* Leaves at least the height of a node from the grid as space above and below
            the grid */
        boardHeight = windowHeight - document.getElementsByClassName('menuBar')[0].clientHeight
            - document.getElementsByClassName('descriptionBar')[0].clientHeight
            - (2 * NODE_HEIGHT) - (windowHeight % NODE_HEIGHT);
        board.style.marginTop = `${NODE_HEIGHT}px`;
    }

    board.style.width = `${boardWidth}px`;
    board.style.height = `${boardHeight}px`;
    board.style.marginLeft = `${(windowWidth - boardWidth) / 2}px`;
    board.style.gridTemplateColumns = `${Math.floor(boardWidth / NODE_WIDTH)}`;
    board.style.gridTemplateRows = `${Math.floor(boardHeight / NODE_HEIGHT)}`;
}

function createGrid(gridBoard) 
{
    /* Remove all previous children (divs that contain the grid cells)
        in case of resizing */
    board.innerHTML = '';
    const boardWidth = parseInt(board.style.width, 10);
    const boardHeight = parseInt(board.style.height, 10);
    const numOfCols = Math.floor(boardWidth / NODE_WIDTH);
    const numOfRows = Math.floor(boardHeight / NODE_HEIGHT);

    gridBoard.rows = numOfRows;
    gridBoard.columns = numOfCols;

    if (gridBoard.columns >= gridBoard.rows) 
    {
        gridBoard.startRow = Math.floor(numOfRows / 2);
        gridBoard.startCol = Math.floor(numOfCols / 4);
        gridBoard.finishRow = Math.floor(numOfRows / 2);
        gridBoard.finishCol = Math.floor((numOfCols / 4) * 3);
    }

    /* Place them under each other for the mobile version */
    else 
    {
        gridBoard.startRow = Math.floor(numOfRows / 4);
        gridBoard.startCol = Math.floor(numOfCols / 2);
        gridBoard.finishRow = Math.floor((numOfRows / 4) * 3);
        gridBoard.finishCol = Math.floor(numOfCols / 2);
    }

    for (let row = 0; row < numOfRows; row++) 
    {
        const newGridArr = [];
        for (let col = 0; col < numOfCols; col++) 
        {
            const newNodeIndex = `${row}-${col}`;
            let newNodeClass, newNode;

            if (row === gridBoard.startRow && col === gridBoard.startCol) 
            {
                gridBoard.startIsPlaced = true;
                newNodeClass = 'start';
            }

            else if (row === gridBoard.finishRow && col === gridBoard.finishCol) 
            {
                gridBoard.finishIsPlaced = true;
                newNodeClass = 'finish';
            }

            else 
                newNodeClass = 'unvisited';

            newNode = new Node(newNodeIndex, row, col, newNodeClass);
            newGridArr.push(newNode);

            const newNodeDiv = document.createElement('div');
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