'use strict';

import Node from './node.js';
import Board from './board.js';
import {dijkstra} from './algorithms/dijkstra.js';

document.addEventListener('DOMContentLoaded', function() {
    var dijkstraButton = document.getElementById('dijkstra');
    var gridBoard = new Board();
    var START_COL, START_ROW, FINISH_COL, FINISH_ROW;
    const ANIMATION_SPEED = 10;

    /* TODO:
       - Clean up code
       - Better animation when a node is visited
       - Animate shortest path when node is found
       - Get shortest path by backtracking from finish to start */

    dijkstraButton.addEventListener('click', function() {
        let startNode = gridBoard.nodesMatrix[START_ROW][START_COL];
        let finishNode = gridBoard.nodesMatrix[FINISH_ROW][FINISH_COL];

        const visitedNodes = dijkstra(gridBoard, startNode, finishNode);
        //console.log(visitedNodes);
        animateDijkstra(visitedNodes);
    });

    function animateDijkstra(visitedNodes) {
        for (let i = 0; i < visitedNodes.length; i++) {
            setTimeout(function() {
                const currentNode = visitedNodes[i];
                console.log(currentNode);
                document.getElementById(`node-${currentNode.row}-${currentNode.column}`)
                    .className = 'visited';
            }, i * ANIMATION_SPEED);
        }
    }

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

        gridBoard.rows = numOfRows;
        gridBoard.columns = numOfCols;

        START_ROW = Math.floor(numOfRows / 2);
        START_COL = Math.floor(numOfCols / 4);
        FINISH_ROW = Math.floor(numOfRows / 2);
        FINISH_COL = Math.floor((numOfCols / 4) * 3);

        console.log(`${boardWidth}, ${boardHeight}`);
        for (let row = 0; row < numOfRows; row++) {
            const newGridArr = [];
            for (let col = 0; col < numOfCols; col++) {
                let newNodeIndex = `${row}-${col}`, newNodeClass, newNode;

                if (row === START_ROW && col === START_COL) {
                    newNodeClass = 'start';
                }

                else if (row === FINISH_ROW && col === FINISH_COL) {
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
                // console.log(newNodeDiv);
                board.appendChild(newNodeDiv);
                
            }
            gridBoard.nodesMatrix.push(newGridArr);
        }
        //console.log(gridBoard);
    }

    createGrid();
}); 