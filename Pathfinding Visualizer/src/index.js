'use strict';

import Node from './node.js';

document.addEventListener('DOMContentLoaded', function() {
    function adjustGridDimensions() {
        let board = document.getElementById('board');
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
        board.style.marginTop = `${(windowHeight - 
            boardHeight) / 2}px`;
        board.style.gridTemplateColumns = `${Math.floor(boardWidth / 20)}`;
        board.style.gridTemplateRows = `${Math.floor(boardHeight / 20)}`;
    }

    adjustGridDimensions();

    function createGrid() {
        console.log('x');
        let board = document.getElementById('board');
        console.log(board.style.width);
        let boardWidth = parseInt(board.style.width, 10);
        let boardHeight = parseInt(board.style.height, 10);
        let numOfCols = Math.floor(boardWidth / 20);
        let numOfRows = Math.floor(boardHeight / 20);
        console.log(`${boardWidth}, ${boardHeight}`);
        for (let row = 1; row <= numOfRows; row++) {
            console.log(`${row}`);
            for (let col = 1; col <= numOfCols; col++) {
                console.log(`${col}`);
                let newNodeIndex = `${row}-${col}`, newNodeClass, newNode;

                if (row === Math.floor(boardHeight / 2) && col === Math.floor(boardWidth / 4)) {
                    newNodeClass = 'start';
                }

                else if (row === Math.floor(boardHeight / 2) && col === Math.floor((boardWidth / 4) * 3)) {
                    newNodeClass = 'finish';
                }

                else {
                    newNodeClass = 'unvisited';
                }

                newNode = new Node(newNodeIndex, newNodeClass);

                let newNodeDiv = document.createElement('div');
                newNodeDiv.id = `${newNodeIndex}`;
                newNodeDiv.class = `${newNodeClass}`;
                // console.log(newNodeDiv);
                // newNodeDiv.push(newNode);
                newNodeDiv.style.gridRow = `${row}`;
                newNodeDiv.style.gridColumn = `${col}`;
                // console.log(newNodeDiv);
                board.appendChild(newNodeDiv);
                
            }
        }

        // console.log(board);
    }

    createGrid();
}); 