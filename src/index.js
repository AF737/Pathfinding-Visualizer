'use strict';

import Node from './node.js';
import Board from './board.js';
import {dijkstra} from './algorithms/dijkstra.js';
import {aStar} from './algorithms/aStar.js';
import {greedyBFS} from './algorithms/greedyBFS.js';
import {breadthFirstSearch} from './algorithms/breadthFirstSearch.js';
import {bidirectionalDijkstra} from './algorithms/bidirectionalDijkstra.js';
import {bidirectionalAStar} from './algorithms/bidirectionalAStar.js';
import {depthFirstSearch} from './algorithms/depthFirstSearch.js';

document.addEventListener('DOMContentLoaded', function() {
    var dijkstraButton = document.getElementById('dijkstra');
    var gridBoard = new Board();
    var START_COL, START_ROW, FINISH_COL, FINISH_ROW;
    const ANIMATION_SPEED = 10;
    const NODE_WEIGHT_NONE = 1;
    const NODE_WEIGHT_LIGHT = 15;
    const NODE_WEIGHT_NORMAL = 30;
    const NODE_WEIGHT_HEAVY = 45;
    var aStarButton = document.getElementById('astar');
    var greedyBFSButton = document.getElementById('greedyBFS');
    var breadthFirstSearchButton = document.getElementById('breadthFirstSearch');
    var bidirectionalDijkstraButton = document.getElementById('bidirectionalDijkstra');
    var bidirectionalAStarButton = document.getElementById('bidirectionalAStar');
    var depthFirstSearchButton = document.getElementById('depthFirstSearch');

    /* TODO:
       - Clean up code
       - Decide if className should stay or be replaced with isStart, isFinish...
        because both do the same thing */

    document.addEventListener('keydown', function(ev) {
        gridBoard.pressedKey = ev.key;
    });

    document.addEventListener('keyup', function(ev) {
        gridBoard.pressedKey = null;
    });

    dijkstraButton.addEventListener('click', function() {
        let startNode = gridBoard.nodesMatrix[START_ROW][START_COL];
        let finishNode = gridBoard.nodesMatrix[FINISH_ROW][FINISH_COL];

        const [visitedNodes, shortestPath] = dijkstra(gridBoard, startNode, finishNode);
        //const shortestP = shortestPath(finishNode);
        //console.log(visitedNodes);
        animateAlgorithm(visitedNodes, null, shortestPath);
    });

    aStarButton.addEventListener('click', function() {
        let startNode = gridBoard.nodesMatrix[START_ROW][START_COL];
        let finishNode = gridBoard.nodesMatrix[FINISH_ROW][FINISH_COL];

        const [visitedNodes, shortestPath] = aStar(gridBoard, startNode, finishNode);
        animateAlgorithm(visitedNodes, null, shortestPath);
    });

    greedyBFSButton.addEventListener('click', function() {
        let startNode = gridBoard.nodesMatrix[START_ROW][START_COL];
        let finishNode = gridBoard.nodesMatrix[FINISH_ROW][FINISH_COL];

        const [visitedNodes, path] = greedyBFS(gridBoard, startNode, finishNode);
        animateAlgorithm(visitedNodes, null, path);
    });

    breadthFirstSearchButton.addEventListener('click', function() {
        let startNode = gridBoard.nodesMatrix[START_ROW][START_COL];
        let finishNode = gridBoard.nodesMatrix[FINISH_ROW][FINISH_COL];

        for (let row = 0; row < gridBoard.rows; row++) {
            for (let col = 0; col < gridBoard.columns; col++) {
                if(gridBoard.nodesMatrix[row][col].weight !== NODE_WEIGHT_NONE) {
                    changeWeightOfNode(`node-${row}-${col}`, NODE_WEIGHT_NONE);
                    document.getElementById(`node-${row}-${col}`).className = 'unvisited';
                }
            }
        }

        const [visitedNodes, shortestPath] = breadthFirstSearch(gridBoard, startNode, finishNode);
        animateAlgorithm(visitedNodes, null, shortestPath);
    });

    bidirectionalDijkstraButton.addEventListener('click', function() {
        let startNode = gridBoard.nodesMatrix[START_ROW][START_COL];
        let finishNode = gridBoard.nodesMatrix[FINISH_ROW][FINISH_COL];

        const [visitedNodesFromStart, visitedNodesFromFinish, path] =
            bidirectionalDijkstra(gridBoard, startNode, finishNode);
            
            animateAlgorithm(visitedNodesFromStart, visitedNodesFromFinish, path);
    });

    bidirectionalAStarButton.addEventListener('click', function() {
        let startNode = gridBoard.nodesMatrix[START_ROW][START_COL];
        let finishNode = gridBoard.nodesMatrix[FINISH_ROW][FINISH_COL];

        const [visitedNodesFromStart, visitedNodesFromFinish, path] =
            bidirectionalAStar(gridBoard, startNode, finishNode);

            animateAlgorithm(visitedNodesFromStart, visitedNodesFromFinish, path);
    });

    depthFirstSearchButton.addEventListener('click', function() {
        let startNode = gridBoard.nodesMatrix[START_ROW][START_COL];
        let finishNode = gridBoard.nodesMatrix[FINISH_ROW][FINISH_COL];

        for (let row = 0; row < gridBoard.rows; row++) {
            for (let col = 0; col < gridBoard.columns; col++) {
                if(gridBoard.nodesMatrix[row][col].weight !== NODE_WEIGHT_NONE) {
                    changeWeightOfNode(`node-${row}-${col}`, NODE_WEIGHT_NONE);
                    document.getElementById(`node-${row}-${col}`).className = 'unvisited';
                }
            }
        }

        const [visitedNodesFromStart, path] = depthFirstSearch(gridBoard, startNode, finishNode);

        animateAlgorithm(visitedNodesFromStart, null, path);
    });

    function animateAlgorithm(visitedNodesFromStart, visitedNodesFromFinish, shortestPath) {
        for (let i = 0; i < visitedNodesFromStart.length; i++) {
            setTimeout(function() {
                const currentNode = visitedNodesFromStart[i];
                //console.log(currentNode);
                document.getElementById(`node-${currentNode.row}-${currentNode.column}`)
                    .className = 'visited';
            }, i * ANIMATION_SPEED);
        }

        if (visitedNodesFromFinish !== null) {
            for (let i = 0; i < visitedNodesFromFinish.length; i++) {
                setTimeout(function() {
                    const currentNode = visitedNodesFromFinish[i];
                    //console.log(currentNode);
                    document.getElementById(`node-${currentNode.row}-${currentNode.column}`)
                        .className = 'visited';
                }, i * ANIMATION_SPEED);
            }
        }

        if (shortestPath !== null) {
            for (let i = 0; i < shortestPath.length; i++) {
                setTimeout(function() {
                    const currentNode = shortestPath[i];
                    document.getElementById(`node-${currentNode.row}-${currentNode.column}`)
                        .className = 'shortestPath';
                }, (visitedNodesFromStart.length + i) * ANIMATION_SPEED);
            }
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
                let isStart = false;
                let isFinish = false;

                if (row === START_ROW && col === START_COL) {
                    newNodeClass = 'start';
                    isStart = true;
                }

                else if (row === FINISH_ROW && col === FINISH_COL) {
                    newNodeClass = 'finish';
                    isFinish = true;
                }

                else {
                    newNodeClass = 'unvisited';
                }

                newNode = new Node(newNodeIndex, row, col, newNodeClass, isStart, isFinish);
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
                    handleMouseDownAndEnter(ev, this, 'mouseDown');
                });

                newNodeDiv.addEventListener('mouseenter', function(ev) {
                    handleMouseDownAndEnter(ev, this, 'mouseEnter');
                });

                newNodeDiv.addEventListener('mouseup', function(ev) {
                    ev.preventDefault();

                    gridBoard.mouseIsPressed = false;
                });

                // console.log(newNodeDiv);
                board.appendChild(newNodeDiv);
                
            }
            gridBoard.nodesMatrix.push(newGridArr);
        }
        //console.log(gridBoard);
    }

    createGrid();

    function handleMouseDownAndEnter(ev, actualThis, mouseEvent) {
        ev.preventDefault();

        if (mouseEvent === 'mouseDown') {
            gridBoard.mouseIsPressed = true;
        }

        else if (gridBoard.mouseIsPressed === false && 
            mouseEvent === 'mouseEnter') {
                return;
        }

        if (gridBoard.pressedKey === null) {
            switch(actualThis.className) {
                case 'unvisited':
                case 'lightWeight':
                case 'normalWeight':
                case 'heavyWeight':
                    actualThis.className = 'wall';
                    changeWallStatus(actualThis.id, true);
                    changeWeightOfNode(actualThis.id, NODE_WEIGHT_NONE);

                    break;

                case 'wall':
                    actualThis.className = 'unvisited';
                    changeWallStatus(actualThis.id, false);

                    break;
            }
        }

        else if (gridBoard.pressedKey === 'q') {
            switch(actualThis.className) {
                case 'unvisited':
                case 'wall':
                case 'normalWeight':
                case 'heavyWeight':
                    actualThis.className = 'lightWeight';
                    changeWeightOfNode(actualThis.id, NODE_WEIGHT_LIGHT);

                    break;

                case 'lightWeight':
                    actualThis.className = 'unvisited';
                    changeWeightOfNode(actualThis.id, NODE_WEIGHT_NONE);

                    break;
            }
        }

        else if (gridBoard.pressedKey === 'w') {
            switch(actualThis.className) {
                case 'unvisited':
                case 'wall':
                case 'lightWeight':
                case 'heavyWeight':
                    actualThis.className = 'normalWeight';
                    changeWeightOfNode(actualThis.id, NODE_WEIGHT_NORMAL);

                    break;
                
                case 'normalWeight':
                    actualThis.className = 'unvisited';
                    changeWeightOfNode(actualThis.id, NODE_WEIGHT_NONE);

                    break;
            }
        }

        else if (gridBoard.pressedKey === 'e') {
            switch(actualThis.className) {
                case 'unvisited':
                case 'wall':
                case 'lightWeight':
                case 'normalWeight':
                    actualThis.className = 'heavyWeight';
                    changeWeightOfNode(actualThis.id, NODE_WEIGHT_HEAVY);

                    break;

                case 'heavyWeight':
                    actualThis.className = 'unvisited';
                    changeWeightOfNode(actualThis.id, NODE_WEIGHT_NONE);

                    break;
            }
        }
    }

    function changeWeightOfNode(id, newWeight) {
        const [descriptor, row, col] = id.split('-');

        gridBoard.nodesMatrix[row][col].weight = newWeight;
    }

    function changeWallStatus(id, newWallStatus) {
        const [descriptor, row, col] = id.split('-');

        gridBoard.nodesMatrix[row][col].isWall = newWallStatus;
    }
}); 